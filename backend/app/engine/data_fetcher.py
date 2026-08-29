import pandas as pd
import yfinance as yf
from typing import Dict, Any, Tuple

# Pre-defined catalog of global indices and major assets
POPULAR_INDICES = [
    {"symbol": "^GSPC", "name": "S&P 500", "category": "Index", "region": "United States"},
    {"symbol": "^IXIC", "name": "NASDAQ Composite", "category": "Index", "region": "United States"},
    {"symbol": "^DJI", "name": "Dow Jones Industrial", "category": "Index", "region": "United States"},
    {"symbol": "^NSEI", "name": "NIFTY 50", "category": "Index", "region": "India"},
    {"symbol": "^BSESN", "name": "SENSEX", "category": "Index", "region": "India"},
    {"symbol": "^FTSE", "name": "FTSE 100", "category": "Index", "region": "United Kingdom"},
    {"symbol": "^GDAXI", "name": "DAX 40", "category": "Index", "region": "Germany"},
    {"symbol": "^N225", "name": "Nikkei 225", "category": "Index", "region": "Japan"},
    {"symbol": "^HSI", "name": "Hang Seng Index", "category": "Index", "region": "Hong Kong"},
    {"symbol": "BTC-USD", "name": "Bitcoin USD", "category": "Crypto", "region": "Global"},
    {"symbol": "ETH-USD", "name": "Ethereum USD", "category": "Crypto", "region": "Global"},
    {"symbol": "AAPL", "name": "Apple Inc.", "category": "Equity", "region": "United States"},
    {"symbol": "MSFT", "name": "Microsoft Corp.", "category": "Equity", "region": "United States"},
    {"symbol": "NVDA", "name": "NVIDIA Corp.", "category": "Equity", "region": "United States"},
    {"symbol": "TSLA", "name": "Tesla Inc.", "category": "Equity", "region": "United States"},
    {"symbol": "RELIANCE.NS", "name": "Reliance Industries", "category": "Equity", "region": "India"},
]

_data_cache: Dict[str, pd.DataFrame] = {}

def get_ticker_metadata(symbol: str) -> Dict[str, str]:
    for item in POPULAR_INDICES:
        if item["symbol"].upper() == symbol.upper():
            return item
    return {"symbol": symbol, "name": symbol, "category": "Global Ticker", "region": "Global"}

def fetch_market_data(ticker: str, start_date: str, end_date: str, interval: str = "1d") -> Tuple[pd.DataFrame, str]:
    """
    Fetches historical OHLCV data for a ticker using yfinance.
    Supports intervals: '1d', '1wk', '1mo', '1h', '15m', '5m'.
    Returns (DataFrame, TickerName).
    """
    cache_key = f"{ticker}_{start_date}_{end_date}_{interval}"
    if cache_key in _data_cache:
        meta = get_ticker_metadata(ticker)
        return _data_cache[cache_key].copy(), meta["name"]

    try:
        yf_ticker = yf.Ticker(ticker)
        df = yf_ticker.history(start=start_date, end=end_date, interval=interval, auto_adjust=True)

        if df.empty:
            df = yf.download(ticker, start=start_date, end=end_date, interval=interval, progress=False)

        if df.empty:
            raise ValueError(f"No market data found for ticker '{ticker}' between {start_date} and {end_date} with interval '{interval}'.")

        # Normalize column names
        df.columns = [col.capitalize() for col in df.columns]
        if 'Date' not in df.columns and 'Datetime' not in df.columns:
            df = df.reset_index()

        # Format date/time column
        date_col = 'Datetime' if 'Datetime' in df.columns else 'Date'
        if date_col in df.columns:
            if interval in ['1h', '15m', '5m']:
                df['Date'] = pd.to_datetime(df[date_col]).dt.strftime('%Y-%m-%d %H:%M')
            else:
                df['Date'] = pd.to_datetime(df[date_col]).dt.strftime('%Y-%m-%d')

        # Clean NaN values
        df = df.dropna(subset=['Close'])
        df['Open'] = df['Open'].fillna(df['Close'])
        df['High'] = df['High'].fillna(df['Close'])
        df['Low'] = df['Low'].fillna(df['Close'])
        df['Volume'] = df['Volume'].fillna(0)

        # Cache data
        _data_cache[cache_key] = df

        meta = get_ticker_metadata(ticker)
        name = meta["name"]
        if name == ticker:
            try:
                name = yf_ticker.info.get('shortName', ticker)
            except Exception:
                pass

        return df.copy(), name
    except Exception as e:
        raise RuntimeError(f"Error fetching data for ticker {ticker}: {str(e)}")
