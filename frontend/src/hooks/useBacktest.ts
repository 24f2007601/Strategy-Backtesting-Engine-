"use client";

import { useState, useEffect, useCallback } from "react";
import { BacktestRequest, BacktestResponse } from "@/lib/types";
import { runBacktestApi } from "@/lib/api";
import { DEFAULT_STRATEGY } from "@/lib/strategies";

export function useBacktest() {
  const [selectedTicker, setSelectedTicker] = useState("^GSPC");
  const [startDate, setStartDate] = useState("2022-01-01");
  const [endDate, setEndDate] = useState("2024-01-01");
  const [interval, setInterval] = useState("1d");
  const [initialCapital, setInitialCapital] = useState(10000);
  const [commissionPct, setCommissionPct] = useState(0.1);
  const [slippagePct, setSlippagePct] = useState(0.05);

  const [strategyType, setStrategyType] = useState<"custom_code" | "sma_crossover" | "rsi" | "momentum">("sma_crossover");
  const [pythonCode, setPythonCode] = useState(DEFAULT_STRATEGY.code);
  const [shortWindow, setShortWindow] = useState(20);
  const [longWindow, setLongWindow] = useState(50);
  const [rsiPeriod, setRsiPeriod] = useState(14);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [backtestResult, setBacktestResult] = useState<BacktestResponse | null>(null);

  const executeBacktest = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);

    const payload: BacktestRequest = {
      ticker: selectedTicker,
      start_date: startDate,
      end_date: endDate,
      interval,
      initial_capital: initialCapital,
      commission_pct: commissionPct,
      slippage_pct: slippagePct,
      strategy_type: strategyType,
      python_code: pythonCode,
      short_window: shortWindow,
      long_window: longWindow,
      rsi_period: rsiPeriod,
      rsi_overbought: 70,
      rsi_oversold: 30,
    };

    try {
      const res = await runBacktestApi(payload);
      setBacktestResult(res);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to execute backtest.");
    } finally {
      setIsLoading(false);
    }
  }, [
    selectedTicker,
    startDate,
    endDate,
    interval,
    initialCapital,
    commissionPct,
    slippagePct,
    strategyType,
    pythonCode,
    shortWindow,
    longWindow,
    rsiPeriod,
  ]);

  // Initial backtest on mount
  useEffect(() => {
    executeBacktest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    selectedTicker,
    setSelectedTicker,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    interval,
    setInterval,
    initialCapital,
    setInitialCapital,
    commissionPct,
    setCommissionPct,
    slippagePct,
    setSlippagePct,
    strategyType,
    setStrategyType,
    pythonCode,
    setPythonCode,
    shortWindow,
    setShortWindow,
    longWindow,
    setLongWindow,
    rsiPeriod,
    setRsiPeriod,
    isLoading,
    errorMsg,
    backtestResult,
    executeBacktest,
  };
}
