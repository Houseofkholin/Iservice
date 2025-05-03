import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"

// Create a database client
const sql = neon(process.env.NEON_NEON_NEON_DATABASE_URL || "")

export async function GET(request) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // For now, return mock data since we don't have the orders table yet
    // In a real implementation, you would query the database
    const mockOrders = [
      {
        id: "order_1",
        service: {
          id: "service_1",
          title: "Professional Web Development",
          description: "Full-stack web development services using modern technologies.",
        },
        status: "In Progress",
        amount: 499.99,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        deliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "order_2",
        service: {
          id: "service_2",
          title: "Logo Design",
          description: "Professional logo design for your brand.",
        },
        status: "Completed",
        amount: 99.99,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        deliveryDate: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "order_3",
        service: {
          id: "service_3",
          title: "Content Writing",
          description: "SEO-optimized content for your website.",
        },
        status: "Cancelled",
        amount: 149.99,
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        deliveryDate: null,
      },
    ]

    return NextResponse.json(mockOrders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

