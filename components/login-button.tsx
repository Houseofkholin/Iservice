"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/auth-modal"

export function LoginButton() {
  const [showAuthModal, setShowAuthModal] = useState(false)

  return (
    <>
      <Button onClick={() => setShowAuthModal(true)}>Log in</Button>
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  )
}

