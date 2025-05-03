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
    // For now, we'll return some realistic contract data
    const contracts = [
      {
        id: "1234",
        serviceId: "201",
        serviceTitle: "Logo Design",
        clientId: "client1",
        clientName: "Michael Chen",
        clientAvatar: "/placeholder.svg?height=32&width=32&text=MC",
        amount: 300,
        dueDate: new Date("2023-03-21").toISOString(),
        status: "IN_PROGRESS",
        createdAt: new Date("2023-03-10").toISOString(),
      },
      {
        id: "1235",
        serviceId: "202",
        serviceTitle: "Website Redesign",
        clientId: "client2",
        clientName: "Sarah Johnson",
        clientAvatar: "/placeholder.svg?height=32&width=32&text=SJ",
        amount: 750,
        dueDate: new Date("2023-03-20").toISOString(),
        status: "IN_PROGRESS",
        createdAt: new Date("2023-03-05").toISOString(),
      },
      {
        id: "1230",
        serviceId: "203",
        serviceTitle: "Content Writing",
        clientId: "client3",
        clientName: "David Brown",
        clientAvatar: "/placeholder.svg?height=32&width=32&text=DB",
        amount: 200,
        dueDate: new Date("2023-03-05").toISOString(),
        status: "COMPLETED",
        createdAt: new Date("2023-02-25").toISOString(),
      },
    ]

    return NextResponse.json({ contracts })
  } catch (error) {
    console.error("Error fetching user contracts:", error)
    return NextResponse.json({ error: "Failed to fetch user contracts" }, { status: 500 })
  }
}

