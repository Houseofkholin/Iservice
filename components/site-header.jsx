"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Bell, Menu, Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTheme } from "next-themes"
import { AuthModal } from "@/components/auth-modal"

export function SiteHeader() {
  const pathname = usePathname()
  const { setTheme } = useTheme()
  const { data: session, status } = useSession()
  const loading = status === "loading"
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState("login")

  const handleOpenAuthModal = (mode) => {
    setAuthMode(mode)
    setAuthModalOpen(true)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">I-Service</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/marketplace"
              className={`transition-colors hover:text-foreground/80 ${
                pathname === "/marketplace" ? "text-foreground" : "text-foreground/60"
              }`}
            >
              Marketplace
            </Link>
            <Link
              href="/services"
              className={`transition-colors hover:text-foreground/80 ${
                pathname?.startsWith("/services") ? "text-foreground" : "text-foreground/60"
              }`}
            >
              My Services
            </Link>
            <Link
              href="/orders"
              className={`transition-colors hover:text-foreground/80 ${
                pathname?.startsWith("/orders") ? "text-foreground" : "text-foreground/60"
              }`}
            >
              Orders
            </Link>
            <Link
              href="/messages"
              className={`transition-colors hover:text-foreground/80 ${
                pathname?.startsWith("/messages") ? "text-foreground" : "text-foreground/60"
              }`}
            >
              Messages
            </Link>
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-2 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/" className="flex items-center">
              <span className="font-bold">I-Service</span>
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                <Link
                  href="/marketplace"
                  className={`transition-colors hover:text-foreground/80 ${
                    pathname === "/marketplace" ? "text-foreground" : "text-foreground/60"
                  }`}
                >
                  Marketplace
                </Link>
                <Link
                  href="/services"
                  className={`transition-colors hover:text-foreground/80 ${
                    pathname?.startsWith("/services") ? "text-foreground" : "text-foreground/60"
                  }`}
                >
                  My Services
                </Link>
                <Link
                  href="/orders"
                  className={`transition-colors hover:text-foreground/80 ${
                    pathname?.startsWith("/orders") ? "text-foreground" : "text-foreground/60"
                  }`}
                >
                  Orders
                </Link>
                <Link
                  href="/messages"
                  className={`transition-colors hover:text-foreground/80 ${
                    pathname?.startsWith("/messages") ? "text-foreground" : "text-foreground/60"
                  }`}
                >
                  Messages
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-600" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {loading ? (
              <Button variant="ghost" size="sm" disabled>
                Loading...
              </Button>
            ) : session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                    <img
                      src={session.user?.image || "/placeholder.svg?height=32&width=32"}
                      alt={session.user?.name || "User"}
                      className="h-8 w-8 rounded-full"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href="/profile" className="w-full">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/settings" className="w-full">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handleOpenAuthModal("login")}>
                  Login
                </Button>
                {/* <Button variant="default" size="sm" onClick={() => handleOpenAuthModal("register")}>
                  Sign Up
                </Button> */}
              </div>
            )}
          </nav>
        </div>
      </div>
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} mode={authMode} />
    </header>
  )
}

