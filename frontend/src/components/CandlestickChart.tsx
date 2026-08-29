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

interface CandlestickChartProps {
  candlesticks: CandlestickPoint[];
  trades: TradeRecord[];
  ticker: string;
  tickerName: string;
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({
  candlesticks,
  trades,
  ticker,
  tickerName,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || candlesticks.length === 0) return;

    // Clean up existing chart instance
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const container = chartContainerRef.current;
    const chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: "#09090b" }, // zinc-950
        textColor: "#a1a1aa", // zinc-400
      },
      grid: {
        vertLines: { color: "#18181b" }, // zinc-900
        horzLines: { color: "#18181b" },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: "#27272a", // zinc-800
      },
      timeScale: {
        borderColor: "#27272a",
        timeVisible: true,
        secondsVisible: false,
      },
      width: container.clientWidth,
      height: container.clientHeight || 440,
    });

    chartRef.current = chart;

    // 1. Add Candlestick Series using v5 API (addSeries + CandlestickSeries)
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#10b981", // emerald-500
      downColor: "#ef4444", // red-500
      borderVisible: false,
      wickUpColor: "#10b981",
      wickDownColor: "#ef4444",
    });

    const formattedCandles = candlesticks.map((item) => ({
      time: item.time as Time,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));

    candleSeries.setData(formattedCandles);

    // 2. Add Trade Execution Markers using v5 createSeriesMarkers plugin API
    if (trades.length > 0) {
      const markers: SeriesMarker<Time>[] = trades.map((t) => ({
        time: t.date as Time,
        position: t.type === "BUY" ? "belowBar" : "aboveBar",
        color: t.type === "BUY" ? "#10b981" : "#ef4444",
        shape: t.type === "BUY" ? "arrowUp" : "arrowDown",
        text: `${t.type} @ $${t.price}`,
      }));

      markers.sort((a, b) => (a.time > b.time ? 1 : -1));
      createSeriesMarkers(candleSeries, markers);
    }

    // 3. Add Volume Series using v5 API (addSeries + HistogramSeries)
    const volumeSeries = chart.addSeries(HistogramSeries, {
      color: "#27272a",
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "", // Overlay on main chart
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: {
        top: 0.8, // Volume takes lower 20%
        bottom: 0,
      },
    });

    const formattedVolume = candlesticks.map((item) => ({
      time: item.time as Time,
      value: item.volume,
      color: item.close >= item.open ? "#10b98122" : "#ef444422",
    }));

    volumeSeries.setData(formattedVolume);

    // Fit content on time scale
    chart.timeScale().fitContent();

    // Responsive resize handler
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
  }, [candlesticks, trades]);

  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
      <div className="p-3 bg-zinc-900/60 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-sm text-zinc-100">{tickerName}</span>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
            {ticker}
          </span>
        </div>
        <div className="flex items-center space-x-4 text-xs font-medium text-zinc-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> BUY Execution
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> SELL Execution
          </span>
        </div>
      </div>

      <div ref={chartContainerRef} className="w-full flex-1 min-h-[420px]" />
    </div>
  );
};
