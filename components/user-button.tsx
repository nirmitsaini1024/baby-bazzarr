"use client"

import { UserButton as ClerkUserButton, SignInButton, useAuth } from "@clerk/nextjs"
import { User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UserButton() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    return (
      <ClerkUserButton
        appearance={{
          elements: {
            userButtonAvatarBox: "h-5 w-5",
          },
        }}
      />
    )
  }

  return (
    <SignInButton>
      <Button variant="ghost" size="sm" className="text-white">
        <User className="h-5 w-5" />
      </Button>
    </SignInButton>
  )
}
