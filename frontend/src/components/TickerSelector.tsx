"use client";

import React, { useState } from "react";
import { TickerInfo } from "@/lib/types";
import { Search, Globe, TrendingUp } from "lucide-react";

interface TickerSelectorProps {
  indices: TickerInfo[];
  selectedTicker: string;
  onSelectTicker: (ticker: string) => void;
}

export const TickerSelector: React.FC<TickerSelectorProps> = ({
  indices,
  selectedTicker,
  onSelectTicker,
}) => {
  const [customTicker, setCustomTicker] = useState("");

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTicker.trim()) {
      onSelectTicker(customTicker.trim().toUpperCase());
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
        <Globe className="w-3.5 h-3.5 text-emerald-400" />
        Select Global Asset / Index
      </label>

      {/* Preset Index Chips */}
      <div className="flex flex-wrap gap-2">
        {indices.map((item) => {
          const isSelected = selectedTicker.toUpperCase() === item.symbol.toUpperCase();
          return (
            <button
              key={item.symbol}
              type="button"
              onClick={() => onSelectTicker(item.symbol)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
                isSelected
                  ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-900/20"
                  : "bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              <TrendingUp className="w-3 h-3 opacity-60" />
              <span className="font-semibold">{item.name}</span>
              <span className="text-[10px] font-mono text-zinc-500">({item.symbol})</span>
            </button>
          );
        })}
      </div>

      {/* Custom Symbol Search Form */}
      <form onSubmit={handleCustomSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Type any global symbol (e.g. AAPL, NVDA, ^NSEI, BTC-USD)..."
            value={customTicker}
            onChange={(e) => setCustomTicker(e.target.value)}
            className="w-full bg-zinc-900/90 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-lg border border-zinc-700 transition"
        >
          Search
        </button>
      </form>
    </div>
  );
};
