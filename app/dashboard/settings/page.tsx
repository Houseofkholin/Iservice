"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
  const router = useRouter()

  // Redirect to the dashboard with the settings tab active
  useEffect(() => {
    router.push("/dashboard?tab=settings")
  }, [router])

  return null
}

