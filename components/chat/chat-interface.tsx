"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Paperclip, Image, Smile, MoreVertical, Phone, Video } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

import { useNotifications } from "@/providers/notification-provider"

interface Message {
  id: string
  senderId: string
  content: string
  timestamp: string
  attachments?: { type: string; url: string }[]
  status: "sent" | "delivered" | "read"
}

interface ChatInterfaceProps {
  recipientId: string
  conversationId?: string
  serviceId?: string
  initialMessages?: Message[]
}

export function ChatInterface({ recipientId, conversationId, serviceId, initialMessages = [] }: ChatInterfaceProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const { addNotification } = useNotifications()

  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [recipient, setRecipient] = useState<any>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [attachments, setAttachments] = useState<File[]>([])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Simulate fetching messages and recipient data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, you would fetch messages from an API
        // For now, we'll use mock data

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock recipient data
        const mockRecipient = {
          id: recipientId,
          name: "Jane Smith",
          avatar: "/placeholder.svg?height=40&width=40",
          online: true,
          lastSeen: new Date().toISOString(),
        }

        // Mock messages if none provided
        let mockMessages = initialMessages
        if (mockMessages.length === 0) {
          mockMessages = [
            {
              id: "1",
              senderId: recipientId,
              content: "Hi there! I'm interested in your service.",
              timestamp: new Date(Date.now() - 3600000).toISOString(),
              status: "read",
            },
            {
              id: "2",
              senderId: session?.user?.id || "current-user",
              content: "Hello! Thanks for reaching out. How can I help you?",
              timestamp: new Date(Date.now() - 3000000).toISOString(),
              status: "read",
            },
            {
              id: "3",
              senderId: recipientId,
              content: "I have a few questions about your service. Do you offer custom solutions?",
              timestamp: new Date(Date.now() - 2400000).toISOString(),
              status: "read",
            },
          ]
        }

        setRecipient(mockRecipient)
        setMessages(mockMessages)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching chat data:", error)
        toast({
          title: "Error",
          description: "Failed to load chat. Please try again.",
          variant: "destructive",
        })
      }
    }

    fetchData()

    // Clean up function
    return () => {
      // Any cleanup if needed
    }
  }, [recipientId, conversationId, initialMessages, session, toast])

  // Add a separate useEffect for the simulated message
  useEffect(() => {
    // Only set up the timer if we have loaded the data and have a recipient
    if (isLoading || !recipient) return

    // Simulate receiving a message after 5 seconds
    const timer = setTimeout(() => {
      const newMsg = {
        id: `msg-${Date.now()}`,
        senderId: recipientId,
        content: "By the way, what's your timeline for this project?",
        timestamp: new Date().toISOString(),
        status: "delivered",
      }

      setMessages((prev) => [...prev, newMsg])

      // Show notification
      addNotification({
        title: "New message",
        description: `${recipient.name}: ${newMsg.content}`,
        type: "message",
        link: `/dashboard/messages/${conversationId || "new"}`,
      })
    }, 5000)

    return () => clearTimeout(timer)
  }, [isLoading, recipient, recipientId, conversationId, addNotification])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!newMessage.trim() && attachments.length === 0) return

    try {
      // Create new message object
      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        senderId: session?.user?.id || "current-user",
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        status: "sent",
      }

      // If there are attachments, add them to the message
      if (attachments.length > 0) {
        newMsg.attachments = attachments.map((file) => ({
          type: file.type.startsWith("image/") ? "image" : "file",
          url: URL.createObjectURL(file),
        }))
      }

      // Add message to state immediately for UI responsiveness
      setMessages((prev) => [...prev, newMsg])

      // Clear input and attachments
      setNewMessage("")
      setAttachments([])

      // In a real app, send message to server
      // await sendMessageToServer(conversationId, recipientId, newMessage, attachments)

      // Simulate server response
      setTimeout(() => {
        setMessages((prev) => prev.map((msg) => (msg.id === newMsg.id ? { ...msg, status: "delivered" } : msg)))
      }, 1000)

      // Simulate recipient reading the message
      setTimeout(() => {
        setMessages((prev) => prev.map((msg) => (msg.id === newMsg.id ? { ...msg, status: "read" } : msg)))

        // Simulate typing indicator
        setIsTyping(true)
        setTimeout(() => setIsTyping(false), 3000)

        // Simulate reply after typing
        setTimeout(() => {
          const replyMsg = {
            id: `msg-${Date.now()}`,
            senderId: recipientId,
            content: "Thanks for the information! I'll get back to you soon.",
            timestamp: new Date().toISOString(),
            status: "delivered",
          }

          setMessages((prev) => [...prev, replyMsg])
        }, 4000)
      }, 2000)
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files)
      setAttachments((prev) => [...prev, ...fileList])
    }
  }

  // Handle removing an attachment
  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  // Format timestamp
  const formatMessageTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  }

  // Determine if a message is from the current user
  const isCurrentUser = (senderId: string) => {
    return senderId === session?.user?.id || senderId === "current-user"
  }

  // Render message status indicator
  const renderMessageStatus = (status: string) => {
    switch (status) {
      case "sent":
        return <span className="text-xs text-muted-foreground">Sent</span>
      case "delivered":
        return <span className="text-xs text-muted-foreground">Delivered</span>
      case "read":
        return <span className="text-xs text-blue-500">Read</span>
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] border rounded-lg overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b">
        {isLoading ? (
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={recipient?.avatar} alt={recipient?.name} />
              <AvatarFallback>{recipient?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{recipient?.name}</h3>
              <p className="text-xs text-muted-foreground">
                {recipient?.online ? (
                  <span className="flex items-center">
                    <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                    Online
                  </span>
                ) : (
                  `Last seen ${formatMessageTime(recipient?.lastSeen)}`
                )}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Call</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Video className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Video Call</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Profile</DropdownMenuItem>
              <DropdownMenuItem>Search in Conversation</DropdownMenuItem>
              <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Block User</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : ""}`}>
                <div className={`max-w-[80%] ${i % 2 === 0 ? "bg-primary/10" : "bg-muted"} rounded-lg p-3`}>
                  <Skeleton className="h-4 w-48 mb-1" />
                  <Skeleton className="h-4 w-32" />
                  <div className="flex justify-end mt-1">
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${isCurrentUser(message.senderId) ? "justify-end" : ""}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    isCurrentUser(message.senderId) ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p>{message.content}</p>

                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment, index) => (
                        <div key={index}>
                          {attachment.type === "image" ? (
                            <img
                              src={attachment.url || "/placeholder.svg"}
                              alt="Attachment"
                              className="max-w-full rounded-md max-h-48 object-contain"
                            />
                          ) : (
                            <div className="flex items-center p-2 bg-background rounded-md">
                              <Paperclip className="h-4 w-4 mr-2" />
                              <span className="text-sm truncate">Attachment</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div
                    className={`flex justify-end mt-1 text-xs ${
                      isCurrentUser(message.senderId) ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    <span>{formatMessageTime(message.timestamp)}</span>
                    {isCurrentUser(message.senderId) && (
                      <span className="ml-2">{renderMessageStatus(message.status)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex">
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"></div>
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce delay-75"></div>
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="p-2 border-t flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div key={index} className="relative group">
              {file.type.startsWith("image/") ? (
                <div className="h-16 w-16 rounded-md overflow-hidden">
                  <img
                    src={URL.createObjectURL(file) || "/placeholder.svg"}
                    alt={file.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center">
                  <Paperclip className="h-6 w-6" />
                </div>
              )}
              <button
                className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveAttachment(index)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
            <Paperclip className="h-5 w-5" />
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} multiple />
          </Button>

          <Button variant="ghost" size="icon" disabled={isLoading}>
            <Image className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" disabled={isLoading}>
            <Smile className="h-5 w-5" />
          </Button>

          <Input
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            disabled={isLoading}
            className="flex-1"
          />

          <Button onClick={handleSendMessage} disabled={isLoading || (!newMessage.trim() && attachments.length === 0)}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}

