import type React from "react"
import Link from "next/link"
import {
  ArrowRight,
  Search,
  Paintbrush,
  Globe,
  Truck,
  Music,
  Book,
  Utensils,
  Camera,
  Zap,
  Heart,
  Briefcase,
  Code,
  Scissors,
  Home,
  Shirt,
  Dog,
  Dumbbell,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function CategoriesPage() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Service Categories</h1>
        <p className="text-muted-foreground max-w-3xl">
          Browse all service categories available on I-service. From creative work to everyday tasks, find exactly what
          you need.
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-12">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search categories..." className="pl-8" />
      </div>

      {/* Featured Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <CategoryCard icon={<Home />} name="Home Services" count={1240} />
          <CategoryCard icon={<Paintbrush />} name="Creative & Design" count={986} />
          <CategoryCard icon={<Code />} name="Digital Services" count={1543} />
          <CategoryCard icon={<Truck />} name="Delivery & Moving" count={752} />
          <CategoryCard icon={<Utensils />} name="Food & Cooking" count={631} />
          <CategoryCard icon={<Book />} name="Education" count={894} />
        </div>
      </div>

      {/* All Categories */}
      <div>
        <h2 className="text-2xl font-bold mb-6">All Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CategorySection
            title="Home Services"
            icon={<Home className="h-5 w-5" />}
            subcategories={[
              "Cleaning",
              "Repairs",
              "Gardening",
              "Plumbing",
              "Electrical",
              "Painting",
              "Furniture Assembly",
              "Home Security",
              "Smart Home Setup",
            ]}
          />

          <CategorySection
            title="Creative & Design"
            icon={<Paintbrush className="h-5 w-5" />}
            subcategories={[
              "Graphic Design",
              "Illustration",
              "Logo Design",
              "UI/UX Design",
              "Animation",
              "Art & Drawings",
              "Tattoo Design",
              "Fashion Design",
              "Interior Design",
            ]}
          />

          <CategorySection
            title="Digital Services"
            icon={<Globe className="h-5 w-5" />}
            subcategories={[
              "Web Development",
              "Mobile Apps",
              "Social Media",
              "SEO",
              "Content Writing",
              "Virtual Assistant",
              "Data Entry",
              "Email Marketing",
              "Cybersecurity",
            ]}
          />

          <CategorySection
            title="Delivery & Moving"
            icon={<Truck className="h-5 w-5" />}
            subcategories={[
              "Local Delivery",
              "Grocery Delivery",
              "Furniture Moving",
              "Package Pickup",
              "Food Delivery",
              "Courier Services",
              "Heavy Item Delivery",
              "Same-day Delivery",
            ]}
          />

          <CategorySection
            title="Food & Cooking"
            icon={<Utensils className="h-5 w-5" />}
            subcategories={[
              "Personal Chef",
              "Meal Prep",
              "Baking",
              "Catering",
              "Cooking Lessons",
              "Special Diet Cooking",
              "Bartending",
              "Food Photography",
            ]}
          />

          <CategorySection
            title="Education"
            icon={<Book className="h-5 w-5" />}
            subcategories={[
              "Tutoring",
              "Language Learning",
              "Music Lessons",
              "Academic Writing",
              "Test Preparation",
              "Career Coaching",
              "Public Speaking",
              "Programming Lessons",
            ]}
          />

          <CategorySection
            title="Lifestyle"
            icon={<Heart className="h-5 w-5" />}
            subcategories={[
              "Personal Shopping",
              "Event Planning",
              "Dating Coach",
              "Life Coaching",
              "Travel Planning",
              "Meditation Instructor",
              "Astrology Readings",
              "Relationship Advice",
            ]}
          />

          <CategorySection
            title="Music & Audio"
            icon={<Music className="h-5 w-5" />}
            subcategories={[
              "Music Production",
              "Voice Over",
              "Singing Lessons",
              "Audio Editing",
              "Podcast Production",
              "Sound Design",
              "Jingles & Intros",
              "Mixing & Mastering",
            ]}
          />

          <CategorySection
            title="Photography"
            icon={<Camera className="h-5 w-5" />}
            subcategories={[
              "Portrait Photography",
              "Event Photography",
              "Product Photography",
              "Real Estate Photography",
              "Food Photography",
              "Photo Editing",
              "Wedding Photography",
              "Aerial Photography",
            ]}
          />

          <CategorySection
            title="Tech Support"
            icon={<Zap className="h-5 w-5" />}
            subcategories={[
              "Computer Repair",
              "Phone Repair",
              "IT Support",
              "Data Recovery",
              "Virus Removal",
              "Network Setup",
              "Smart Home Setup",
              "Software Training",
            ]}
          />

          <CategorySection
            title="Beauty & Personal Care"
            icon={<Scissors className="h-5 w-5" />}
            subcategories={[
              "Haircuts & Styling",
              "Makeup Services",
              "Nail Care",
              "Skincare",
              "Massage Therapy",
              "Personal Styling",
              "Barber Services",
              "Spa Services",
            ]}
          />

          <CategorySection
            title="Business Services"
            icon={<Briefcase className="h-5 w-5" />}
            subcategories={[
              "Consulting",
              "Legal Services",
              "Accounting",
              "Business Planning",
              "Market Research",
              "Tax Preparation",
              "Financial Advice",
              "Business Coaching",
            ]}
          />

          <CategorySection
            title="Health & Fitness"
            icon={<Dumbbell className="h-5 w-5" />}
            subcategories={[
              "Personal Training",
              "Yoga Instruction",
              "Nutrition Advice",
              "Fitness Classes",
              "Mental Health Support",
              "Physical Therapy",
              "Meditation Coaching",
              "Wellness Planning",
            ]}
          />

          <CategorySection
            title="Pet Services"
            icon={<Dog className="h-5 w-5" />}
            subcategories={[
              "Pet Sitting",
              "Dog Walking",
              "Pet Grooming",
              "Pet Training",
              "Veterinary Services",
              "Pet Photography",
              "Pet Transportation",
              "Aquarium Maintenance",
            ]}
          />

          <CategorySection
            title="Fashion & Clothing"
            icon={<Shirt className="h-5 w-5" />}
            subcategories={[
              "Custom Clothing",
              "Alterations",
              "Fashion Design",
              "Personal Styling",
              "Costume Design",
              "Shoe Repair",
              "Jewelry Making",
              "Wardrobe Organization",
            ]}
          />
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to offer your services?</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          Join thousands of service providers already earning on I-service. Create your listing in minutes and start
          receiving bids.
        </p>
        <Button size="lg" variant="secondary" asChild>
          <Link href="/services/create">
            Create a Service Listing
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}

function CategoryCard({ icon, name, count }: { icon: React.ReactNode; name: string; count: number }) {
  return (
    <Link href={`/marketplace?category=${name.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="flex flex-col items-center justify-center p-4 rounded-lg border bg-card hover:border-primary/50 hover:shadow-md transition-all h-full">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2 bg-primary/10 dark:bg-primary/20">
          {icon}
        </div>
        <span className="text-sm font-medium text-center">{name}</span>
        <span className="text-xs text-muted-foreground">{count} services</span>
      </div>
    </Link>
  )
}

function CategorySection({
  title,
  icon,
  subcategories,
}: { title: string; icon: React.ReactNode; subcategories: string[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
            {icon}
          </div>
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pb-1">
        <ul className="grid grid-cols-2 gap-y-1 gap-x-4">
          {subcategories.map((subcategory) => (
            <li key={subcategory}>
              <Link
                href={`/marketplace?category=${title.toLowerCase().replace(/\s+/g, "-")}&subcategory=${subcategory.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm hover:text-primary hover:underline transition-colors"
              >
                {subcategory}
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full" asChild>
          <Link href={`/marketplace?category=${title.toLowerCase().replace(/\s+/g, "-")}`}>
            View all in {title}
            <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

