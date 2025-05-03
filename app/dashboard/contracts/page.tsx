"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpDown, Calendar, CheckCircle, FileText, Loader2 } from "lucide-react"

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
import { useUserContracts, useFormSubmit } from "@/lib/hooks/use-data"
import { useToast } from "@/components/ui/use-toast"

export default function ContractsPage() {
  const { contracts, isLoading, mutate } = useUserContracts()
  const { submitForm, isSubmitting } = useFormSubmit()
  const { toast } = useToast()
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [sortField, setSortField] = useState<"date" | "amount" | "dueDate">("date")
  const [contractToComplete, setContractToComplete] = useState<string | null>(null)

  const handleSort = (field: "date" | "amount" | "dueDate") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("desc")
    }
  }

  const sortedContracts = contracts
    ? [...contracts].sort((a, b) => {
        if (sortField === "date") {
          return sortOrder === "asc"
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        } else if (sortField === "dueDate") {
          return sortOrder === "asc"
            ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
        } else {
          return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount
        }
      })
    : []

  const handleCompleteContract = async () => {
    if (!contractToComplete) return

    try {
      await submitForm(`/api/contracts/${contractToComplete}/complete`, {}, { method: "POST" })

      toast({
        title: "Contract completed",
        description: "The contract has been marked as completed",
      })

      // Refresh the contracts list
      mutate()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to complete contract",
        variant: "destructive",
      })
    } finally {
      setContractToComplete(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Contracts</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleSort("date")}>
              Created Date {sortField === "date" && (sortOrder === "asc" ? "↑" : "↓")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("dueDate")}>
              Due Date {sortField === "dueDate" && (sortOrder === "asc" ? "↑" : "↓")}
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
      ) : contracts && contracts.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort("amount")} className="font-semibold">
                    Amount
                    {sortField === "amount" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                  </Button>
                </TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" onClick={() => handleSort("dueDate")} className="font-semibold">
                    Due Date
                    {sortField === "dueDate" && <ArrowUpDown className="ml-2 h-4 w-4" />}
                  </Button>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedContracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell>
                    <div className="font-medium">{contract.serviceTitle}</div>
                    <div className="text-sm text-muted-foreground">Client: {contract.clientName}</div>
                  </TableCell>
                  <TableCell>${contract.amount}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {new Date(contract.dueDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getContractStatusBadgeClass(contract.status)}>
                      {contract.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/contracts/${contract.id}`}>
                          <FileText className="mr-2 h-4 w-4" />
                          Details
                        </Link>
                      </Button>
                      {contract.status === "IN_PROGRESS" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => setContractToComplete(contract.id)}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Complete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Mark Contract as Complete</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to mark this contract as complete? This will release the funds
                                from escrow.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setContractToComplete(null)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleCompleteContract} disabled={isSubmitting}>
                                {isSubmitting ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  "Yes, complete contract"
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
          <h3 className="text-lg font-medium mb-2">No Contracts Yet</h3>
          <p className="text-muted-foreground mb-6">You don't have any active contracts at the moment</p>
          <Button asChild>
            <Link href="/marketplace">Find Services</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

function getContractStatusBadgeClass(status: string) {
  switch (status) {
    case "IN_PROGRESS":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900"
    case "COMPLETED":
      return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900"
    default:
      return ""
  }
}

