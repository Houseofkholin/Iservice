"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  MessageSquare,
  Wallet,
  User,
  Settings,
  Bell,
  LogOut,
  Menu,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useWallet } from "@/providers/wallet-provider"
import { useProfile } from "@/lib/hooks/use-data"
import { signOut } from "next-auth/react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { isConnected, address, connect } = useWallet()
  const { profile, isLoading } = useProfile()
  const [activeTab, setActiveTab] = useState("overview")

  // Determine active tab from pathname - only run once when pathname changes
  useEffect(() => {
    const path = pathname.split("/").pop() || "overview"
    setActiveTab(path)
  }, [pathname])

  // Handle tab changes and update URL
  const handleTabChange = (value: string) => {
    if (value === activeTab) return // Prevent unnecessary updates

    if (value === "overview") {
      router.push("/dashboard")
    } else {
      router.push(`/dashboard/${value}`)
    }
  }

  // If not connected, show connect wallet screen
  if (!isConnected) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="w-full max-w-md p-6 border rounded-lg shadow-sm bg-card">
          <h2 className="text-2xl font-bold text-center mb-6">Connect Your Wallet</h2>
          <p className="text-muted-foreground text-center mb-6">
            You need to connect your wallet to access your dashboard
          </p>
          <Button onClick={connect} className="w-full">
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex w-64 flex-col border-r bg-muted/40">
        <div className="flex h-14 items-center border-b px-4">
          <h2 className="font-semibold">Dashboard</h2>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-2 text-sm font-medium">
            <Button
              variant={activeTab === "overview" ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => handleTabChange("overview")}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Overview
            </Button>
            <Button
              variant={activeTab === "services" ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => handleTabChange("services")}
            >
              <Package className="mr-2 h-4 w-4" />
              My Services
            </Button>
            <Button
              variant={activeTab === "bids" ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => handleTabChange("bids")}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              My Bids
            </Button>
            <Button
              variant={activeTab === "contracts" ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => handleTabChange("contracts")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Contracts
            </Button>
            <Button
              variant={activeTab === "messages" ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => handleTabChange("messages")}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </Button>
            <Button
              variant={activeTab === "wallet" ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => handleTabChange("wallet")}
            >
              <Wallet className="mr-2 h-4 w-4" />
              Wallet
            </Button>
            <Button
              variant={activeTab === "profile" ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => handleTabChange("profile")}
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
            <Button
              variant={activeTab === "settings" ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => handleTabChange("settings")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          {/* Mobile Navigation */}
          <div className="md:hidden flex-1 overflow-auto">
            <Tabs value={activeTab} className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="overview" onClick={() => handleTabChange("overview")}>
                  Overview
                </TabsTrigger>
                <TabsTrigger value="services" onClick={() => handleTabChange("services")}>
                  Services
                </TabsTrigger>
                <TabsTrigger value="bids" onClick={() => handleTabChange("bids")}>
                  Bids
                </TabsTrigger>
                <TabsTrigger value="contracts" onClick={() => handleTabChange("contracts")}>
                  Contracts
                </TabsTrigger>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center">
                      More
                      <Menu className="ml-1 h-3 w-3" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <div className="grid gap-2 py-6">
                      <Button
                        variant={activeTab === "messages" ? "secondary" : "ghost"}
                        className="justify-start"
                        onClick={() => handleTabChange("messages")}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Messages
                      </Button>
                      <Button
                        variant={activeTab === "wallet" ? "secondary" : "ghost"}
                        className="justify-start"
                        onClick={() => handleTabChange("wallet")}
                      >
                        <Wallet className="mr-2 h-4 w-4" />
                        Wallet
                      </Button>
                      <Button
                        variant={activeTab === "profile" ? "secondary" : "ghost"}
                        className="justify-start"
                        onClick={() => handleTabChange("profile")}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Button>
                      <Button
                        variant={activeTab === "settings" ? "secondary" : "ghost"}
                        className="justify-start"
                        onClick={() => handleTabChange("settings")}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </TabsList>
            </Tabs>
          </div>

          {/* User Menu */}
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.image} alt={profile?.name || "User"} />
                    <AvatarFallback>{profile?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-sm font-normal">
                    <div className="font-medium">{profile?.name || "User"}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[120px]">
                      {address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : ""}
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleTabChange("profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTabChange("wallet")}>
                  <Wallet className="mr-2 h-4 w-4" />
                  Wallet
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleTabChange("settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}

