"use client"

import type React from "react"

import { ThemeProvider } from "next-themes"
import { SessionProvider } from "next-auth/react"
import { WalletProvider } from "@/providers/wallet-provider"
import { NotificationProvider } from "@/providers/notification-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <WalletProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </WalletProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}

