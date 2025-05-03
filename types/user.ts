export interface User {
  id: string
  name: string
  email: string
  password: string
  image?: string
  role: "user" | "admin" | "provider"
}

