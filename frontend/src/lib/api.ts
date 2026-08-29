import { BacktestRequest, BacktestResponse, TickerInfo } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";

export async function fetchGlobalIndices(): Promise<TickerInfo[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/indices`, {
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch indices: ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("API error fetching indices:", error);
    // Fallback static list if server is starting
    return [
      { symbol: "^GSPC", name: "S&P 500", category: "Index", region: "United States" },
      { symbol: "^IXIC", name: "NASDAQ Composite", category: "Index", region: "United States" },
      { symbol: "^NSEI", name: "NIFTY 50", category: "Index", region: "India" },
      { symbol: "^FTSE", name: "FTSE 100", category: "Index", region: "United Kingdom" },
      { symbol: "^N225", name: "Nikkei 225", category: "Index", region: "Japan" },
      { symbol: "BTC-USD", name: "Bitcoin USD", category: "Crypto", region: "Global" },
      { symbol: "AAPL", name: "Apple Inc.", category: "Equity", region: "United States" },
    ];
  }
}

export async function runBacktestApi(payload: BacktestRequest): Promise<BacktestResponse> {
  const res = await fetch(`${API_BASE_URL}/api/v1/backtest`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(errData.detail || "Backtest execution failed.");
  }

  return await res.json();
}
