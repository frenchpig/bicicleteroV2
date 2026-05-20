'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  resolvedTheme: 'light' | 'dark' | undefined;
  systemTheme: 'light' | 'dark' | undefined;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'system',
  setTheme: () => {},
  resolvedTheme: undefined,
  systemTheme: undefined,
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  attribute?: 'class' | `data-${string}`;
  storageKey?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  attribute = 'class',
  storageKey = 'theme',
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark' | undefined>(undefined);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark' | undefined>(undefined);

  useEffect(() => {
    const stored = localStorage.getItem(storageKey) as Theme | null;
    if (stored) setThemeState(stored);
  }, [storageKey]);

  useEffect(() => {
    const sys: 'light' | 'dark' = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    setSystemTheme(sys);

    const resolved: 'light' | 'dark' = theme === 'system' ? sys : theme;
    setResolvedTheme(resolved);

    const root = document.documentElement;

    if (disableTransitionOnChange) {
      const style = document.createElement('style');
      style.textContent =
        '*,*::before,*::after{-webkit-transition:none!important;transition:none!important}';
      document.head.appendChild(style);
      window.setTimeout(() => document.head.removeChild(style), 1);
    }

    if (attribute === 'class') {
      root.classList.remove('light', 'dark');
      root.classList.add(resolved);
    } else {
      root.setAttribute(attribute, resolved);
    }

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e: MediaQueryListEvent) => {
        const next: 'light' | 'dark' = e.matches ? 'dark' : 'light';
        setSystemTheme(next);
        setResolvedTheme(next);
        if (attribute === 'class') {
          root.classList.remove('light', 'dark');
          root.classList.add(next);
        } else {
          root.setAttribute(attribute, next);
        }
      };
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [theme, attribute, disableTransitionOnChange]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem(storageKey, t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme, systemTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
