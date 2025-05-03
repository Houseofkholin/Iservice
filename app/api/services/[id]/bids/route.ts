import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { findServiceById, createBid, createNotification } from "@/lib/db-utils"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const serviceId = params.id
    const { amount, message } = await req.json()

    // Validate input
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid bid amount" }, { status: 400 })
    }

    // Check if service exists
    const service = await findServiceById(serviceId)

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    // Prevent client from bidding on their own service
    if (service.client.id === session.user.id) {
      return NextResponse.json({ error: "You cannot bid on your own service" }, { status: 400 })
    }

    // Create the bid
    const bid = await createBid({
      amount,
      message,
      serviceId,
      userId: session.user.id,
    })

    // Create notification for the service owner
    await createNotification({
      title: "New Bid Received",
      message: `You received a new bid of $${amount} on your service "${service.title}"`,
      type: "BID_RECEIVED",
      userId: service.client.id,
      relatedId: serviceId,
      relatedType: "SERVICE",
    })

    // Simulate blockchain transaction
    const blockchainResult = {
      success: true,
      transactionHash: `0x${Array(64)
        .fill(0)
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("")}`,
    }

    return NextResponse.json({
      success: true,
      bidId: bid.id,
      transactionHash: blockchainResult.transactionHash,
    })
  } catch (error) {
    console.error("Error placing bid:", error)
    return NextResponse.json({ error: "Failed to place bid" }, { status: 500 })
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const serviceId = params.id

    const service = await findServiceById(serviceId)

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 })
    }

    return NextResponse.json({ bids: service.bids })
  } catch (error) {
    console.error("Error fetching bids:", error)
    return NextResponse.json({ error: "Failed to fetch bids" }, { status: 500 })
  }
}

