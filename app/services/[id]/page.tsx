"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Globe, MessageSquare, Shield, Star, Wallet } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useWallet } from "@/providers/wallet-provider"
import { useToast } from "@/components/ui/use-toast"
import { getServiceRequestById, placeBid, type ServiceRequestDetail } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

// Form schema for bid
const bidSchema = z.object({
  amount: z.number().min(1, "Bid amount must be at least 1"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must be less than 500 characters"),
})

type BidFormValues = z.infer<typeof bidSchema>

export default function ServiceDetailPage({ params }: { params: { id: string } }) {
  const { isConnected, connect } = useWallet()
  const { toast } = useToast()
  const [selectedImage, setSelectedImage] = useState(0)
  const [serviceRequest, setServiceRequest] = useState<ServiceRequestDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<BidFormValues>({
    resolver: zodResolver(bidSchema),
    defaultValues: {
      message: "",
    },
  })

  useEffect(() => {
    async function loadServiceRequest() {
      try {
        setLoading(true)
        const { service } = await getServiceRequestById(params.id)
        setServiceRequest(service)

        // Set default bid amount to service budget
        setValue("amount", service.budget)
      } catch (error) {
        console.error("Error loading service request:", error)
        toast({
          title: "Error",
          description: "Failed to load service request details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadServiceRequest()
  }, [params.id, setValue, toast])

  const onSubmitBid = async (data: BidFormValues) => {
    if (!isConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to place a bid",
        variant: "destructive",
      })
      return
    }

    if (!serviceRequest) return

    setSubmitting(true)

    try {
      const result = await placeBid(serviceRequest.id, data.amount, data.message)

      toast({
        title: "Bid Placed",
        description: "Your bid has been successfully placed",
      })

      // Refresh the page to show the new bid
      window.location.reload()
    } catch (error) {
      console.error("Error placing bid:", error)
      toast({
        title: "Error",
        description: "Failed to place bid. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container px-4 py-6 md:px-6 md:py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/marketplace">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Marketplace
            </Link>
          </Button>
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <div className="flex items-center mt-2 space-x-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
            </div>
            <Skeleton className="h-8 w-24" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <div className="flex space-x-2 overflow-auto pb-2">
              {[1, 2, 3, 4].map((_, index) => (
                <Skeleton key={index} className="h-16 w-16 rounded-md flex-shrink-0" />
              ))}
            </div>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-64 w-full rounded-md" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-96 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (!serviceRequest) {
    return (
      <div className="container px-4 py-6 md:px-6 md:py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Service Request Not Found</h1>
        <p className="mb-6">The service request you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link href="/marketplace">Back to Marketplace</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container px-4 py-6 md:px-6 md:py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/marketplace">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Link>
        </Button>
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{serviceRequest.title}</h1>
            <div className="flex items-center mt-2 space-x-4">
              <Badge>{serviceRequest.category}</Badge>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>Deadline: {serviceRequest.deadline}</span>
              </div>
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-bold">${serviceRequest.budget}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-video overflow-hidden rounded-lg border bg-muted">
              <img
                src={serviceRequest.images[selectedImage] || "/placeholder.svg"}
                alt={`${serviceRequest.title} preview`}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex space-x-2 overflow-auto pb-2">
              {serviceRequest.images.map((image, index) => (
                <button
                  key={index}
                  className={`relative flex-shrink-0 cursor-pointer overflow-hidden rounded-md border ${
                    selectedImage === index ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    className="h-16 w-16 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Service Details Tabs */}
          <Tabs defaultValue="description">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="bids">Bids ({serviceRequest.bids.length})</TabsTrigger>
              <TabsTrigger value="client">Client</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="p-4 border rounded-md mt-2">
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: serviceRequest.longDescription }} />
            </TabsContent>
            <TabsContent value="bids" className="space-y-4 p-4 border rounded-md mt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Service Provider Bids</h3>
                <div className="text-sm text-muted-foreground">
                  {serviceRequest.bids.length} bid{serviceRequest.bids.length !== 1 ? "s" : ""}
                </div>
              </div>
              <div className="space-y-4">
                {serviceRequest.bids.length > 0 ? (
                  serviceRequest.bids.map((bid) => (
                    <div key={bid.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-start gap-3">
                        <img
                          src={bid.provider.avatar || "/placeholder.svg"}
                          alt={bid.provider.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{bid.provider.name}</h4>
                            <span className="font-bold">${bid.amount}</span>
                          </div>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                            <span className="text-sm">
                              {bid.provider.rating} ({bid.provider.completedJobs} jobs)
                            </span>
                          </div>
                          <p className="mt-2 text-sm">{bid.message}</p>
                          <div className="mt-3 flex justify-end">
                            <Button size="sm" variant="outline">
                              Contact
                            </Button>
                            <Button size="sm" className="ml-2">
                              Accept Bid
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No bids yet. Be the first to bid on this service request!</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="client" className="p-4 border rounded-md mt-2">
              <div className="flex items-start gap-4">
                <img
                  src={serviceRequest.client.avatar || "/placeholder.svg"}
                  alt={serviceRequest.client.name}
                  className="h-20 w-20 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold">{serviceRequest.client.name}</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{serviceRequest.client.location || "Location not specified"}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Member since {serviceRequest.client.memberSince}</span>
                    </div>
                  </div>
                  <Button className="mt-4" variant="outline" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact Client
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          {/* Bid Card */}
          <Card>
            <CardHeader>
              <CardTitle>Place a Bid</CardTitle>
              <CardDescription>Submit your proposal for this service request</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmitBid)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Client's Budget</span>
                    <span className="font-bold">${serviceRequest.budget}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Deadline</span>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>{serviceRequest.deadline}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="bid-amount" className="text-sm font-medium">
                    Your Bid Amount
                  </label>
                  <Input
                    id="bid-amount"
                    type="number"
                    placeholder="Enter amount"
                    defaultValue={serviceRequest.budget}
                    {...register("amount", { valueAsNumber: true })}
                  />
                  {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
                </div>
                <div className="space-y-2">
                  <label htmlFor="bid-message" className="text-sm font-medium">
                    Message to Client
                  </label>
                  <Textarea
                    id="bid-message"
                    placeholder="Describe how you can help with this request, your qualifications, and proposed timeline"
                    className="min-h-[100px]"
                    {...register("message")}
                  />
                  {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                {isConnected ? (
                  <Button className="w-full" type="submit" disabled={submitting}>
                    <Wallet className="mr-2 h-4 w-4" />
                    {submitting ? "Processing..." : "Place Bid"}
                  </Button>
                ) : (
                  <Button className="w-full" type="button" onClick={connect}>
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet to Bid
                  </Button>
                )}
                <div className="flex items-center justify-center text-sm text-muted-foreground">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Secure blockchain escrow protection</span>
                </div>
              </CardFooter>
            </form>
          </Card>

          {/* Request Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Request Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Status</span>
                <Badge variant={serviceRequest.status === "OPEN" ? "default" : "secondary"}>
                  {serviceRequest.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Bids</span>
                <span className="font-medium">{serviceRequest.bids.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg. Bid Amount</span>
                <span className="font-medium">
                  $
                  {serviceRequest.bids.length > 0
                    ? Math.round(
                        serviceRequest.bids.reduce((sum, bid) => sum + bid.amount, 0) / serviceRequest.bids.length,
                      )
                    : 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Posted</span>
                <span className="font-medium">{new Date(serviceRequest.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

