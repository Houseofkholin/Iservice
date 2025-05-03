import { neon, neonConfig } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

// Configure neon to use SSL
neonConfig.fetchConnectionCache = true

// Create a SQL client using the NEON_DATABASE_URL environment variable
const sql = neon("postgresql://neondb_owner:npg_IgEXPjZUzo18@ep-misty-brook-a55iintt-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require")

// Create a drizzle client
export const db = drizzle(sql)

// Export the sql client for raw queries
export { sql }

