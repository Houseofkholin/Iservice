import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { walletAddress } = await request.json()

    if (!walletAddress) {
      return NextResponse.json({ error: "Wallet address is required" }, { status: 400 })
    }

    // In a real app, you would update the user in your database
    // For now, we'll just return success

    return NextResponse.json({
      success: true,
      message: "Wallet address associated with account",
    })
  } catch (error) {
    console.error("Error associating wallet:", error)
    return NextResponse.json({ error: "Failed to associate wallet" }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // In a real app, you would update the user in your database
    // For now, we'll just return success

    return NextResponse.json({
      success: true,
      message: "Wallet address disassociated from account",
    })
  } catch (error) {
    console.error("Error disassociating wallet:", error)
    return NextResponse.json({ error: "Failed to disassociate wallet" }, { status: 500 })
  }
}

