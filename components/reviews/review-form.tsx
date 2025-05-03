"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  content: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(1000, "Review must be less than 1000 characters"),
})

type ReviewFormValues = z.infer<typeof reviewSchema>

interface ReviewFormProps {
  serviceId: string
  serviceName: string
  onSuccess?: () => void
}

export function ReviewForm({ serviceId, serviceName, onSuccess }: ReviewFormProps) {
  const { toast } = useToast()
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      content: "",
    },
  })

  const watchedRating = form.watch("rating")

  const onSubmit = async (data: ReviewFormValues) => {
    setIsSubmitting(true)

    try {
      // In a real app, submit to API
      console.log("Submitting review:", data)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      })

      // Reset form
      form.reset()

      // Call success callback
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      className="focus:outline-none"
                      onClick={() => field.onChange(rating)}
                      onMouseEnter={() => setHoveredRating(rating)}
                      onMouseLeave={() => setHoveredRating(0)}
                    >
                      <Star
                        className={`h-6 w-6 ${
                          rating <= (hoveredRating || field.value) ? "text-yellow-500 fill-yellow-500" : "text-muted"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormDescription>
                {watchedRating === 1 && "Poor"}
                {watchedRating === 2 && "Fair"}
                {watchedRating === 3 && "Good"}
                {watchedRating === 4 && "Very Good"}
                {watchedRating === 5 && "Excellent"}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Review</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={`What did you think about ${serviceName}?`}
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>Your review will help others make better decisions.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </Form>
  )
}

