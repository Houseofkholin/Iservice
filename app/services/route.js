import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"
import { v4 as uuidv4 } from "uuid"

// Create a database client
const sql = neon(process.env.NEON_NEON_DATABASE_URL || process.env.NEON_NEON_DATABASE_URL || "")

// GET handler to fetch all services
export async function GET(request) {
    try {
      const { searchParams } = new URL(request.url)
      const category = searchParams.get("category")
      const query = searchParams.get("query")

      // Build the SQL query dynamically using parameterization
      let baseQuery = sql`SELECT * FROM services`
      const conditions = []
      const params = []

      if (category) {
        conditions.push(sql`category = ${category}`)
      }

      if (query) {
        conditions.push(sql`(title ILIKE ${`%${query}%`} OR description ILIKE ${`%${query}%`})`)
      }

      if (conditions.length > 0) {
        baseQuery = sql`${baseQuery} WHERE ${sql.join(conditions, sql` AND `)}`
      }

      const finalQuery = sql`${baseQuery} ORDER BY created_at DESC`
      const services = await finalQuery

      return NextResponse.json(services || [])
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
  
      // Generate a unique ID for the service
      const serviceId = `service_${uuidv4()}`
  
      // Insert the service into the database
      const result = await sql`
        INSERT INTO services 
        (id, title, description, category, price, delivery_time, tags, provider_id) 
        VALUES (
          ${serviceId}, 
          ${data.title}, 
          ${data.description}, 
          ${data.category}, 
          ${data.price}, 
          ${data.deliveryTime || 1}, 
          ${data.tags || []}, 
          ${session.user.id}
        ) 
        RETURNING *
      `
  
      const newService = result[0]
      console.log("Created service:", newService)
  
      return NextResponse.json(newService)
    } catch (error) {
      console.error("Error creating service:", error)
      return NextResponse.json({ error: "Failed to create service: " + error.message }, { status: 500 })
    }
  }