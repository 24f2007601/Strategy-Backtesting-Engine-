import { BacktestRequest, BacktestResponse, TickerInfo } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";

export const DEFAULT_INDICES: TickerInfo[] = [
  { symbol: "^GSPC", name: "S&P 500", category: "Index", region: "United States" },
  { symbol: "^IXIC", name: "NASDAQ Composite", category: "Index", region: "United States" },
  { symbol: "^DJI", name: "Dow Jones", category: "Index", region: "United States" },
  { symbol: "^NSEI", name: "NIFTY 50", category: "Index", region: "India" },
  { symbol: "^BSESN", name: "SENSEX", category: "Index", region: "India" },
  { symbol: "^FTSE", name: "FTSE 100", category: "Index", region: "United Kingdom" },
  { symbol: "^GDAXI", name: "DAX 40", category: "Index", region: "Germany" },
  { symbol: "^N225", name: "Nikkei 225", category: "Index", region: "Japan" },
  { symbol: "^HSI", name: "Hang Seng", category: "Index", region: "Hong Kong" },
  { symbol: "BTC-USD", name: "Bitcoin USD", category: "Crypto", region: "Global" },
  { symbol: "ETH-USD", name: "Ethereum USD", category: "Crypto", region: "Global" },
  { symbol: "AAPL", name: "Apple Inc.", category: "Equity", region: "United States" },
  { symbol: "NVDA", name: "NVIDIA Corp.", category: "Equity", region: "United States" },
  { symbol: "TSLA", name: "Tesla Inc.", category: "Equity", region: "United States" },
];

export async function fetchGlobalIndices(): Promise<TickerInfo[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2500);

  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/indices`, {
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return DEFAULT_INDICES;
    }
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : DEFAULT_INDICES;
  } catch (_error) {
    clearTimeout(timeoutId);
    // Return static default catalog list gracefully if backend is offline or starting up
    return DEFAULT_INDICES;
  }
}

export async function runBacktestApi(payload: BacktestRequest): Promise<BacktestResponse> {
  try {
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
  } catch (error: any) {
    if (error.name === "TypeError" || error.message?.includes("fetch")) {
      throw new Error(
        `Backend API unreachable at ${API_BASE_URL}. Please start the backend FastAPI server: "cd backend && uvicorn app.main:app --port 8001"`
      );
    }
    throw error;
  }
}
