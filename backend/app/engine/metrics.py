import numpy as np
import pandas as pd
from typing import Dict, Any

def calculate_performance_metrics(
    portfolio_history: pd.DataFrame,
    benchmark_series: pd.Series,
    trades_df: pd.DataFrame,
    initial_capital: float
) -> Dict[str, Any]:
    """
    Computes risk-adjusted performance metrics for strategy vs benchmark.
    """
    final_val = portfolio_history['Portfolio_Value'].iloc[-1]
    total_return_pct = ((final_val - initial_capital) / initial_capital) * 100.0

    b_start = benchmark_series.iloc[0]
    b_end = benchmark_series.iloc[-1]
    benchmark_return_pct = ((b_end - b_start) / b_start) * 100.0 if b_start != 0 else 0.0

    # Number of trading bars
    num_days = len(portfolio_history)
    years = num_days / 252.0 if num_days > 0 else 1.0

    # CAGR
    if final_val > 0 and years > 0:
        cagr = (((final_val / initial_capital) ** (1.0 / years)) - 1.0) * 100.0
    else:
        cagr = 0.0

    # Daily returns & Sharpe Ratio
    daily_returns = portfolio_history['Daily_Return'].dropna()
    avg_daily_ret = daily_returns.mean()
    daily_vol = daily_returns.std()
    
    annualized_vol = (daily_vol * np.sqrt(252.0)) * 100.0 if not np.isnan(daily_vol) else 0.0
    
    if daily_vol > 0 and not np.isnan(daily_vol):
        sharpe_ratio = (avg_daily_ret / daily_vol) * np.sqrt(252.0)
    else:
        sharpe_ratio = 0.0

    # Max Drawdown
    peak = portfolio_history['Portfolio_Value'].cummax()
    drawdown = (portfolio_history['Portfolio_Value'] - peak) / peak
    max_drawdown_pct = float(drawdown.min() * 100.0) if not drawdown.empty else 0.0

    # Trade statistics
    total_trades = len(trades_df)
    total_fees_paid = 0.0
    
    if total_trades > 0 and 'fee' in trades_df.columns:
        total_fees_paid = float(trades_df['fee'].sum())

    if total_trades > 1:
        trades_list = trades_df.to_dict('records')
        winning_trades = 0
        losing_trades = 0
        total_gains = 0.0
        total_losses = 0.0
        
        buy_price = None
        for t in trades_list:
            if t['type'] == 'BUY':
                buy_price = t['price']
            elif t['type'] == 'SELL' and buy_price is not None:
                pnl = t['price'] - buy_price
                if pnl > 0:
                    winning_trades += 1
                    total_gains += pnl
                else:
                    losing_trades += 1
                    total_losses += abs(pnl)
                buy_price = None

        completed_pairs = winning_trades + losing_trades
        win_rate_pct = (winning_trades / completed_pairs * 100.0) if completed_pairs > 0 else 0.0
        profit_factor = (total_gains / total_losses) if total_losses > 0 else (total_gains if total_gains > 0 else 1.0)
    else:
        win_rate_pct = 0.0
        profit_factor = 0.0

    return {
        "initial_capital": round(initial_capital, 2),
        "final_portfolio_value": round(final_val, 2),
        "total_return_pct": round(total_return_pct, 2),
        "benchmark_return_pct": round(benchmark_return_pct, 2),
        "annualized_return_cagr": round(cagr, 2),
        "sharpe_ratio": round(float(sharpe_ratio), 2),
        "max_drawdown_pct": round(abs(max_drawdown_pct), 2),
        "win_rate_pct": round(win_rate_pct, 2),
        "total_trades": total_trades,
        "profit_factor": round(profit_factor, 2),
        "annualized_volatility": round(annualized_vol, 2),
        "total_fees_paid": round(total_fees_paid, 2)
    }
