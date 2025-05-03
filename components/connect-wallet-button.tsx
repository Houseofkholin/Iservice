"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2, Wallet } from "lucide-react"
import { useWallet } from "@/providers/wallet-provider"

export function ConnectWalletButton() {
  const { isConnected, connect, disconnect, address, isLoading } = useWallet()
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnect = async () => {
    if (isConnected) {
      disconnect()
    } else {
      setIsConnecting(true)
      try {
        await connect()
      } finally {
        setIsConnecting(false)
      }
    }
  }

  return (
    <Button
      variant={isConnected ? "outline" : "default"}
      size="sm"
      onClick={handleConnect}
      disabled={isLoading || isConnecting}
    >
      {isLoading || isConnecting ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {isConnected ? "Disconnecting..." : "Connecting..."}
        </>
      ) : (
        <>
          <Wallet className="mr-2 h-4 w-4" />
          {isConnected ? `${address?.substring(0, 6)}...${address?.substring(address.length - 4)}` : "Connect Wallet"}
        </>
      )}
    </Button>
  )
}

