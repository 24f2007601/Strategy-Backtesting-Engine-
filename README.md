# QuantStudio — Strategy Backtesting Engine

> A quantitative trading strategy backtesting suite with a **FastAPI** execution engine and a **Next.js** interactive workbench. Write custom Python strategies or pick from 18 pre-built algorithms, test them against any global stock or index, and visualise risk-adjusted performance on professional-grade financial charts.

---

## ✨ Features

- **18 Pre-Built Strategies** — Trend following, mean reversion, momentum breakout, and advanced quant algorithms, ready to run out of the box.
- **Custom Python Strategies** — Write and execute your own `generate_signals(df)` function live in an embedded Monaco (VS Code) editor.
- **Global Asset Coverage** — Any stock or index supported by `yfinance`: S&P 500, NASDAQ, NIFTY 50, Nikkei 225, FTSE 100, DAX, crypto, and individual equities worldwide.
- **Multi-Timeframe Support** — Daily (`1d`), Weekly (`1wk`), Monthly (`1mo`), and intraday (`1h`, `15m`, `5m`) resolutions.
- **Commission & Slippage Modeling** — Configurable transaction fee % and slippage % applied on every executed trade.
- **TradingView Candlestick Chart** — OHLC candles, volume histogram, and colour-coded Buy/Sell execution markers.
- **Equity Curve & Drawdown** — Strategy portfolio growth vs Buy & Hold benchmark with drawdown shading.
- **Quantitative Metrics** — Total Return, CAGR, Sharpe Ratio, Max Drawdown, Win Rate, Profit Factor, Volatility, and Total Fees.
- **Trade Execution Log** — Full history table with date, signal type, price, shares, net value, and commission.
- **Glassmorphism UI** — Dark/Light mode with persistent theme preference.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Python 3.11, FastAPI, Uvicorn |
| **Data** | yfinance, Pandas, NumPy |
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS |
| **Charts** | TradingView Lightweight Charts v5, Recharts |
| **Editor** | Monaco Editor (`@monaco-editor/react`) |
| **Containers** | Docker, Docker Compose |

---

## 📂 Project Structure

```
Strategy-Backtesting-Engine/
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py             # REST endpoints
│       ├── engine/
│       │   ├── backtester.py   # Signal execution, portfolio simulation
│       │   ├── data_fetcher.py # yfinance + in-memory cache
│       │   └── metrics.py      # Sharpe, CAGR, Drawdown, Win Rate…
│       └── schemas/
│           └── backtest.py     # Pydantic request/response schemas
├── frontend/
│   ├── package.json
│   └── src/
│       ├── app/
│       │   ├── page.tsx        # Workbench layout & state controller
│       │   ├── layout.tsx      # App shell root
│       │   └── globals.css     # Glassmorphism design system
│       ├── components/
│       │   ├── Navbar.tsx
│       │   ├── TickerSelector.tsx
│       │   ├── BacktestControls.tsx
│       │   ├── CodeEditor.tsx
│       │   ├── CandlestickChart.tsx
│       │   ├── EquityChart.tsx
│       │   ├── MetricsOverview.tsx
│       │   ├── TradesTable.tsx
│       │   └── ConsoleViewer.tsx
│       ├── hooks/
│       │   ├── useTheme.ts
│       │   └── useBacktest.ts
│       └── lib/
│           ├── api.ts
│           ├── types.ts
│           ├── stockCatalog.ts
│           └── strategies.ts
├── docker-compose.yml
├── DEPLOYMENT.md
└── Strategy_backtest.ipynb     # Original prototype notebook
```

---

## 🚀 Quick Start (Local)

### Prerequisites
- Python 3.11+
- Node.js 20+

### 1. Backend

```bash
cd backend
python -m venv venv

# Windows
.\\venv\\Scripts\\activate
# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```

API runs at `http://127.0.0.1:8001`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Workbench UI at `http://localhost:3000`

---

## 🐳 Docker Compose

```bash
docker-compose up --build
```

Both services start automatically. See [`DEPLOYMENT.md`](DEPLOYMENT.md) for production configuration.

---

## 🔌 API Reference

### `GET /api/v1/indices`
Returns the catalog of supported global market indices, stocks, and crypto assets.

### `POST /api/v1/backtest`

```json
{
  "ticker": "^GSPC",
  "start_date": "2022-01-01",
  "end_date": "2024-01-01",
  "interval": "1d",
  "initial_capital": 10000,
  "commission_pct": 0.1,
  "slippage_pct": 0.05,
  "strategy_type": "sma_crossover",
  "python_code": "",
  "short_window": 20,
  "long_window": 50,
  "rsi_period": 14,
  "rsi_overbought": 70,
  "rsi_oversold": 30
}
```

**Response** — `metrics`, `equity_curve`, `candlesticks`, `trades`, `logs`.

### Health Probes
- `GET /` — Liveness
- `GET /health` — Health check
- `GET /ready` — Readiness check

---

## 📊 Roadmap

| Phase | Description | Status |
|---|---|---|
| Phase 1 | Backend Engine & Quantitative Metrics | ✅ Complete |
| Phase 2 | Next.js Workbench, Monaco IDE & Financial Charts | ✅ Complete |
| Phase 3 | Global Assets, Multi-Timeframes & Fee Modeling | ✅ Complete |
| Phase 4 | Parameter Optimization, CSV Export & Strategy Library | ⏳ Planned |

---

## ⚠️ Disclaimer

This project is for **educational and research purposes only**. It does not constitute financial advice. Past backtested performance is not indicative of future results.
