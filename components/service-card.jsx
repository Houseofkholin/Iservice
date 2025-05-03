import Link from "next/link"
import { Star, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function ServiceCard({ service }) {
  // Handle potential missing fields gracefully
  const {
    id,
    title,
    description,
    price,
    delivery_time: deliveryTime = "Not specified",
    category,
    image,
    provider,
    rating = 0,
  } = service || {}

  // Format price to 2 decimal places if it's a number
  const formattedPrice = typeof price === "number" ? price.toFixed(2) : price

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="aspect-video w-full overflow-hidden bg-muted">
        <img
          src={image || "/placeholder.svg?height=200&width=300"}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          {category && <Badge>{category}</Badge>}
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm font-medium">{rating}</span>
          </div>
        </div>
        <h3 className="font-semibold line-clamp-2">{title}</h3>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</p>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
            <span>
              {deliveryTime} {Number.parseInt(deliveryTime) === 1 ? "day" : "days"}
            </span>
          </div>
          <div className="font-bold">${formattedPrice}</div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/services/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

