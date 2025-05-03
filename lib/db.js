import { Pool } from "pg"

// Create a new PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.NEON_NEON_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

// Simple query method that wraps the pool.query method
export const db = {
  query: (text, params) => {
    console.log("Executing query:", text)
    if (params) {
      console.log("Query params:", params)
    }
    return pool.query(text, params)
  },
  connect: () => pool.connect(),
}

// Test the database connection
db.query("SELECT NOW()")
  .then((res) => console.log("Database connected:", res.rows[0].now))
  .catch((err) => console.error("Database connection error:", err))

 