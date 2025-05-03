"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, User, Search, Paperclip, MoreHorizontal, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useFormSubmit } from "@/lib/hooks/use-data"

// Mock data for messages
const CONTACTS = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=32&width=32&text=SJ",
    lastMessage: "When can you deliver the final files?",
    timestamp: "10:30 AM",
    unread: 2,
    online: true,
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar: "/placeholder.svg?height=32&width=32&text=MC",
    lastMessage: "The logo looks great! I just have a few minor revisions.",
    timestamp: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: "3",
    name: "Emma Wilson",
    avatar: "/placeholder.svg?height=32&width=32&text=EW",
    lastMessage: "I've approved your proposal. Let's get started!",
    timestamp: "Yesterday",
    unread: 0,
    online: true,
  },
  {
    id: "4",
    name: "David Brown",
    avatar: "/placeholder.svg?height=32&width=32&text=DB",
    lastMessage: "Thanks for completing the project ahead of schedule!",
    timestamp: "Monday",
    unread: 0,
    online: false,
  },
  {
    id: "5",
    name: "Olivia Taylor",
    avatar: "/placeholder.svg?height=32&width=32&text=OT",
    lastMessage: "Can we schedule a call to discuss the requirements?",
    timestamp: "Monday",
    unread: 0,
    online: true,
  },
]

// Mock messages for a conversation
const MESSAGES = [
  {
    id: "1",
    senderId: "1",
    text: "Hi there! I'm interested in your web development services.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: "2",
    senderId: "current-user",
    text: "Hello! Thanks for reaching out. I'd be happy to help with your web development needs. What kind of website are you looking to build?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(), // 23 hours ago
  },
  {
    id: "3",
    senderId: "1",
    text: "I need an e-commerce site for my small business. We sell handmade crafts and currently only have a presence on social media.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(), // 22 hours ago
  },
  {
    id: "4",
    senderId: "current-user",
    text: "That sounds like a great project! I have experience building e-commerce sites with various platforms. Do you have any specific features in mind?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 21).toISOString(), // 21 hours ago
  },
  {
    id: "5",
    senderId: "1",
    text: "We need product listings, shopping cart, secure checkout, and maybe a blog section. Also, it should be mobile-friendly.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "6",
    senderId: "1",
    text: "When can you deliver the final files?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
  },
]

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContact, setSelectedContact] = useState<(typeof CONTACTS)[0] | null>(null)
  const [messages, setMessages] = useState<typeof MESSAGES>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const { submitForm } = useFormSubmit()

  // Filter contacts based on search query
  const filteredContacts = CONTACTS.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Load messages when a contact is selected
  useEffect(() => {
    if (selectedContact) {
      setMessages(MESSAGES)
      // Don't update the contacts array here - this was causing the infinite loop
    }
  }, [selectedContact])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newMessage.trim() || !selectedContact) return

    setIsSending(true)

    try {
      // In a real app, you would send the message to the API
      // await submitForm('/api/messages', {
      //   recipientId: selectedContact.id,
      //   text: newMessage,
      // })

      // For now, we'll just simulate sending a message
      const newMsg = {
        id: `new-${Date.now()}`,
        senderId: "current-user",
        text: newMessage,
        timestamp: new Date().toISOString(),
      }

      // Add the new message to the list
      setMessages((prevMessages) => [...prevMessages, newMsg])

      // Clear the input
      setNewMessage("")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-lg border">
      {/* Contacts Sidebar */}
      <div className="w-full max-w-xs border-r">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search contacts..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          {isLoading ? (
            <div className="space-y-4 p-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-40" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredContacts.length > 0 ? (
            <div>
              {filteredContacts.map((contact) => (
                <div key={contact.id}>
                  <button
                    className={`flex items-center gap-3 w-full p-4 text-left hover:bg-muted transition-colors ${
                      selectedContact?.id === contact.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedContact(contact)}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={contact.avatar} alt={contact.name} />
                        <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {contact.online && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{contact.name}</span>
                        <span className="text-xs text-muted-foreground">{contact.timestamp}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                        {contact.unread > 0 && <Badge className="ml-2">{contact.unread}</Badge>}
                      </div>
                    </div>
                  </button>
                  <Separator />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-muted-foreground">No contacts found</div>
          )}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                  <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{selectedContact.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedContact.online ? "Online" : "Offline"}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => {
                  const isCurrentUser = message.senderId === "current-user"
                  return (
                    <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p>{message.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isCurrentUser ? "text-primary-foreground/80" : "text-muted-foreground"
                          }`}
                        >
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="border-t p-4">
              <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="icon">
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!newMessage.trim() || isSending}>
                  {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <User className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">Your Messages</h3>
            <p className="text-muted-foreground max-w-md">
              Select a contact to view your conversation history or start a new chat.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

