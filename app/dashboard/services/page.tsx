"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Star, Edit, Eye, Trash, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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
import { useUserServices, useFormSubmit } from "@/lib/hooks/use-data"
import { useToast } from "@/components/ui/use-toast"

export default function ServicesPage() {
  const { services, isLoading, mutate } = useUserServices()
  const { submitForm, isSubmitting } = useFormSubmit()
  const { toast } = useToast()
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null)

  const handleDeleteService = async () => {
    if (!serviceToDelete) return

    try {
      await submitForm(`/api/services/${serviceToDelete}`, {}, { method: "DELETE" })

      toast({
        title: "Service deleted",
        description: "Your service has been successfully deleted",
      })

      // Refresh the services list
      mutate()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete service",
        variant: "destructive",
      })
    } finally {
      setServiceToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Services</h1>
        <Button asChild>
          <Link href="/services/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Service
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="aspect-video w-full" />
              <CardHeader className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                  <Skeleton className="h-6 w-full" />
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter className="p-4 flex justify-between">
                <Skeleton className="h-9 w-20" />
                <Skeleton className="h-9 w-20" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : services && services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="overflow-hidden">
              <div className="aspect-video w-full overflow-hidden bg-muted">
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <CardHeader className="p-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge>{service.category}</Badge>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 dark:fill-yellow-500 dark:text-yellow-500" />
                      <span className="ml-1 text-sm font-medium">{service.rating}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold">{service.title}</h3>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <span className="text-muted-foreground mr-1">Delivery:</span>
                    <span>{service.deliveryTime}</span>
                  </div>
                  <div className="font-bold">${service.price}</div>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <div>Bids: {service.bids || 0}</div>
                  <Badge
                    variant="outline"
                    className={
                      service.status === "ACTIVE"
                        ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900"
                        : ""
                    }
                  >
                    {service.status}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="p-4 flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/services/${service.id}`}>
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Link>
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/services/${service.id}/edit`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setServiceToDelete(service.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your service and remove it from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setServiceToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteService}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            "Delete"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardFooter>
            </Card>
          ))}

          <Link href="/services/create">
            <Card className="overflow-hidden h-full border-dashed hover:border-primary transition-colors">
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="rounded-full bg-primary/10 p-3 mb-4">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Create New Service</h3>
                <p className="text-sm text-muted-foreground">List your skills and start earning</p>
              </div>
            </Card>
          </Link>
        </div>
      ) : (
        <Card className="p-6 text-center">
          <h3 className="font-semibold mb-2">No Services Yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Start earning by creating your first service listing</p>
          <Button asChild>
            <Link href="/services/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Service
            </Link>
          </Button>
        </Card>
      )}
    </div>
  )
}

