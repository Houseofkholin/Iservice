"use client"

import { createContext, useContext, useState } from "react"
import { useToast } from "@/hooks/use-toast"

// Create context
const WalletContext = createContext({
  wallet: null,
  isConnecting: false,
  isConnected: false,
  connectWallet: () => {},
  disconnectWallet: () => {},
  balance: "0",
  network: null,
})

// Mock wallet data
const MOCK_WALLET = {
  address: "0x1234...5678",
  balance: "1.25",
  network: {
    name: "Ethereum",
    chainId: "1",
  },
}

export function WalletProvider({ children }) {
  const [wallet, setWallet] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [balance, setBalance] = useState("0")
  const [network, setNetwork] = useState(null)
  const { toast } = useToast()

  // Check if wallet is connected
  const isConnected = !!wallet

  // Connect wallet
  const connectWallet = async (provider = "metamask") => {
    setIsConnecting(true)

    try {
      // In a real app, you would connect to the actual wallet
      // For now, we'll just simulate a connection
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setWallet(MOCK_WALLET)
      setBalance(MOCK_WALLET.balance)
      setNetwork(MOCK_WALLET.network)

      toast({
        title: "Wallet connected",
        description: `Connected to ${MOCK_WALLET.address}`,
      })
    } catch (error) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    setWallet(null)
    setBalance("0")
    setNetwork(null)

    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  // Context value
  const value = {
    wallet,
    isConnecting,
    isConnected,
    connectWallet,
    disconnectWallet,
    balance,
    network,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

// Custom hook to use the wallet context
export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}

