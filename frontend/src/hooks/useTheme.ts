"use client";

import { useState, useEffect, useCallback } from "react";

export type ThemeMode = "dark" | "light";

const THEME_STORAGE_KEY = "quantstudio_theme";

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  const applyThemeToDOM = useCallback((targetTheme: ThemeMode) => {
    const root = document.documentElement;
    const body = document.body;

    if (targetTheme === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
      root.setAttribute("data-theme", "light");
      body.classList.add("light");
      body.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
      root.setAttribute("data-theme", "dark");
      body.classList.add("dark");
      body.classList.remove("light");
    }
  }, []);

  useEffect(() => {
    const savedTheme = (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode) || "dark";
    setTheme(savedTheme);
    applyThemeToDOM(savedTheme);
  }, [applyThemeToDOM]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const nextTheme = prevTheme === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      applyThemeToDOM(nextTheme);
      return nextTheme;
    });
  }, [applyThemeToDOM]);

  return { theme, toggleTheme, isLight: theme === "light" };
}
