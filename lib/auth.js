import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { neon } from "@neondatabase/serverless"
import { nanoid } from 'nanoid'
import { compare } from "bcryptjs"

// Create a database client
const sql = neon(process.env.NEON_NEON_DATABASE_URL || "postgresql://neondb_owner:npg_IgEXPjZUzo18@ep-misty-brook-a55iintt-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require")


export const authOptions = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Find user in the database
          const users = await sql`
            SELECT * FROM users WHERE email = ${credentials.email}
          `

          const user = users.length > 0 ? users[0] : null

          if (!user || !user.password) {
            console.log("User not found or no password set")
            return null
          }

          // Compare passwords
          const passwordMatch = await compare(credentials.password, user.password)

          if (!passwordMatch) {
            console.log("Password doesn't match")
            return null
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          }
        } catch (error) {
          console.error("Error in authorize function:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Only handle Google sign-ins
        if (account.provider === "google") {
          // Check if user exists in the database
          const existingUsers = await sql`
            SELECT * FROM users WHERE email = ${user.email}
          `

          if (existingUsers.length === 0) {
            // User doesn't exist, create a new user
            const userId = `user_${nanoid()}`
            await sql`
              INSERT INTO users (
                id, 
                name, 
                email, 
                image, 
                created_at, 
                updated_at
              ) VALUES (
                ${userId}, 
                ${user.name}, 
                ${user.email}, 
                ${user.image}, 
                NOW(), 
                NOW()
              )
            `
            console.log(`Created new user in 'users' table: ${userId} (${user.email})`)

            // Update the user object with our database ID
            user.id = userId
          } else {
            // User exists, update their info
            const dbUser = existingUsers[0]
            await sql`
              UPDATE users 
              SET 
                name = ${user.name}, 
                image = ${user.image}, 
                updated_at = NOW() 
              WHERE id = ${dbUser.id}
            `
            console.log(`Updated existing user in 'users' table: ${dbUser.id} (${user.email})`)

            // Update the user object with our database ID
            user.id = dbUser.id
          }
        }

        return true
      } catch (error) {
        console.error("Error in signIn callback:", error)
        // Still allow sign in even if DB operations fail
        return true
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.picture = user.image
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.name = token.name
        session.user.email = token.email
        session.user.image = token.picture
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === "development",
}

