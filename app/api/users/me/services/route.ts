import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In a real app, you would fetch this from your database
    // For now, we'll return some realistic service data
    const services = [
      {
        id: "1",
        title: "Professional Website Development",
        category: "Web Development",
        description:
          "I will create a responsive, modern website with clean code and SEO optimization for your business or personal brand.",
        price: 500,
        deliveryTime: "2-3 weeks",
        rating: 4.9,
        reviewCount: 18,
        status: "ACTIVE",
        bids: 5,
        image: "/placeholder.svg?height=225&width=400&text=Web+Dev",
        createdAt: new Date("2023-02-15").toISOString(),
      },
      {
        id: "2",
        title: "Modern UI/UX Design",
        category: "UI/UX Design",
        description:
          "I will design a modern, user-friendly interface for your application or website with attention to user experience.",
        price: 400,
        deliveryTime: "1-2 weeks",
        rating: 5.0,
        reviewCount: 12,
        status: "ACTIVE",
        bids: 3,
        image: "/placeholder.svg?height=225&width=400&text=UI/UX",
        createdAt: new Date("2023-03-01").toISOString(),
      },
    ]

    return NextResponse.json({ services })
  } catch (error) {
    console.error("Error fetching user services:", error)
    return NextResponse.json({ error: "Failed to fetch user services" }, { status: 500 })
  }
}

