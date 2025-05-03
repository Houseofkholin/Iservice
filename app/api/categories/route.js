import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET() {
  try {
    // Set headers to ensure JSON response
    const headers = {
      "Content-Type": "application/json",
    }

    // Fetch categories
    const categories = await db.findCategories()

    return NextResponse.json({ categories }, { headers })
  } catch (error) {
    console.error("Error fetching categories:", error)

    // Always return JSON, even in case of error
    return NextResponse.json(
      {
        categories: [],
        error: "Failed to fetch categories",
        details: error.message,
      },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

