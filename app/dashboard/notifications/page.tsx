"use client"

import type React from "react"

import { useState } from "react"
import { Bell, Plus, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNotifications, type NotificationType } from "@/providers/notification-provider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    formatNotificationDate,
  } = useNotifications()

  const [newNotification, setNewNotification] = useState({
    title: "",
    description: "",
    type: "system" as NotificationType,
    link: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewNotification((prev) => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (value: string) => {
    setNewNotification((prev) => ({ ...prev, type: value as NotificationType }))
  }

  const handleAddNotification = () => {
    if (!newNotification.title || !newNotification.description) return

    addNotification({
      title: newNotification.title,
      description: newNotification.description,
      type: newNotification.type,
      link: newNotification.link || undefined,
    })

    // Reset form
    setNewNotification({
      title: "",
      description: "",
      type: "system",
      link: "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Manage your notifications and preferences</p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
          <Button
            variant="destructive"
            disabled={notifications.length === 0}
            onClick={() => {
              notifications.forEach((n) => removeNotification(n.id))
            }}
          >
            <Trash className="mr-2 h-4 w-4" />
            Clear all
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Notification List */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>All Notifications</CardTitle>
              <CardDescription>
                You have {notifications.length} notifications, {unreadCount} unread
              </CardDescription>
            </CardHeader>
            <CardContent>
              {notifications.length > 0 ? (
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border rounded-lg ${notification.read ? "" : "bg-muted/20 border-primary/50"}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{notification.title}</h3>
                              {!notification.read && (
                                <Badge variant="default" className="text-xs">
                                  New
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <span>{formatNotificationDate(notification.date)}</span>
                              <span className="mx-2">•</span>
                              <Badge variant="outline" className="text-xs capitalize">
                                {notification.type}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                                Mark as read
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-muted-foreground hover:text-destructive"
                              onClick={() => removeNotification(notification.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No notifications</h3>
                  <p className="text-sm text-muted-foreground mt-1">You don't have any notifications at the moment</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add Notification (for testing) */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Test Notifications</CardTitle>
              <CardDescription>Create a test notification to see how it works</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={newNotification.title}
                    onChange={handleInputChange}
                    placeholder="Notification title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newNotification.description}
                    onChange={handleInputChange}
                    placeholder="Notification description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select value={newNotification.type} onValueChange={handleTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select notification type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bid">Bid</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="message">Message</SelectItem>
                      <SelectItem value="payment">Payment</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link">Link (optional)</Label>
                  <Input
                    id="link"
                    name="link"
                    value={newNotification.link}
                    onChange={handleInputChange}
                    placeholder="/dashboard/messages"
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={handleAddNotification}
                  disabled={!newNotification.title || !newNotification.description}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Test Notification
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

