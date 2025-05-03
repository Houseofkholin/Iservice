"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const isAuthenticated = status === "authenticated"
  const isLoading = status === "loading"
  const user = session?.user

  const login = async (credentials) => {
    try {
      const result = await signIn("credentials", {
        ...credentials,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: "Authentication error",
          description: result.error,
          variant: "destructive",
        })
        return false
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      })
      return true
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Authentication error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  const loginWithGoogle = async () => {
    try {
      await signIn("google", { callbackUrl: "/marketplace" })
    } catch (error) {
      console.error("Google login error:", error)
      toast({
        title: "Authentication error",
        description: "Failed to login with Google. Please try again.",
        variant: "destructive",
      })
    }
  }

  const logout = async () => {
    try {
      await signOut({ redirect: false })
      router.push("/")
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    loginWithGoogle,
    logout,
  }
}

