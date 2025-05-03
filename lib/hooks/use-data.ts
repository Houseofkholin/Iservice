"use client"

import useSWR from "swr"
import { useState } from "react"

// Generic fetcher function
const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.")
    error.message = await res.text()
    throw error
  }
  return res.json()
}

// Hook for fetching services
export function useServices(filters = {}) {
  const queryString = new URLSearchParams(filters as Record<string, string>).toString()
  const { data, error, isLoading, mutate } = useSWR(`/api/services${queryString ? `?${queryString}` : ""}`, fetcher)

  return {
    services: data?.services || [],
    isLoading,
    isError: error,
    mutate,
  }
}

// Hook for fetching a single service
export function useService(id: string) {
  const { data, error, isLoading, mutate } = useSWR(id ? `/api/services/${id}` : null, fetcher)

  return {
    service: data?.service,
    isLoading,
    isError: error,
    mutate,
  }
}

// Hook for fetching user profile
export function useProfile(userId?: string) {
  const { data, error, isLoading, mutate } = useSWR(userId ? `/api/users/${userId}` : "/api/users/me", fetcher)

  return {
    profile: data?.user,
    isLoading,
    isError: error,
    mutate,
  }
}

// Hook for fetching user's services
export function useUserServices() {
  const { data, error, isLoading, mutate } = useSWR("/api/users/me/services", fetcher)

  return {
    services: data?.services || [],
    isLoading,
    isError: error,
    mutate,
  }
}

// Hook for fetching user's bids
export function useUserBids() {
  const { data, error, isLoading, mutate } = useSWR("/api/users/me/bids", fetcher)

  return {
    bids: data?.bids || [],
    isLoading,
    isError: error,
    mutate,
  }
}

// Hook for fetching user's contracts
export function useUserContracts() {
  const { data, error, isLoading, mutate } = useSWR("/api/users/me/contracts", fetcher)

  return {
    contracts: data?.contracts || [],
    isLoading,
    isError: error,
    mutate,
  }
}

// Hook for fetching wallet transactions
export function useWalletTransactions() {
  const { data, error, isLoading, mutate } = useSWR("/api/users/me/transactions", fetcher)

  return {
    transactions: data?.transactions || [],
    isLoading,
    isError: error,
    mutate,
  }
}

// Hook for form submission with loading state
export function useFormSubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const submitForm = async (url: string, data: any, options = {}) => {
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        ...options,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Something went wrong")
      }

      setSuccess(true)
      return await response.json()
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    submitForm,
    isSubmitting,
    error,
    success,
    setError,
    setSuccess,
  }
}

