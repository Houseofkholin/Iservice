import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { nanoid } from "nanoid"
import { hash } from "bcryptjs"

const sql = neon("postgresql://neondb_owner:npg_IgEXPjZUzo18@ep-misty-brook-a55iintt-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require")

export async function POST(req) {
  try {
    const { name, email, password } = await req.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUsers = await sql`
      SELECT * FROM users WHERE email = ${email}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    const userId = `user_${nanoid()}`
    const userImage = `/placeholder.svg?height=80&width=80&text=${name.charAt(0)}`

    await sql`
      INSERT INTO users (
        id, 
        name, 
        email, 
        password, 
        image, 
        created_at, 
        updated_at
      ) VALUES (
        ${userId}, 
        ${name}, 
        ${email}, 
        ${hashedPassword}, 
        ${userImage}, 
        NOW(), 
        NOW()
      )
    `

    return NextResponse.json({
      user: {
        id: userId,
        name,
        email,
        image: userImage,
      },
      message: "User registered successfully",
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}

