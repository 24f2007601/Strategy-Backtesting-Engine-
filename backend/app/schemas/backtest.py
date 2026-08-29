from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class BacktestRequest(BaseModel):
    ticker: str = Field(default="^GSPC", description="Ticker symbol or index symbol (e.g., ^GSPC, ^NSEI, AAPL, BTC-USD)")
    start_date: str = Field(default="2022-01-01", description="Start date YYYY-MM-DD")
    end_date: str = Field(default="2024-01-01", description="End date YYYY-MM-DD")
    interval: str = Field(default="1d", description="Timeframe interval: 1d, 1wk, 1mo, 1h, 15m, 5m")
    initial_capital: float = Field(default=10000.0, description="Starting capital in USD")
    commission_pct: float = Field(default=0.1, description="Commission fee percentage per trade (e.g. 0.1%)")
    slippage_pct: float = Field(default=0.05, description="Slippage percentage per trade (e.g. 0.05%)")
    strategy_type: str = Field(default="sma_crossover", description="Strategy type: custom_code, sma_crossover, rsi, momentum")
    python_code: Optional[str] = Field(default=None, description="Custom Python strategy code if strategy_type=='custom_code'")
    short_window: int = Field(default=20, description="Short window for moving average")
    long_window: int = Field(default=50, description="Long window for moving average")
    rsi_period: int = Field(default=14, description="RSI calculation period")
    rsi_overbought: float = Field(default=70.0, description="RSI overbought threshold")
    rsi_oversold: float = Field(default=30.0, description="RSI oversold threshold")

class MetricSummary(BaseModel):
    initial_capital: float
    final_portfolio_value: float
    total_return_pct: float
    benchmark_return_pct: float
    annualized_return_cagr: float
    sharpe_ratio: float
    max_drawdown_pct: float
    win_rate_pct: float
    total_trades: int
    profit_factor: float
    annualized_volatility: float
    total_fees_paid: float

class EquityDataPoint(BaseModel):
    date: str
    strategy_value: float
    benchmark_value: float
    drawdown_pct: float

class CandlestickPoint(BaseModel):
    time: str
    open: float
    high: float
    low: float
    close: float
    volume: float

class TradeRecord(BaseModel):
    id: int
    date: str
    type: str  # BUY or SELL
    price: float
    shares: float
    value: float
    fee: float

class BacktestResponse(BaseModel):
    ticker: str
    ticker_name: str
    currency: str
    interval: str
    metrics: MetricSummary
    equity_curve: List[EquityDataPoint]
    candlesticks: List[CandlestickPoint]
    trades: List[TradeRecord]
    logs: List[str]

class TickerInfo(BaseModel):
    symbol: str
    name: str
    category: str
    region: str
