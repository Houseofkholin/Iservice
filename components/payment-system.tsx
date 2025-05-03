"use client"

import { useState } from "react"
import { Wallet, Check, ChevronDown, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWallet } from "@/providers/wallet-provider"
import { useSession } from "next-auth/react"
import { supportedCryptos, sendNativeCrypto, sendToken } from "@/lib/crypto-payment"
import QRCode from "react-qr-code"

interface PaymentSystemProps {
  amount: number
  serviceName: string
  recipientAddress?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function PaymentSystem({
  amount,
  serviceName,
  recipientAddress = "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
  onSuccess,
  onCancel,
}: PaymentSystemProps) {
  const [paymentMethod, setPaymentMethod] = useState<"crypto" | "card">("crypto")
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedCrypto, setSelectedCrypto] = useState(supportedCryptos[0].id)
  const [isWalletDetailsOpen, setIsWalletDetailsOpen] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  })

  const { toast } = useToast()
  const { data: session } = useSession()
  const { address, connect, isConnected } = useWallet()

  // Get the selected crypto details
  const selectedCryptoDetails = supportedCryptos.find((crypto) => crypto.id === selectedCrypto)

  // Handle crypto payment
  const handleCryptoPayment = async () => {
    if (!isConnected) {
      try {
        await connect()
      } catch (error: any) {
        toast({
          title: "Wallet connection failed",
          description: error.message || "Failed to connect wallet",
          variant: "destructive",
        })
        return
      }
    }

    setIsProcessing(true)

    try {
      let result

      if (selectedCryptoDetails?.contractAddress) {
        // ERC20 token payment
        const network = "ethereum" // You can make this dynamic based on user selection
        const tokenAddress =
          selectedCryptoDetails.contractAddress[network as keyof typeof selectedCryptoDetails.contractAddress]

        result = await sendToken(
          tokenAddress as string,
          recipientAddress,
          amount.toString(),
          selectedCryptoDetails.decimals,
          network,
        )
      } else {
        // Native crypto payment (ETH, MATIC)
        result = await sendNativeCrypto(recipientAddress, amount.toString())
      }

      if (result.success) {
        toast({
          title: "Payment successful",
          description: `Your crypto payment for ${serviceName} has been sent. Transaction hash: ${result.hash}`,
        })

        if (onSuccess) {
          onSuccess()
        }
      } else {
        toast({
          title: "Payment failed",
          description: result.error || "There was an error processing your crypto payment.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Payment failed",
        description: error.message || "There was an error processing your crypto payment.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle card payment (simplified for demo)
  const handleCardPayment = async () => {
    setIsProcessing(true)

    try {
      // In a real app, this would be an API call to process card payment
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Payment successful",
        description: `Your payment of $${amount.toFixed(2)} for ${serviceName} has been processed.`,
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle payment based on selected method
  const handlePayment = () => {
    switch (paymentMethod) {
      case "crypto":
        handleCryptoPayment()
        break
      case "card":
        handleCardPayment()
        break
    }
  }

  const handleCardInputChange = (field: keyof typeof cardDetails, value: string) => {
    setCardDetails({
      ...cardDetails,
      [field]: value,
    })
  }

  // Generate QR code data for crypto payment
  const getQRCodeData = () => {
    if (!selectedCryptoDetails) return ""

    if (selectedCryptoDetails.contractAddress) {
      // ERC20 token
      const network = "ethereum" // You can make this dynamic
      const tokenAddress =
        selectedCryptoDetails.contractAddress[network as keyof typeof selectedCryptoDetails.contractAddress]
      return `ethereum:${tokenAddress}/transfer?address=${recipientAddress}&uint256=${amount * 10 ** selectedCryptoDetails.decimals}`
    } else {
      // Native crypto
      return `ethereum:${recipientAddress}?value=${amount * 10 ** 18}`
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>Complete your payment for {serviceName}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Order Summary */}
        <div className="rounded-lg bg-muted p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Service</span>
            <span className="text-sm">{serviceName}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex items-center justify-between font-medium">
            <span>Total</span>
            <span>${amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-3">
          <Label>Payment Method</Label>
          <Tabs defaultValue="crypto" onValueChange={(value) => setPaymentMethod(value as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="crypto">Crypto</TabsTrigger>
              <TabsTrigger value="card">Card</TabsTrigger>
            </TabsList>

            {/* Crypto Payment */}
            <TabsContent value="crypto" className="space-y-4">
              <div className="space-y-2">
                <Label>Select Cryptocurrency</Label>
                <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent>
                    {supportedCryptos.map((crypto) => (
                      <SelectItem key={crypto.id} value={crypto.id}>
                        <div className="flex items-center">
                          <img src={crypto.icon || "/placeholder.svg"} alt={crypto.name} className="w-5 h-5 mr-2" />
                          {crypto.name} ({crypto.symbol})
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Wallet className="h-5 w-5 text-primary mr-2" />
                    <span className="font-medium">Pay with {selectedCryptoDetails?.name}</span>
                  </div>
                  <Collapsible open={isWalletDetailsOpen} onOpenChange={setIsWalletDetailsOpen}>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <span className="sr-only">Toggle</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${isWalletDetailsOpen ? "rotate-180" : ""}`}
                        />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2">
                      <div className="rounded-md bg-muted p-2 text-xs font-mono break-all">{recipientAddress}</div>

                      <div className="mt-2 flex justify-center">
                        <div className="bg-white p-2 rounded">
                          <QRCode value={getQRCodeData()} size={150} />
                        </div>
                      </div>

                      <p className="text-xs text-center mt-2 text-muted-foreground">Scan with your wallet app to pay</p>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Secure, blockchain-based payment with escrow protection
                </div>
              </div>

              {!isConnected && (
                <Button variant="outline" className="w-full" onClick={connect}>
                  Connect Wallet
                </Button>
              )}

              {isConnected && (
                <div className="text-sm text-center text-muted-foreground">
                  Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                </div>
              )}
            </TabsContent>

            {/* Card Payment */}
            <TabsContent value="card" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input
                  id="card-number"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.number}
                  onChange={(e) => handleCardInputChange("number", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="card-name">Name on Card</Label>
                <Input
                  id="card-name"
                  placeholder="John Doe"
                  value={cardDetails.name}
                  onChange={(e) => handleCardInputChange("name", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => handleCardInputChange("expiry", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    value={cardDetails.cvc}
                    onChange={(e) => handleCardInputChange("cvc", e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handlePayment} disabled={isProcessing}>
          {isProcessing ? (
            <div className="flex items-center">
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </div>
          ) : (
            <div className="flex items-center">
              Pay ${amount.toFixed(2)}
              <Check className="ml-2 h-4 w-4" />
            </div>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

