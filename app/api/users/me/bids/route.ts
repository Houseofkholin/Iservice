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
    // For now, we'll return some realistic bid data
    const bids = [
      {
        id: "1",
        serviceId: "101",
        serviceTitle: "E-commerce Website Development",
        clientName: "Olivia Taylor",
        clientId: "client1",
        amount: 850,
        message:
          "I can build a comprehensive e-commerce solution with all the features you need, including payment processing and inventory management.",
        status: "PENDING",
        createdAt: new Date("2023-03-15").toISOString(),
      },
      {
        id: "2",
        serviceId: "102",
        serviceTitle: "Logo Design",
        clientName: "Michael Chen",
        clientId: "client2",
        amount: 300,
        message:
          "I can create a modern, unique logo that represents your brand identity. I'll provide multiple concepts and revisions.",
        status: "ACCEPTED",
        createdAt: new Date("2023-03-12").toISOString(),
      },
      {
        id: "3",
        serviceId: "103",
        serviceTitle: "Social Media Marketing",
        clientName: "Emma Wilson",
        clientId: "client3",
        amount: 450,
        message:
          "I can help you grow your social media presence with a comprehensive marketing strategy tailored to your business.",
        status: "REJECTED",
        createdAt: new Date("2023-03-10").toISOString(),
      },
    ]

    return NextResponse.json({ bids })
  } catch (error) {
    console.error("Error fetching user bids:", error)
    return NextResponse.json({ error: "Failed to fetch user bids" }, { status: 500 })
  }
}

