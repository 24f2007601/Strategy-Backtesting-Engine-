"use client";

import React, { useEffect, useRef } from "react";
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  createSeriesMarkers,
  ColorType,
  IChartApi,
  SeriesMarker,
  Time,
} from "lightweight-charts";
import { CandlestickPoint, TradeRecord } from "@/lib/types";
import { BarChart2 } from "lucide-react";

interface CandlestickChartProps {
  theme?: "dark" | "light";
  candlesticks: CandlestickPoint[];
  trades: TradeRecord[];
  ticker: string;
  tickerName: string;
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  theme = "dark",
  candlesticks,
  trades,
  ticker,
  tickerName,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || candlesticks.length === 0) return;

    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const isLight = theme === "light";
    const container = chartContainerRef.current;
    const chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: isLight ? "#0f172a" : "#a1a1aa",
      },
      grid: {
        vertLines: { color: isLight ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.03)" },
        horzLines: { color: isLight ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.03)" },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: isLight ? "rgba(15, 23, 42, 0.35)" : "rgba(255, 255, 255, 0.2)",
          width: 1,
          style: 3,
        },
        horzLine: {
          color: isLight ? "rgba(15, 23, 42, 0.35)" : "rgba(255, 255, 255, 0.2)",
          width: 1,
          style: 3,
        },
      },
      rightPriceScale: {
        borderColor: isLight ? "rgba(0, 0, 0, 0.15)" : "rgba(255, 255, 255, 0.08)",
      },
      timeScale: {
        borderColor: isLight ? "rgba(0, 0, 0, 0.15)" : "rgba(255, 255, 255, 0.08)",
        timeVisible: true,
        secondsVisible: false,
      },
      width: container.clientWidth,
      height: container.clientHeight || 440,
    });

    chartRef.current = chart;

    // 1. Add Candlestick Series
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#10b981",
      downColor: "#f43f5e",
      borderVisible: false,
      wickUpColor: "#10b981",
      wickDownColor: "#f43f5e",
    });

    const formattedCandles = candlesticks.map((item) => ({
      time: item.time as Time,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));

    candleSeries.setData(formattedCandles);

    // 2. Add Trade Execution Markers
    if (trades.length > 0) {
      const markers: SeriesMarker<Time>[] = trades.map((t) => ({
        time: t.date as Time,
        position: t.type === "BUY" ? "belowBar" : "aboveBar",
        color: t.type === "BUY" ? "#10b981" : "#f43f5e",
        shape: t.type === "BUY" ? "arrowUp" : "arrowDown",
        text: `${t.type} @ $${t.price}`,
      }));

      markers.sort((a, b) => (a.time > b.time ? 1 : -1));
      createSeriesMarkers(candleSeries, markers);
    }

    // 3. Add Volume Series
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: isLight ? "rgba(0, 0, 0, 0.06)" : "rgba(255, 255, 255, 0.08)",
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "",
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    const formattedVolume = candlesticks.map((item) => ({
      time: item.time as Time,
      value: item.volume,
      color: item.close >= item.open ? "rgba(16, 185, 129, 0.22)" : "rgba(244, 63, 94, 0.22)",
    }));

    volumeSeries.setData(formattedVolume);

    chart.timeScale().fitContent();

    const handleResize = () => {
      if (container && chart) {
        chart.applyOptions({ width: container.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [candlesticks, trades, theme]);

  return (
    <div className="flex flex-col h-full glass-card rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-3.5 bg-slate-100/90 dark:bg-zinc-950/70 border-b border-slate-200 dark:border-white/5 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <BarChart2 className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm text-slate-900 dark:text-zinc-100">{tickerName}</span>
            <span className="ml-2 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/20 px-2 py-0.5 rounded-lg shadow-sm">
              {ticker}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs font-bold text-slate-700 dark:text-zinc-400">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_8px_#10b981]" /> BUY Marker
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-red-500/10 border border-rose-300 dark:border-red-500/20 text-rose-700 dark:text-red-400 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-rose-500 dark:bg-red-400 shadow-[0_0_8px_#f43f5e]" /> SELL Marker
          </span>
        </div>
      </div>

      <div ref={chartContainerRef} className="w-full flex-1 min-h-[420px]" />
    </div>
  );
};
