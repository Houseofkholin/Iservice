"use client"

import { useParams } from "next/navigation"
import { ChatInterface } from "@/components/chat/chat-interface"

export default function ConversationPage() {
  const params = useParams()
  const conversationId = params.conversationId as string

  // In a real app, you would fetch the recipient ID based on the conversation ID
  // For now, we'll use a mock recipient ID
  const recipientId = "user1"

  return (
    <div className="h-full">
      <ChatInterface recipientId={recipientId} conversationId={conversationId === "new" ? undefined : conversationId} />
    </div>
  )
}

