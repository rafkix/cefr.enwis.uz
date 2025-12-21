"use client"

import { useRouter } from "next/navigation"
import { Mic, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SpeakingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 text-gray-600 hover:text-gray-900"
            onClick={() => router.push("/test")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-600">
              <Mic className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Speaking</h1>
              <p className="text-sm text-gray-600">Coming soon</p>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-gray-600">Speaking tests will be available soon.</p>
        </div>
      </main>
    </div>
  )
}
