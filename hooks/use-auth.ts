"use client"

import { useCallback } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { useToast } from "@/components/ui/use-toast"

interface UseAuthReturn {
  user: any
  isLoggedIn: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession()
  const { toast } = useToast()

  const isLoading = status === "loading"
  const isLoggedIn = status === "authenticated"

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      try {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        })

        if (result?.error) {
          toast({
            title: "Authentication failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          })
          return false
        }

        toast({
          title: "Login successful",
          description: "Welcome back!",
        })
        return true
      } catch (error) {
        console.error("Login error:", error)
        toast({
          title: "Login failed",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
        return false
      }
    },
    [toast],
  )

  const logout = useCallback(async (): Promise<void> => {
    try {
      await signOut({ redirect: false })
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      })
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        title: "Logout failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }, [toast])

  return {
    user: session?.user,
    isLoggedIn,
    isLoading,
    login,
    logout,
  }
}

