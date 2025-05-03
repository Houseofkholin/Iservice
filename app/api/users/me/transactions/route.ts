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
    // For now, we'll return some realistic transaction data
    const transactions = [
      {
        id: "tx1",
        type: "PAYMENT_RECEIVED",
        contractId: "1230",
        contractTitle: "Content Writing",
        amount: 200,
        status: "COMPLETED",
        timestamp: new Date("2023-03-15T10:24:00").toISOString(),
      },
      {
        id: "tx2",
        type: "ESCROW_CREATED",
        contractId: "1234",
        contractTitle: "Logo Design",
        amount: 300,
        status: "IN_PROGRESS",
        timestamp: new Date("2023-03-10T14:15:00").toISOString(),
      },
      {
        id: "tx3",
        type: "WITHDRAWAL",
        contractId: null,
        contractTitle: null,
        amount: 500,
        status: "COMPLETED",
        timestamp: new Date("2023-03-05T11:30:00").toISOString(),
      },
    ]

    return NextResponse.json({ transactions })
  } catch (error) {
    console.error("Error fetching wallet transactions:", error)
    return NextResponse.json({ error: "Failed to fetch wallet transactions" }, { status: 500 })
  }
}

