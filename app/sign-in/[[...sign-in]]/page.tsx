import { SignIn } from "@clerk/nextjs"

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#112938]">Sign In to Baby Bazaar</h1>
          <p className="text-gray-600 mt-2">Welcome back! Please sign in to continue.</p>
        </div>
        <SignIn
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
