"use client"
import { SignUp } from "@clerk/nextjs"
import { useUser } from "@clerk/clerk-react"
import { useEffect } from "react"

export default function SignUpPage() {
  const { user } = useUser()

  useEffect(() => {
    const createUserInDatabase = async () => {
      if (user) {
        try {
          const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.id,
              firstName: user.firstName,
              email: user.emailAddresses[0].emailAddress,
            }),
          })

          if (!response.ok) {
            console.error('Failed to create user in database')
          }
        } catch (error) {
          console.error('Error creating user in database:', error)
        }
      }
    }

    createUserInDatabase()
  }, [user])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#112938]">Create an Account</h1>
          <p className="text-gray-600 mt-2">Join Baby Bazaar to start shopping for your little one.</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-md rounded-lg border border-gray-200",
              headerTitle: "text-[#112938] text-xl",
              headerSubtitle: "text-gray-500",
              formButtonPrimary: "bg-[#0CC0DF] hover:bg-[#0CC0DF]/90",
            },
          }}
        />
      </div>
    </div>
  )
}
