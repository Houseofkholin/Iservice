"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Search, Plus } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

interface Conversation {
  id: string
  recipientId: string
  recipientName: string
  recipientAvatar: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  online: boolean
}

export function ConversationList() {
  const router = useRouter()
  const pathname = usePathname()

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch conversations
  useEffect(() => {
    let isMounted = true

    const fetchConversations = async () => {
      try {
        // In a real app, fetch from API
        // For now, use mock data
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const mockConversations: Conversation[] = [
          {
            id: "conv1",
            recipientId: "user1",
            recipientName: "Jane Smith",
            recipientAvatar: "/placeholder.svg?height=40&width=40",
            lastMessage: "Thanks for the information! I'll get back to you soon.",
            timestamp: new Date(Date.now() - 300000).toISOString(),
            unreadCount: 2,
            online: true,
          },
          {
            id: "conv2",
            recipientId: "user2",
            recipientName: "John Doe",
            recipientAvatar: "/placeholder.svg?height=40&width=40",
            lastMessage: "When can we schedule a call to discuss the project?",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            unreadCount: 0,
            online: false,
          },
          {
            id: "conv3",
            recipientId: "user3",
            recipientName: "Alice Johnson",
            recipientAvatar: "/placeholder.svg?height=40&width=40",
            lastMessage: "I've sent you the files you requested.",
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            unreadCount: 0,
            online: true,
          },
          {
            id: "conv4",
            recipientId: "user4",
            recipientName: "Robert Brown",
            recipientAvatar: "/placeholder.svg?height=40&width=40",
            lastMessage: "The project is coming along nicely. I'll have an update for you tomorrow.",
            timestamp: new Date(Date.now() - 172800000).toISOString(),
            unreadCount: 0,
            online: false,
          },
        ]

        if (isMounted) {
          setConversations(mockConversations)
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error fetching conversations:", error)
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchConversations()

    return () => {
      isMounted = false
    }
  }, []) // Empty dependency array since this should only run once on mount

  // Filter conversations based on search query
  const filteredConversations = useMemo(
    () =>
      conversations.filter((conversation) =>
        conversation.recipientName.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [conversations, searchQuery],
  )

  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()

    // If today, show time
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    // If this week, show day name
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: "short" })
    }

    // Otherwise show date
    return date.toLocaleDateString([], { month: "short", day: "numeric" })
  }

  // Handle conversation click
  const handleConversationClick = (conversationId: string) => {
    router.push(`/dashboard/messages/${conversationId}`)

    // Mark as read in a real app
    setConversations((prev) => prev.map((conv) => (conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv)))
  }

  // Check if conversation is active
  const isConversationActive = (conversationId: string) => {
    return pathname === `/dashboard/messages/${conversationId}`
  }

  return (
    <div className="h-full flex flex-col border rounded-lg overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="font-semibold mb-4">Messages</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <Skeleton className="h-3 w-8" />
              </div>
            ))}
          </div>
        ) : filteredConversations.length > 0 ? (
          <div className="p-1">
            {filteredConversations.map((conversation) => (
              <button
                key={conversation.id}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  isConversationActive(conversation.id) ? "bg-muted" : "hover:bg-muted/50"
                }`}
                onClick={() => handleConversationClick(conversation.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={conversation.recipientAvatar} alt={conversation.recipientName} />
                      <AvatarFallback>{conversation.recipientName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {conversation.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium truncate">{conversation.recipientName}</h3>
                      <span className="text-xs text-muted-foreground">{formatTimestamp(conversation.timestamp)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                      {conversation.unreadCount > 0 && (
                        <Badge
                          variant="default"
                          className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                        >
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground">
            {searchQuery ? "No conversations found" : "No conversations yet"}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t">
        <Button className="w-full" asChild>
          <a href="/dashboard/messages/new">
            <Plus className="mr-2 h-4 w-4" />
            New Message
          </a>
        </Button>
      </div>
    </div>
  )
}

