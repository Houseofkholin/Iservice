import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

// GET handler to fetch all services
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const query = searchParams.get("query")

    // Build the SQL query based on filters
    let sql = "SELECT * FROM services"
    const params = []

    if (category || query) {
      sql += " WHERE"

      if (category) {
        sql += " category = $1"
        params.push(category)
      }

      if (query) {
        if (category) {
          sql += " AND"
        }
        sql += ` (title ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})`
        params.push(`%${query}%`)
      }
    }

    sql += " ORDER BY created_at DESC"

    const services = await db.query(sql, params)

    return NextResponse.json(services.rows)
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 })
  }
}

// POST handler to create a new service
export async function POST(request) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse the request body
    const data = await request.json()
    console.log("Received service data:", data)

    // Validate required fields
    const requiredFields = ["title", "description", "category", "price"]
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Insert the service into the database
    const result = await db.query(
      `INSERT INTO services 
       (title, description, category, price, delivery_time, tags, user_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        data.title,
        data.description,
        data.category,
        data.price,
        data.deliveryTime || 1, // Default to 1 day if not provided
        data.tags || [], // Default to empty array if not provided
        session.user.id,
      ],
    )

    const newService = result.rows[0]
    console.log("Created service:", newService)

    return NextResponse.json(newService)
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json({ error: "Failed to create service: " + error.message }, { status: 500 })
  }
}

