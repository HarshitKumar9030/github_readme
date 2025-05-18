'use client';

import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import type { Attribute } from 'next-themes';

export function ThemeProvider({ 
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true
}: { 
  children: ReactNode;
  attribute?: Attribute;
  defaultTheme?: string;
  enableSystem?: boolean;
}) {
  return (
    <NextThemeProvider
      attribute={attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
    >
      {children}
    </NextThemeProvider>
  );
}
