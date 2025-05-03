"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpDown, Eye, MessageSquare, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useUserBids, useFormSubmit } from "@/lib/hooks/use-data"
import { useToast } from "@/components/ui/use-toast"

export default function BidsPage() {
  const { bids, isLoading, mutate } = useUserBids()
  const { submitForm, isSubmitting } = useFormSubmit()
  const { toast } = useToast()
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [sortField, setSortField] = useState<"date" | "amount">("date")
  const [bidToCancel, setBidToCancel] = useState<string | null>(null)

  const handleSort = (field: "date" | "amount") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("desc")
    }
  }

  const sortedBids = bids
    ? [...bids].sort((a, b) => {
        if (sortField === "date") {
          return sortOrder === "asc"
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        } else {
          return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount
        }
      })
    : []

  const handleCancelBid = async () => {
    if (!bidToCancel) return

    try {
      await submitForm(`/api/bids/${bidToCancel}/cancel`, {}, { method: "POST" })

      toast({
        title: "Bid cancelled",
        description: "Your bid has been successfully cancelled",
      })

      // Refresh the bids list
      mutate()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel bid",
        variant: "destructive",
      })
    } finally {
      setBidToCancel(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Bids</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleSort("date")}>
              Date {sortField === "date" && (sortOrder === "asc" ? "↑" : "↓")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("amount")}>
              Amount {sortField === "amount" && (sortOrder === "asc" ? "↑" : "↓")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-md">
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-9 w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : bids && bids.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort("amount")} className="font-semibold">
                    Bid Amount
                    {sortField === "amount" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort("date")} className="font-semibold">
                    Date
                    {sortField === "date" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedBids.map((bid) => (
                <TableRow key={bid.id}>
                  <TableCell>
                    <div className="font-medium">{bid.serviceTitle}</div>
                    <div className="text-sm text-muted-foreground">by {bid.clientName}</div>
                  </TableCell>
                  <TableCell>${bid.amount}</TableCell>
                  <TableCell>{new Date(bid.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getBidStatusBadgeClass(bid.status)}>
                      {bid.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/services/${bid.serviceId}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                      {bid.status === "ACCEPTED" && (
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Contact
                        </Button>
                      )}
                      {bid.status === "PENDING" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => setBidToCancel(bid.id)}
                            >
                              Cancel
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancel Bid</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to cancel this bid? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setBidToCancel(null)}>No, keep bid</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleCancelBid}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Cancelling...
                                  </>
                                ) : (
                                  "Yes, cancel bid"
                                )}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-12 border rounded-md">
          <h3 className="text-lg font-medium mb-2">No Bids Yet</h3>
          <p className="text-muted-foreground mb-6">Start bidding on services to grow your business</p>
          <Button asChild>
            <Link href="/marketplace">Browse Marketplace</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

function getBidStatusBadgeClass(status: string) {
  switch (status) {
    case "ACCEPTED":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900"
    case "PENDING":
      return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900"
    case "REJECTED":
      return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900"
    default:
      return ""
  }
}

