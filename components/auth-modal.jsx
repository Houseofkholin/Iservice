"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

export function AuthModal({ isOpen, onClose, mode = "login" }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [authMode, setAuthMode] = useState(mode)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [verificationSent, setVerificationSent] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (authMode === "register") {
        // Register new user
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Registration failed")
        }

        // Show verification message
        setVerificationSent(true)
        toast({
          title: "Registration successful",
          description: "Please check your email for verification instructions.",
        })
      } else {
        // Login
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        })

        if (result?.error) {
          throw new Error(result.error || "Invalid credentials")
        }

        toast({
          title: "Login successful",
          description: "Welcome back!",
        })

        // Close modal and redirect
        onClose()
        router.push("/marketplace")
        router.refresh()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMode = () => {
    setAuthMode(authMode === "login" ? "register" : "login")
    setVerificationSent(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{authMode === "login" ? "Login" : "Create an Account"}</DialogTitle>
          <DialogDescription>
            {authMode === "login"
              ? "Enter your credentials to access your account"
              : "Fill in the information below to create your account"}
          </DialogDescription>
     
        </DialogHeader>

        {verificationSent ? (
          <div className="text-center py-6">
            <h3 className="text-lg font-medium">Verification Email Sent</h3>
            <p className="mt-2 text-sm text-gray-500">
              We've sent a verification email to {formData.email}. Please check your inbox and follow the instructions
              to verify your account.
            </p>
            <Button className="mt-4" onClick={onClose}>
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {authMode === "register" && (
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => signIn("google", { callbackUrl: "/marketplace" })}
                disabled={isLoading}
              >
                Continue with Google
              </Button>
            </div>

            <DialogFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading
                  ? authMode === "login"
                    ? "Logging in..."
                    : "Registering..."
                  : authMode === "login"
                    ? "Login"
                    : "Register"}
              </Button>
              <div className="text-center text-sm">
                {authMode === "login" ? "Don't have an account? " : "Already have an account? "}
                <button type="button" className="text-primary underline-offset-4 hover:underline" onClick={toggleMode}>
                  {authMode === "login" ? "Register" : "Login"}
                </button>
              </div>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

