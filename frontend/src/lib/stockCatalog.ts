import { TickerInfo } from "./types";

export const STOCK_SEARCH_CATALOG: TickerInfo[] = [
  // US Major Equities
  { symbol: "AAPL", name: "Apple Inc.", category: "Equity", region: "United States" },
  { symbol: "MSFT", name: "Microsoft Corporation", category: "Equity", region: "United States" },
  { symbol: "NVDA", name: "NVIDIA Corporation", category: "Equity", region: "United States" },
  { symbol: "TSLA", name: "Tesla Motors Inc.", category: "Equity", region: "United States" },
  { symbol: "GOOGL", name: "Alphabet Inc. (Google)", category: "Equity", region: "United States" },
  { symbol: "AMZN", name: "Amazon.com Inc.", category: "Equity", region: "United States" },
  { symbol: "META", name: "Meta Platforms Inc. (Facebook)", category: "Equity", region: "United States" },
  { symbol: "NFLX", name: "Netflix Inc.", category: "Equity", region: "United States" },
  { symbol: "AMD", name: "Advanced Micro Devices", category: "Equity", region: "United States" },
  { symbol: "INTC", name: "Intel Corporation", category: "Equity", region: "United States" },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", category: "Equity", region: "United States" },
  { symbol: "BRK-B", name: "Berkshire Hathaway Inc.", category: "Equity", region: "United States" },
  { symbol: "WMT", name: "Walmart Inc.", category: "Equity", region: "United States" },
  { symbol: "DIS", name: "The Walt Disney Company", category: "Equity", region: "United States" },

  // Indian Equities
  { symbol: "RELIANCE.NS", name: "Reliance Industries", category: "Equity", region: "India" },
  { symbol: "TCS.NS", name: "Tata Consultancy Services", category: "Equity", region: "India" },
  { symbol: "HDFCBANK.NS", name: "HDFC Bank Ltd.", category: "Equity", region: "India" },
  { symbol: "ICICIBANK.NS", name: "ICICI Bank Ltd.", category: "Equity", region: "India font-sans" },
  { symbol: "INFY.NS", name: "Infosys Ltd.", category: "Equity", region: "India" },
  { symbol: "TATAMOTORS.NS", name: "Tata Motors Ltd.", category: "Equity", region: "India" },
  { symbol: "SBIN.NS", name: "State Bank of India", category: "Equity", region: "India" },
  { symbol: "BHARTIARTL.NS", name: "Bharti Airtel Ltd.", category: "Equity", region: "India" },
  { symbol: "ITC.NS", name: "ITC Limited", category: "Equity", region: "India" },
  { symbol: "LT.NS", name: "Larsen & Toubro Ltd.", category: "Equity", region: "India" },

  // Global Indices
  { symbol: "^GSPC", name: "S&P 500 Index", category: "Index", region: "United States" },
  { symbol: "^IXIC", name: "NASDAQ Composite Index", category: "Index", region: "United States" },
  { symbol: "^DJI", name: "Dow Jones Industrial Average", category: "Index", region: "United States" },
  { symbol: "^NSEI", name: "NIFTY 50 Index", category: "Index", region: "India" },
  { symbol: "^BSESN", name: "BSE SENSEX Index", category: "Index", region: "India" },
  { symbol: "^FTSE", name: "FTSE 100 Index", category: "Index", region: "United Kingdom" },
  { symbol: "^GDAXI", name: "DAX 40 Index", category: "Index", region: "Germany" },
  { symbol: "^N225", name: "Nikkei 225 Index", category: "Index", region: "Japan" },
  { symbol: "^HSI", name: "Hang Seng Index", category: "Index", region: "Hong Kong" },

  // Crypto Assets
  { symbol: "BTC-USD", name: "Bitcoin USD", category: "Crypto", region: "Global" },
  { symbol: "ETH-USD", name: "Ethereum USD", category: "Crypto", region: "Global" },
  { symbol: "SOL-USD", name: "Solana USD", category: "Crypto", region: "Global" },
];

/**
 * Searches the stock catalog for matching company names or ticker symbols.
 */
export function searchStockSuggestions(query: string, maxResults: number = 8): TickerInfo[] {
  if (!query || query.trim().length === 0) return [];

  const cleanQuery = query.trim().toLowerCase();

  return STOCK_SEARCH_CATALOG.filter((item) => {
    const matchName = item.name.toLowerCase().includes(cleanQuery);
    const matchSymbol = item.symbol.toLowerCase().includes(cleanQuery);
    return matchName || matchSymbol;
  }).slice(0, maxResults);
}
