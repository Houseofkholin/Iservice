"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

// Networks
const NETWORKS = {
  ethereum: {
    name: "Ethereum",
    chainId: "0x1",
    rpcUrl: process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || "https://mainnet.infura.io/v3/your-api-key",
    currency: "ETH",
    blockExplorer: "https://etherscan.io",
  },
  polygon: {
    name: "Polygon",
    chainId: "0x89",
    rpcUrl: process.env.NEXT_PUBLIC_POLYGON_RPC_URL || "https://polygon-rpc.com",
    currency: "MATIC",
    blockExplorer: "https://polygonscan.com",
  },
}

export function useWallet() {
  const [account, setAccount] = useState(null)
  const [chainId, setChainId] = useState(null)
  const [balance, setBalance] = useState("0")
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState(null)
  const { toast } = useToast()

  const isConnected = !!account

  // Get current network based on chainId
  const network = chainId
    ? Object.values(NETWORKS).find((n) => n.chainId === chainId) || { name: "Unknown Network", chainId }
    : null

  // Connect wallet
  const connect = async () => {
    if (!window.ethereum) {
      setError("No Ethereum wallet found. Please install MetaMask.")
      toast({
        title: "Wallet Error",
        description: "No Ethereum wallet found. Please install MetaMask.",
        variant: "destructive",
      })
      return false
    }

    setIsConnecting(true)
    setError(null)

    try {
      // Request accounts
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })

      if (accounts.length === 0) {
        throw new Error("No accounts found")
      }

      // Get chain ID
      const chainId = await window.ethereum.request({ method: "eth_chainId" })

      // Get balance
      const balanceHex = await window.ethereum.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })

      // Convert balance from wei to ETH
      const balanceInWei = Number.parseInt(balanceHex, 16)
      const balanceInEth = balanceInWei / 1e18

      setAccount(accounts[0])
      setChainId(chainId)
      setBalance(balanceInEth.toFixed(4))

      toast({
        title: "Wallet Connected",
        description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
      })

      return true
    } catch (error) {
      console.error("Error connecting wallet:", error)
      setError(error.message || "Failed to connect wallet")

      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      })

      return false
    } finally {
      setIsConnecting(false)
    }
  }

  // Disconnect wallet
  const disconnect = () => {
    setAccount(null)
    setChainId(null)
    setBalance("0")

    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  // Switch network
  const switchNetwork = async (networkName) => {
    if (!window.ethereum) {
      setError("No Ethereum wallet found")
      return false
    }

    const targetNetwork = NETWORKS[networkName]

    if (!targetNetwork) {
      setError(`Network ${networkName} not supported`)
      return false
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: targetNetwork.chainId }],
      })

      // Update chain ID after switch
      setChainId(targetNetwork.chainId)

      toast({
        title: "Network Switched",
        description: `Switched to ${targetNetwork.name}`,
      })

      return true
    } catch (error) {
      // If the network is not added, try to add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: targetNetwork.chainId,
                chainName: targetNetwork.name,
                nativeCurrency: {
                  name: targetNetwork.currency,
                  symbol: targetNetwork.currency,
                  decimals: 18,
                },
                rpcUrls: [targetNetwork.rpcUrl],
                blockExplorerUrls: [targetNetwork.blockExplorer],
              },
            ],
          })

          setChainId(targetNetwork.chainId)

          toast({
            title: "Network Added",
            description: `Added and switched to ${targetNetwork.name}`,
          })

          return true
        } catch (addError) {
          console.error("Error adding network:", addError)
          setError(addError.message || `Failed to add ${targetNetwork.name} network`)

          toast({
            title: "Network Error",
            description: `Failed to add ${targetNetwork.name} network`,
            variant: "destructive",
          })

          return false
        }
      }

      console.error("Error switching network:", error)
      setError(error.message || `Failed to switch to ${targetNetwork.name}`)

      toast({
        title: "Network Error",
        description: `Failed to switch to ${targetNetwork.name}`,
        variant: "destructive",
      })

      return false
    }
  }

  // Setup event listeners
  useEffect(() => {
    if (window.ethereum) {
      // Handle account changes
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          disconnect()
        } else if (accounts[0] !== account) {
          setAccount(accounts[0])
          toast({
            title: "Account Changed",
            description: `Switched to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
          })
        }
      }

      // Handle chain changes
      const handleChainChanged = (chainId) => {
        setChainId(chainId)

        // Get the network name
        const network = Object.values(NETWORKS).find((n) => n.chainId === chainId)
        const networkName = network ? network.name : "Unknown Network"

        toast({
          title: "Network Changed",
          description: `Switched to ${networkName}`,
        })

        // Refresh the page to ensure all data is updated correctly
        window.location.reload()
      }

      // Subscribe to events
      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      // Cleanup
      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [account, toast])

  return {
    account,
    chainId,
    balance,
    network,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    switchNetwork,
  }
}

