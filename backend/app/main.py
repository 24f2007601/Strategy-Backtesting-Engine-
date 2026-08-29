from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import os

from app.schemas.backtest import BacktestRequest, BacktestResponse, TickerInfo
from app.engine.data_fetcher import POPULAR_INDICES
from app.engine.backtester import run_backtest

app = FastAPI(
    title="QuantStudio Strategy Engine API",
    description="Production Quantitative Strategy Backtesting REST API",
    version="1.0.0"
)

# CORS configuration - read allowed origins from environment
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "QuantStudio Engine API",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    """Liveness probe for container orchestrators (Kubernetes/Cloud Run)."""
    return {"status": "healthy"}

@app.get("/ready")
def readiness_check():
    """Readiness probe for load balancers."""
    return {"status": "ready"}

@app.get("/api/v1/indices", response_model=List[TickerInfo])
def get_indices():
    """Returns curated list of popular global market indices and stocks."""
    return [TickerInfo(**item) for item in POPULAR_INDICES]

@app.post("/api/v1/backtest", response_model=BacktestResponse)
def execute_backtest(request: BacktestRequest):
    """Executes a backtest for given ticker and strategy parameters."""
    try:
        response = run_backtest(request)
        return response
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Backtest processing error: {str(e)}")
