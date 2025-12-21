"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Headphones,
  ArrowLeft,
  Clock,
  FileText,
  Lock,
  Search,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { UnlockModal } from "@/components/unlock-modal"

import { listeningTests } from "@/lib/exams/listening/data"

export default function ListeningPage() {
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState("")
  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null)

  const filteredTests = listeningTests.filter((test) =>
    test.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleTestClick = (testId: string, isFree: boolean) => {
    if (isFree) {
      router.push(`/test/listening/${testId}`)
    } else {
      setSelectedTestId(testId)
      setShowUnlockModal(true)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= HEADER ================= */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-5 sm:py-6">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 text-purple-600 hover:text-purple-800 hover:bg-purple-100"
            onClick={() => router.push("/test")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-purple-100">
              <Headphones className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Listening
              </h1>
              <p className="text-sm text-gray-600">
                CEFR-based Listening Practice
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 pt-6">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-zinc-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search listening tests"
            className="pl-9"
          />
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        {/* TITLE + SEARCH */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Choose a test
          </h2> 
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
          {filteredTests.length === 0 && (
            <div className="col-span-full rounded-lg border bg-white p-8 text-center text-sm text-gray-500">
              No tests found
            </div>
          )}

          {filteredTests.map((test) => (
            <Card
              key={test.id}
              onClick={() => handleTestClick(test.id, test.isFree)}
              className="
                cursor-pointer
                border-l-4 border-l-transparent
                p-5 sm:p-6
                transition-all
                hover:border-l-purple-500
                hover:shadow-md
              "
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                {/* LEFT */}
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {test.title}
                    </h3>

                    {test.isFree ? (
                      <Badge className="bg-green-100 text-green-700">
                        Free
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700">
                        Premium
                      </Badge>
                    )}
                  </div>

                  <div className="mb-3 text-sm text-gray-600">
                    • {test.level}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {test.duration} min
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {test.totalQuestions} questions
                    </div>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="mt-5">
                  {test.isFree ? (
                    <Button className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700">
                      Start Practice
                    </Button>
                  ) : (
                    <Button className="w-full sm:w-auto bg-red-600 hover:bg-red-700">
                      <Lock className="mr-2 h-4 w-4" />
                      Unlock Test
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <UnlockModal
        open={showUnlockModal}
        onClose={setShowUnlockModal}
        testId={selectedTestId ?? ""}
        testType="listening"
      />
    </div>
  )
}
