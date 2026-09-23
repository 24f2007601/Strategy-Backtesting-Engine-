import numpy as np
import pandas as pd
from typing import Dict, Any, List

TRADING_DAYS_PER_YEAR: float = 252.0
RISK_FREE_RATE: float = 0.02

def _compute_cagr(final_val: float, initial_capital: float, num_days: int) -> float:
    """Computes Compound Annual Growth Rate percentage."""
    years = num_days / TRADING_DAYS_PER_YEAR if num_days > 0 else 1.0
    if final_val > 0 and years > 0 and initial_capital > 0:
        return (((final_val / initial_capital) ** (1.0 / years)) - 1.0) * 100.0
    return 0.0

def _compute_sharpe_ratio(daily_returns: pd.Series) -> float:
    """Computes annualized Sharpe Ratio using risk-free rate."""
    clean_returns = daily_returns.dropna()
    avg_daily_ret = clean_returns.mean()
    daily_vol = clean_returns.std()
    
    if daily_vol > 0 and not np.isnan(daily_vol):
        return float((avg_daily_ret / daily_vol) * np.sqrt(TRADING_DAYS_PER_YEAR))
    return 0.0

def _compute_trade_statistics(trades_list: List[Dict[str, Any]]) -> Dict[str, float]:
    """Computes win rate and profit factor across completed trade pairs."""
    winning_trades = 0
    losing_trades = 0
    total_gains = 0.0
    total_losses = 0.0
    
    buy_price = None
    for trade in trades_list:
        if trade['type'] == 'BUY':
            buy_price = trade['price']
        elif trade['type'] == 'SELL' and buy_price is not None:
            pnl = trade['price'] - buy_price
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
    
    return {
        "win_rate_pct": win_rate_pct,
        "profit_factor": profit_factor,
    }

def calculate_performance_metrics(
    portfolio_history: pd.DataFrame,
    benchmark_series: pd.Series,
    trades_df: pd.DataFrame,
    initial_capital: float
) -> Dict[str, Any]:
    """
    Computes comprehensive risk-adjusted performance metrics for strategy vs benchmark.
    """
    final_val = float(portfolio_history['Portfolio_Value'].iloc[-1])
    total_return_pct = ((final_val - initial_capital) / initial_capital) * 100.0 if initial_capital > 0 else 0.0

    b_start = float(benchmark_series.iloc[0])
    b_end = float(benchmark_series.iloc[-1])
    benchmark_return_pct = ((b_end - b_start) / b_start) * 100.0 if b_start != 0 else 0.0

    cagr = _compute_cagr(final_val, initial_capital, len(portfolio_history))
    daily_returns = portfolio_history['Daily_Return'].dropna()
    sharpe = _compute_sharpe_ratio(daily_returns)
    
    daily_vol = daily_returns.std()
    annualized_vol = (daily_vol * np.sqrt(TRADING_DAYS_PER_YEAR)) * 100.0 if not np.isnan(daily_vol) else 0.0

    peak = portfolio_history['Portfolio_Value'].cummax()
    drawdown = (portfolio_history['Portfolio_Value'] - peak) / peak
    max_drawdown_pct = float(drawdown.min() * 100.0) if not drawdown.empty else 0.0

    total_trades = len(trades_df)
    total_fees_paid = float(trades_df['fee'].sum()) if total_trades > 0 and 'fee' in trades_df.columns else 0.0
    trade_stats = _compute_trade_statistics(trades_df.to_dict('records')) if total_trades > 1 else {"win_rate_pct": 0.0, "profit_factor": 0.0}

    return {
        "initial_capital": round(initial_capital, 2),
        "final_portfolio_value": round(final_val, 2),
        "total_return_pct": round(total_return_pct, 2),
        "benchmark_return_pct": round(benchmark_return_pct, 2),
        "annualized_return_cagr": round(cagr, 2),
        "sharpe_ratio": round(sharpe, 2),
        "max_drawdown_pct": round(abs(max_drawdown_pct), 2),
        "win_rate_pct": round(trade_stats["win_rate_pct"], 2),
        "total_trades": total_trades,
        "profit_factor": round(trade_stats["profit_factor"], 2),
        "annualized_volatility": round(annualized_vol, 2),
        "total_fees_paid": round(total_fees_paid, 2)
    }
