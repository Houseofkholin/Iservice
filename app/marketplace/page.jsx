"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ServiceCard } from "@/components/service-card"
import { servicesAPI, categoriesAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function MarketplacePage() {
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [rating, setRating] = useState("any")
  const { toast } = useToast()

  // Fetch services and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch services
        const servicesData = await servicesAPI.getServices()
        console.log("Services data:", servicesData)
        setServices(Array.isArray(servicesData) ? servicesData : [])

        // Fetch categories
        const categoriesData = await categoriesAPI.getCategories()
        console.log("Categories data:", categoriesData)
        setCategories(Array.isArray(categoriesData) ? categoriesData : [])
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load marketplace data. Please try again later.",
          variant: "destructive",
        })
        setServices([])
        setCategories([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  // Handle filter application
  const applyFilters = async () => {
    try {
      setIsLoading(true)

      // Build filters object
      const filters = {}

      if (selectedCategory !== "all") {
        filters.category = selectedCategory
      }

      if (searchQuery) {
        filters.query = searchQuery
      }

      if (priceRange.min) {
        filters.minPrice = priceRange.min
      }

      if (priceRange.max) {
        filters.maxPrice = priceRange.max
      }

      if (rating !== "any") {
        filters.minRating = rating.replace("+", "")
      }

      // Fetch filtered services
      const filteredServices = await servicesAPI.getServices(filters)
      setServices(Array.isArray(filteredServices) ? filteredServices : [])
    } catch (error) {
      console.error("Error applying filters:", error)
      toast({
        title: "Error",
        description: "Failed to apply filters. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4 space-y-6">
          <div className="bg-card rounded-lg border p-4">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Categories</h3>
                <RadioGroup defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="all" />
                    <Label htmlFor="all">All Categories</Label>
                  </div>
                  {categories.map((category) => (
                    <div key={category.id || category.name} className="flex items-center space-x-2">
                      <RadioGroupItem value={category.name} id={category.id || category.name} />
                      <Label htmlFor={category.id || category.name}>{category.name}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <div>
                <h3 className="font-medium mb-2">Price Range</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Rating</h3>
                <RadioGroup defaultValue="any" value={rating} onValueChange={setRating}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="any" id="rating-any" />
                    <Label htmlFor="rating-any">Any Rating</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4+" id="rating-4" />
                    <Label htmlFor="rating-4">4+ Stars</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3+" id="rating-3" />
                    <Label htmlFor="rating-3">3+ Stars</Label>
                  </div>
                </RadioGroup>
              </div>
              <Button className="w-full" onClick={applyFilters}>
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
        <div className="md:w-3/4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold">Marketplace</h1>
            <div className="flex w-full md:w-auto gap-2">
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search services..."
                  className="w-full md:w-[300px] pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                />
              </div>
              <Button variant="outline" size="icon" className="hidden md:flex" onClick={applyFilters}>
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filter</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <ServiceCardSkeleton count={6} />
            ) : services.length > 0 ? (
              services.map((service) => <ServiceCard key={service.id || service.title} service={service} />)
            ) : (
              <div className="col-span-full text-center py-12">
                <h2 className="text-xl font-semibold mb-2">No services found</h2>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
                <Button asChild>
                  <Link href="/services/create">Create a Service</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ServiceCardSkeleton({ count = 3 }) {
  return (
    <>
      {Array(count)
        .fill(null)
        .map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="aspect-video">
              <Skeleton className="h-full w-full" />
            </div>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
    </>
  )
}

