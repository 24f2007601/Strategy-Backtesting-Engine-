export interface TickerInfo {
  symbol: string;
  name: string;
  category: string;
  region: string;
}

export interface BacktestRequest {
  ticker: string;
  start_date: string;
  end_date: string;
  interval: string;
  initial_capital: number;
  commission_pct: number;
  slippage_pct: number;
  strategy_type: "custom_code" | "sma_crossover" | "rsi" | "momentum";
  python_code?: string;
  short_window: number;
  long_window: number;
  rsi_period: number;
  rsi_overbought: number;
  rsi_oversold: number;
}

export interface MetricSummary {
  initial_capital: number;
  final_portfolio_value: number;
  total_return_pct: number;
  benchmark_return_pct: number;
  annualized_return_cagr: number;
  sharpe_ratio: number;
  max_drawdown_pct: number;
  win_rate_pct: number;
  total_trades: number;
  profit_factor: number;
  annualized_volatility: number;
  total_fees_paid: number;
}

export interface EquityDataPoint {
  date: string;
  strategy_value: number;
  benchmark_value: number;
  drawdown_pct: number;
}

export interface CandlestickPoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TradeRecord {
  id: number;
  date: string;
  type: "BUY" | "SELL";
  price: number;
  shares: number;
  value: number;
  fee: number;
}

export interface BacktestResponse {
  ticker: string;
  ticker_name: string;
  currency: string;
  interval: string;
  metrics: MetricSummary;
  equity_curve: EquityDataPoint[];
  candlesticks: CandlestickPoint[];
  trades: TradeRecord[];
  logs: string[];
}
