"use client";

import React, { useState, useEffect, useRef } from "react";
import { TickerInfo } from "@/lib/types";
import { searchStockSuggestions } from "@/lib/stockCatalog";
import { Search, Globe, TrendingUp, Sparkles, Building2, Coins, LineChart } from "lucide-react";

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
  const [suggestions, setSuggestions] = useState<TickerInfo[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle typing input and trigger auto-complete search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomTicker(val);

    if (val.trim().length > 0) {
      const matches = searchStockSuggestions(val);
      setSuggestions(matches);
      setIsOpen(matches.length > 0);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  // Form submit handler for custom or direct symbol typing
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTicker.trim()) {
      onSelectTicker(customTicker.trim().toUpperCase());
      setIsOpen(false);
    }
  };

  // Handle selecting a stock suggestion from popover
  const handleSelectSuggestion = (item: TickerInfo) => {
    onSelectTicker(item.symbol);
    setCustomTicker(`${item.name} (${item.symbol})`);
    setIsOpen(false);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-3.5" ref={containerRef}>
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-400 flex items-center gap-2">
          <span className="p-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <Globe className="w-3.5 h-3.5" />
          </span>
          Global Asset / Market Index
        </label>
        <span className="text-[10px] font-mono text-slate-600 dark:text-zinc-400 font-medium">
          Selected Ticker: <span className="text-emerald-700 dark:text-emerald-400 font-bold">{selectedTicker}</span>
        </span>
      </div>

      {/* Preset Glass Index Chips */}
      <div className="flex flex-wrap gap-2">
        {indices.map((item) => {
          const isSelected = selectedTicker.toUpperCase() === item.symbol.toUpperCase();
          return (
            <button
              key={item.symbol}
              type="button"
              onClick={() => {
                onSelectTicker(item.symbol);
                setIsOpen(false);
              }}
              className={`group px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 flex items-center gap-1.5 border shadow-sm ${
                isSelected
                  ? "bg-emerald-600 dark:bg-emerald-500/15 text-white dark:text-emerald-300 border-emerald-600 dark:border-emerald-500/40 shadow-[0_0_16px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500/30 font-bold"
                  : "bg-white dark:glass-pill text-slate-800 dark:text-zinc-400 border-slate-300 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-950 dark:hover:text-zinc-200"
              }`}
            >
              <TrendingUp className={`w-3 h-3 transition-transform group-hover:scale-110 ${isSelected ? "text-white dark:text-emerald-400" : "text-slate-500 opacity-60"}`} />
              <span className="font-bold">{item.name}</span>
              <span className={`text-[10px] font-mono ${isSelected ? "text-emerald-100 dark:text-emerald-400/80 font-bold" : "text-slate-500 dark:text-zinc-500"}`}>
                {item.symbol}
              </span>
            </button>
          );
        })}
      </div>

      {/* Custom Stock Search Bar with Live Autocomplete Popover */}
      <div className="relative">
        <form onSubmit={handleCustomSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search by Stock Name (e.g. Apple, Reliance, Tesla, Nifty) or Symbol (AAPL, RELIANCE.NS)..."
              value={customTicker}
              onChange={handleInputChange}
              onFocus={() => {
                if (customTicker.trim().length > 0 && suggestions.length > 0) {
                  setIsOpen(true);
                }
              }}
              className="w-full bg-white dark:glass-input border border-slate-300 dark:border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs font-medium placeholder:font-normal placeholder-slate-400 dark:placeholder-zinc-500 text-slate-900 dark:text-zinc-100 focus:outline-none shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl text-xs font-bold cursor-pointer bg-white dark:glass-card border border-slate-300 dark:border-white/10 text-slate-900 dark:text-zinc-200 hover:bg-slate-100 hover:text-slate-950 dark:hover:text-white hover:border-emerald-500/40 flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Select Stock
          </button>
        </form>

        {/* Live Stock Name & Symbol Autocomplete Dropdown Popover */}
        {isOpen && suggestions.length > 0 && (
          <div className="absolute top-full mt-1.5 left-0 right-0 z-50 bg-white dark:glass-panel rounded-2xl p-1.5 shadow-2xl border border-slate-300 dark:border-white/10 max-h-[320px] overflow-y-auto divide-y divide-slate-100 dark:divide-white/5 transition-all">
            <div className="px-3 py-1.5 text-[10px] font-mono text-slate-600 dark:text-zinc-400 uppercase tracking-wider flex items-center justify-between font-bold">
              <span>Matching Stock Suggestions</span>
              <span>{suggestions.length} Results</span>
            </div>
            {suggestions.map((item) => (
              <button
                key={item.symbol}
                type="button"
                onClick={() => handleSelectSuggestion(item)}
                className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:border-emerald-300 dark:hover:border-emerald-500/30 border border-transparent transition-all duration-150 flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:border-emerald-300 dark:group-hover:border-emerald-500/30 transition">
                    {item.category === "Crypto" ? (
                      <Coins className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                    ) : item.category === "Index" ? (
                      <LineChart className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    ) : (
                      <Building2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-zinc-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition block">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-600 dark:text-zinc-400 font-mono font-medium">
                      {item.region} • {item.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-400 font-mono font-bold text-xs group-hover:shadow-sm">
                    {item.symbol}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
