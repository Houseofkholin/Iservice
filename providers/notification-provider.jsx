"use client"

import { createContext, useContext, useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

// Create context
const NotificationContext = createContext({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  addNotification: () => {},
  clearAll: () => {},
})

// Mock notifications
const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    title: "New message",
    description: "You have a new message from Jane Smith",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
  },
  {
    id: "2",
    title: "Service completed",
    description: "Your logo design service has been marked as completed",
    read: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "3",
    title: "Payment received",
    description: "You received a payment of $250 for your design service",
    read: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
]

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const { toast } = useToast()

  // Calculate unread count
  const unreadCount = notifications.filter((notification) => !notification.read).length

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  // Add a new notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      read: false,
      date: new Date().toISOString(),
      ...notification,
    }

    setNotifications((prev) => [newNotification, ...prev])

    // Show toast for new notification
    toast({
      title: notification.title,
      description: notification.description,
      action: (
        <Button variant="outline" size="sm" onClick={() => markAsRead(newNotification.id)}>
          Mark as read
        </Button>
      ),
    })
  }

  // Clear all notifications
  const clearAll = () => {
    setNotifications([])
  }

  // Context value
  const value = {
    notifications,
    unreadCount,
    markAsRead,
    addNotification,
    clearAll,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

// Custom hook to use the notification context
export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

