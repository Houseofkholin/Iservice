"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReviewsList } from "@/components/reviews/reviews-list"
import { ReviewForm } from "@/components/reviews/review-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ReviewsPage() {
  const [pendingReviews, setPendingReviews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch pending reviews
  useEffect(() => {
    const fetchPendingReviews = async () => {
      try {
        // In a real app, fetch from API
        // For now, use mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockPendingReviews = [
          {
            id: "service1",
            name: "Website Development",
            provider: "John Doe",
            completedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: "service2",
            name: "Logo Design",
            provider: "Jane Smith",
            completedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ]

        setPendingReviews(mockPendingReviews)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching pending reviews:", error)
        setIsLoading(false)
      }
    }

    fetchPendingReviews()
  }, [])

  // Handle review submission
  const handleReviewSubmitted = (serviceId: string) => {
    setPendingReviews((prev) => prev.filter((review) => review.id !== serviceId))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reviews</h1>
        <p className="text-muted-foreground">Manage your reviews and provide feedback on services</p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending Reviews</TabsTrigger>
          <TabsTrigger value="submitted">Your Reviews</TabsTrigger>
          <TabsTrigger value="received">Reviews Received</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6 mt-6">
          <h2 className="text-lg font-semibold">Services to Review</h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-40 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-32 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : pendingReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingReviews.map((service) => (
                <Card key={service.id}>
                  <CardHeader>
                    <CardTitle>{service.name}</CardTitle>
                    <CardDescription>
                      Provider: {service.provider} • Completed: {new Date(service.completedDate).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ReviewForm
                      serviceId={service.id}
                      serviceName={service.name}
                      onSuccess={() => handleReviewSubmitted(service.id)}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">You don't have any pending reviews at the moment.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="submitted" className="mt-6">
          <ReviewsList serviceId="user-submitted" showService={true} />
        </TabsContent>

        <TabsContent value="received" className="mt-6">
          <ReviewsList serviceId="user-received" showService={true} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

