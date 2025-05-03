"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Star, ThumbsUp, Flag, CheckCircle } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ReviewCardProps {
  review: {
    id: string
    authorId: string
    authorName: string
    authorAvatar: string
    rating: number
    content: string
    timestamp: string
    serviceId: string
    serviceName: string
    helpful: number
    verified: boolean
  }
  showService?: boolean
}

export function ReviewCard({ review, showService = false }: ReviewCardProps) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful)
  const [isHelpful, setIsHelpful] = useState(false)
  const [isReported, setIsReported] = useState(false)

  const handleHelpfulClick = () => {
    if (!isHelpful) {
      setHelpfulCount((prev) => prev + 1)
      setIsHelpful(true)
    } else {
      setHelpfulCount((prev) => prev - 1)
      setIsHelpful(false)
    }
  }

  const handleReportClick = () => {
    setIsReported(true)
  }

  const formatDate = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={review.authorAvatar} alt={review.authorName} />
              <AvatarFallback>{review.authorName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center">
                <h4 className="font-medium">{review.authorName}</h4>
                {review.verified && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CheckCircle className="h-4 w-4 ml-1 text-green-500" />
                      </TooltipTrigger>
                      <TooltipContent>Verified Purchase</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <div className="text-sm text-muted-foreground">{formatDate(review.timestamp)}</div>
            </div>
          </div>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"}`}
              />
            ))}
          </div>
        </div>

        {showService && (
          <div className="mb-3 text-sm">
            <span className="text-muted-foreground">Service: </span>
            <a href={`/services/${review.serviceId}`} className="font-medium hover:underline">
              {review.serviceName}
            </a>
          </div>
        )}

        <p className="text-sm">{review.content}</p>
      </CardContent>

      <CardFooter className="flex justify-between pt-2">
        <Button
          variant="ghost"
          size="sm"
          className={`text-xs ${isHelpful ? "text-primary" : ""}`}
          onClick={handleHelpfulClick}
        >
          <ThumbsUp className="h-3.5 w-3.5 mr-1" />
          Helpful ({helpfulCount})
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={`text-xs ${isReported ? "text-destructive" : ""}`}
          onClick={handleReportClick}
          disabled={isReported}
        >
          <Flag className="h-3.5 w-3.5 mr-1" />
          {isReported ? "Reported" : "Report"}
        </Button>
      </CardFooter>
    </Card>
  )
}

