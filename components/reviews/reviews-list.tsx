"use client"

import { useState, useEffect, useMemo } from "react"
import { Star } from "lucide-react"

import { ReviewCard } from "@/components/reviews/review-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ReviewsListProps {
  serviceId: string
  showService?: boolean
}

export function ReviewsList({ serviceId, showService = false }: ReviewsListProps) {
  const [reviews, setReviews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState("recent")
  const [filterRating, setFilterRating] = useState("all")

  // Fetch reviews
  useEffect(() => {
    let isMounted = true

    const fetchReviews = async () => {
      try {
        // In a real app, fetch from API
        // For now, use mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockReviews = [
          {
            id: "rev1",
            authorId: "user1",
            authorName: "Jane Smith",
            authorAvatar: "/placeholder.svg?height=40&width=40",
            rating: 5,
            content:
              "Excellent service! The provider was professional, responsive, and delivered high-quality work ahead of schedule. I would definitely hire again for future projects.",
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            serviceId,
            serviceName: "Website Development",
            helpful: 12,
            verified: true,
          },
          {
            id: "rev2",
            authorId: "user2",
            authorName: "John Doe",
            authorAvatar: "/placeholder.svg?height=40&width=40",
            rating: 4,
            content:
              "Good experience overall. The work was completed on time and met most of my requirements. There were a few minor issues that needed revision, but they were addressed promptly.",
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            serviceId,
            serviceName: "Website Development",
            helpful: 5,
            verified: true,
          },
          {
            id: "rev3",
            authorId: "user3",
            authorName: "Alice Johnson",
            authorAvatar: "/placeholder.svg?height=40&width=40",
            rating: 3,
            content:
              "Average service. The provider completed the work, but communication was lacking and there were delays in delivery. The final result was acceptable but not exceptional.",
            timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            serviceId,
            serviceName: "Website Development",
            helpful: 2,
            verified: false,
          },
          {
            id: "rev4",
            authorId: "user4",
            authorName: "Robert Brown",
            authorAvatar: "/placeholder.svg?height=40&width=40",
            rating: 5,
            content:
              "Outstanding service! The provider went above and beyond to ensure my satisfaction. The quality of work exceeded my expectations, and I received excellent value for my money.",
            timestamp: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
            serviceId,
            serviceName: "Website Development",
            helpful: 8,
            verified: true,
          },
        ]

        if (isMounted) {
          setReviews(mockReviews)
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error fetching reviews:", error)
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchReviews()

    return () => {
      isMounted = false
    }
  }, [serviceId]) // Only depend on serviceId

  // Move the calculations outside of the render function to avoid recalculations on every render
  // Add useMemo for derived values
  const averageRating = useMemo(
    () => (reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0),
    [reviews],
  )

  // Add useMemo for filtered and sorted reviews
  const filteredAndSortedReviews = useMemo(
    () =>
      reviews
        .filter((review) => {
          if (filterRating === "all") return true
          return review.rating === Number.parseInt(filterRating)
        })
        .sort((a, b) => {
          if (sortBy === "recent") {
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          } else if (sortBy === "helpful") {
            return b.helpful - a.helpful
          } else if (sortBy === "highest") {
            return b.rating - a.rating
          } else if (sortBy === "lowest") {
            return a.rating - b.rating
          }
          return 0
        }),
    [reviews, filterRating, sortBy],
  )

  // Add useMemo for rating distribution
  const ratingCounts = useMemo(
    () =>
      [5, 4, 3, 2, 1].map((rating) => {
        const count = reviews.filter((review) => review.rating === rating).length
        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
        return { rating, count, percentage }
      }),
    [reviews],
  )

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-40" />
          <div className="flex items-center space-x-4">
            <Skeleton className="h-16 w-16" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h2 className="text-xl font-semibold">Customer Reviews</h2>
            <div className="flex items-center space-x-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="helpful">Most Helpful</SelectItem>
                  <SelectItem value="highest">Highest Rated</SelectItem>
                  <SelectItem value="lowest">Lowest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
                  <div>
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.round(averageRating) ? "text-yellow-500 fill-yellow-500" : "text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">Based on {reviews.length} reviews</div>
                  </div>
                </div>

                <div className="space-y-2">
                  {ratingCounts.map(({ rating, count, percentage }) => (
                    <div key={rating} className="flex items-center space-x-2">
                      <div className="w-12 text-sm">{rating} stars</div>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500" style={{ width: `${percentage}%` }}></div>
                      </div>
                      <div className="w-8 text-sm text-right">{count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <Tabs defaultValue="all" onValueChange={(value) => setFilterRating(value)}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="5">5 Stars</TabsTrigger>
                  <TabsTrigger value="4">4 Stars</TabsTrigger>
                  <TabsTrigger value="3">3 Stars</TabsTrigger>
                  <TabsTrigger value="2">2 Stars</TabsTrigger>
                  <TabsTrigger value="1">1 Star</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4 mt-4">
                  {filteredAndSortedReviews.length > 0 ? (
                    filteredAndSortedReviews.map((review) => (
                      <ReviewCard key={review.id} review={review} showService={showService} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">No reviews found</div>
                  )}
                </TabsContent>

                {[5, 4, 3, 2, 1].map((rating) => (
                  <TabsContent key={rating} value={rating.toString()} className="space-y-4 mt-4">
                    {filteredAndSortedReviews.length > 0 ? (
                      filteredAndSortedReviews.map((review) => (
                        <ReviewCard key={review.id} review={review} showService={showService} />
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">No {rating}-star reviews found</div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>

              {filteredAndSortedReviews.length > 4 && (
                <div className="text-center pt-4">
                  <Button variant="outline">Load More Reviews</Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

