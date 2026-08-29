import pandas as pd
import numpy as np
import traceback
from typing import Dict, Any, List, Tuple
from app.schemas.backtest import BacktestRequest, BacktestResponse, MetricSummary, EquityDataPoint, CandlestickPoint, TradeRecord
from app.engine.data_fetcher import fetch_market_data
from app.engine.metrics import calculate_performance_metrics

def apply_builtin_strategy(df: pd.DataFrame, req: BacktestRequest) -> Tuple[pd.Series, List[str]]:
    logs = []
    signals = pd.Series(0, index=df.index)
    
    if req.strategy_type == "sma_crossover":
        short_w = max(1, req.short_window)
        long_w = max(short_w + 1, req.long_window)
        logs.append(f"Executing SMA Crossover strategy (Short={short_w}, Long={long_w})")
        
        sma_short = df['Close'].rolling(window=short_w).mean()
        sma_long = df['Close'].rolling(window=long_w).mean()
        
        signals[sma_short > sma_long] = 1
        signals[sma_short <= sma_long] = -1
        
    elif req.strategy_type == "rsi":
        period = max(2, req.rsi_period)
        overbought = req.rsi_overbought
        oversold = req.rsi_oversold
        logs.append(f"Executing RSI Mean Reversion strategy (Period={period}, Oversold={oversold}, Overbought={overbought})")
        
        delta = df['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
        
        rs = gain / (loss + 1e-10)
        rsi = 100 - (100 / (1 + rs))
        
        position = 0
        pos_list = []
        for r in rsi:
            if r < oversold:
                position = 1
            elif r > overbought:
                position = -1
            pos_list.append(position)
        signals = pd.Series(pos_list, index=df.index)
        
    elif req.strategy_type == "momentum":
        logs.append(f"Executing Momentum Breakout strategy (Lookback=20)")
        highest = df['High'].shift(1).rolling(window=20).max()
        lowest = df['Low'].shift(1).rolling(window=20).min()
        
        signals[df['Close'] > highest] = 1
        signals[df['Close'] < lowest] = -1
    else:
        logs.append(f"Unknown built-in strategy: {req.strategy_type}. Defaulting to Buy & Hold.")
        signals[:] = 1

    return signals, logs

def execute_custom_python(df: pd.DataFrame, code_str: str) -> Tuple[pd.Series, List[str]]:
    logs = []
    logs.append("Parsing custom Python strategy code...")
    
    local_scope = {'pd': pd, 'np': np}
    try:
        exec(code_str, local_scope)
        if 'generate_signals' in local_scope and callable(local_scope['generate_signals']):
            logs.append("Executing custom generate_signals(df) function...")
            raw_sig = local_scope['generate_signals'](df.copy())
            if isinstance(raw_sig, pd.Series):
                signals = raw_sig.fillna(0).astype(int)
            else:
                signals = pd.Series(raw_sig, index=df.index).fillna(0).astype(int)
        elif 'signals' in local_scope:
            logs.append("Reading 'signals' variable from global scope...")
            raw_sig = local_scope['signals']
            signals = pd.Series(raw_sig, index=df.index).fillna(0).astype(int)
        else:
            raise ValueError("Your Python code must define either a function `generate_signals(df)` or a variable `signals`.")
            
        logs.append("Custom Python strategy executed successfully.")
        return signals, logs
    except Exception as e:
        err_msg = f"Python Execution Error: {str(e)}\n{traceback.format_exc()}"
        logs.append(f"CRITICAL ERROR: {err_msg}")
        return pd.Series(0, index=df.index), logs

def run_backtest(req: BacktestRequest) -> BacktestResponse:
    # 1. Fetch Market Data with Interval
    df, ticker_name = fetch_market_data(req.ticker, req.start_date, req.end_date, interval=req.interval)
    logs = [f"Loaded market data for {ticker_name} ({req.ticker}) - Timeframe: {req.interval} with {len(df)} bars."]
    logs.append(f"Trade Execution Settings: Commission={req.commission_pct}%, Slippage={req.slippage_pct}%")

    # 2. Generate Signals
    if req.strategy_type == "custom_code" and req.python_code and req.python_code.strip():
        raw_signals, custom_logs = execute_custom_python(df, req.python_code)
        logs.extend(custom_logs)
    else:
        raw_signals, builtin_logs = apply_builtin_strategy(df, req)
        logs.extend(builtin_logs)

    signals = raw_signals.fillna(0)
    signals = np.where(signals > 0, 1, np.where(signals < 0, -1, 0))
    df['Signal'] = signals

    # 3. Portfolio Simulation with Commission & Slippage
    cash = req.initial_capital
    position = 0.0
    portfolio_values = []
    trades: List[TradeRecord] = []
    trade_id = 1
    
    comm_rate = max(0.0, req.commission_pct / 100.0)
    slip_rate = max(0.0, req.slippage_pct / 100.0)

    prev_sig = 0
    for idx, row in df.iterrows():
        date_str = str(row['Date']) if 'Date' in row else str(idx)
        raw_price = float(row['Close'])
        sig = int(row['Signal'])

        if sig == 1 and prev_sig != 1:
            # BUY Signal
            if cash > 0 and raw_price > 0:
                # Apply slippage (pay slightly higher price on buy)
                exec_price = raw_price * (1.0 + slip_rate)
                fee = cash * comm_rate
                net_cash_for_buy = cash - fee
                
                position = net_cash_for_buy / exec_price
                cash = 0.0
                
                trades.append(TradeRecord(
                    id=trade_id,
                    date=date_str,
                    type="BUY",
                    price=round(exec_price, 2),
                    shares=round(position, 4),
                    value=round(net_cash_for_buy, 2),
                    fee=round(fee, 2)
                ))
                trade_id += 1
                prev_sig = 1
        elif sig == -1 and prev_sig == 1:
            # SELL Signal
            if position > 0:
                # Apply slippage (receive slightly lower price on sell)
                exec_price = raw_price * (1.0 - slip_rate)
                gross_val = position * exec_price
                fee = gross_val * comm_rate
                cash = gross_val - fee
                
                trades.append(TradeRecord(
                    id=trade_id,
                    date=date_str,
                    type="SELL",
                    price=round(exec_price, 2),
                    shares=round(position, 4),
                    value=round(cash, 2),
                    fee=round(fee, 2)
                ))
                trade_id += 1
                position = 0.0
                prev_sig = -1

        current_val = cash + (position * raw_price)
        portfolio_values.append(current_val)

    df['Portfolio_Value'] = portfolio_values
    df['Daily_Return'] = df['Portfolio_Value'].pct_change().fillna(0)

    # Benchmark calculation
    b_start_price = float(df['Close'].iloc[0])
    df['Benchmark_Value'] = (df['Close'] / b_start_price) * req.initial_capital

    # Peak & Drawdown
    df['Peak'] = df['Portfolio_Value'].cummax()
    df['Drawdown_Pct'] = (df['Portfolio_Value'] - df['Peak']) / df['Peak'] * 100.0

    # 4. Calculate Metrics
    metrics_dict = calculate_performance_metrics(
        df[['Portfolio_Value', 'Daily_Return']],
        df['Benchmark_Value'],
        pd.DataFrame([t.model_dump() for t in trades]),
        req.initial_capital
    )
    metrics_summary = MetricSummary(**metrics_dict)
    logs.append(f"Backtest Complete. Total Return: {metrics_summary.total_return_pct}% vs Benchmark: {metrics_summary.benchmark_return_pct}%. Total Fees Paid: ${metrics_summary.total_fees_paid}")

    # 5. Format Output
    equity_curve: List[EquityDataPoint] = []
    candlesticks: List[CandlestickPoint] = []

    for idx, row in df.iterrows():
        d_str = str(row['Date'])
        equity_curve.append(EquityDataPoint(
            date=d_str,
            strategy_value=round(float(row['Portfolio_Value']), 2),
            benchmark_value=round(float(row['Benchmark_Value']), 2),
            drawdown_pct=round(abs(float(row['Drawdown_Pct'])), 2)
        ))
        candlesticks.append(CandlestickPoint(
            time=d_str,
            open=round(float(row['Open']), 2),
            high=round(float(row['High']), 2),
            low=round(float(row['Low']), 2),
            close=round(float(row['Close']), 2),
            volume=round(float(row['Volume']), 2)
        ))

    return BacktestResponse(
        ticker=req.ticker,
        ticker_name=ticker_name,
        currency="USD",
        interval=req.interval,
        metrics=metrics_summary,
        equity_curve=equity_curve,
        candlesticks=candlesticks,
        trades=trades,
        logs=logs
    )
