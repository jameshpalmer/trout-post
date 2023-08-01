"use client"

import * as React from "react"
import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

import { FishProvider } from "./fish-toggle"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        <FishProvider>{children}</FishProvider>
      </NextThemesProvider>
      <Analytics />
    </>
  )
}
