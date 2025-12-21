"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
<<<<<<< HEAD
import {
  BookOpen,
  ArrowLeft,
  Clock,
  FileText,
  Lock,
  Search,
} from "lucide-react"
=======
import { BookOpen, ArrowLeft, Clock, FileText, Lock } from "lucide-react"
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
<<<<<<< HEAD
import { Input } from "@/components/ui/input"
=======
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
import { UnlockModal } from "@/components/unlock-modal"

import { READING_TESTS } from "@/lib/reading-tests-data"
import { isTestUnlocked, unlockTest } from "@/lib/test-access"

export default function ReadingPage() {
  const router = useRouter()
<<<<<<< HEAD

  const [search, setSearch] = useState("")
=======
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
  const [unlockedTests, setUnlockedTests] = useState<string[]>([])
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null)
  const [showUnlockModal, setShowUnlockModal] = useState(false)

  useEffect(() => {
    const unlocked = READING_TESTS.filter((t) =>
      isTestUnlocked(t.id, t.isFree)
    ).map((t) => t.id)
<<<<<<< HEAD

=======
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
    setUnlockedTests(unlocked)
  }, [])

  const handleTestClick = (testId: string) => {
    const test = READING_TESTS.find((t) => t.id === testId)
    if (!test) return

    const isUnlocked = test.isFree || unlockedTests.includes(testId)

    if (isUnlocked) {
      router.push(`/test/reading/${testId}`)
    } else {
      setSelectedTestId(testId)
      setShowUnlockModal(true)
    }
  }

  const handleUnlock = (code: string) => {
    const test = READING_TESTS.find((t) => t.id === selectedTestId)
    if (!test) return

    if (code.toUpperCase() === test.accessCode?.toUpperCase()) {
      unlockTest(test.id)
      setUnlockedTests((prev) => [...prev, test.id])
      setShowUnlockModal(false)
      router.push(`/test/reading/${test.id}`)
    } else {
      alert("Invalid access code")
    }
  }

<<<<<<< HEAD
  const filteredTests = READING_TESTS.filter((test) => {
    const q = search.toLowerCase()
    return (
      test.title.toLowerCase().includes(q) ||
      test.level.toLowerCase().includes(q)
    )
  })

=======
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
  const selectedTest = READING_TESTS.find((t) => t.id === selectedTestId)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= HEADER ================= */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-5 sm:py-6">
          <Button
            variant="ghost"
            size="sm"
<<<<<<< HEAD
            className="
              mb-4
              text-green-600
              hover:text-green-800
              hover:bg-green-100
              transition-colors
            "
=======
            className="mb-4 text-gray-600 hover:text-gray-900"
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
            onClick={() => router.push("/test")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-3">
<<<<<<< HEAD
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-green-100">
=======
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-blue-100">
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
              <BookOpen className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Reading
              </h1>
              <p className="text-sm text-gray-600">
                CEFR-based Reading Practice
              </p>
            </div>
          </div>
        </div>
      </header>

<<<<<<< HEAD
      {/* ================= SEARCH ================= */}
      <section className="container mx-auto px-4 pt-6">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reading tests"
            className="pl-9"
          />
        </div>
      </section>

=======
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
      {/* ================= CONTENT ================= */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <h2 className="mb-5 text-lg font-semibold text-gray-900">
          Choose a test
        </h2>

<<<<<<< HEAD
        {/* 📱 Mobile: 1 col | 📱 Tablet: 2 col | 🖥 Desktop: 1 col (Writing bilan bir xil) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
          {filteredTests.map((test) => {
            const isUnlocked =
              test.isFree || unlockedTests.includes(test.id)
=======
        {/* 📱 Mobile: 1 col | 📱 iPad landscape: 2 col | 🖥 Desktop: 1 col */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
          {READING_TESTS.map((test) => {
            const isUnlocked = test.isFree || unlockedTests.includes(test.id)
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee

            return (
              <Card
                key={test.id}
                onClick={() => handleTestClick(test.id)}
                className="
                  cursor-pointer
                  border-l-4 border-l-transparent
                  p-5 sm:p-6
                  transition-all
                  hover:border-l-green-500
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

                      {test.isFree && (
                        <Badge className="bg-green-100 text-green-700">
                          Free
                        </Badge>
                      )}

                      {!isUnlocked && (
<<<<<<< HEAD
                        <Badge className="bg-red-100 text-red-700">
=======
                        <Badge className="bg-orange-100 text-orange-700">
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
                          Premium
                        </Badge>
                      )}
                    </div>

                    <div className="mb-3 text-sm text-gray-600">
<<<<<<< HEAD
                      Cefr/Multilevel • {test.cefrLevel}
=======
                      {test.level}
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{test.durationMinutes} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
<<<<<<< HEAD
                        <span>{test.totalQuestions} questions</span>
=======
                        <span>{test.questionCount} questions</span>
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
<<<<<<< HEAD
                  <div className="mt-5">
=======
                  <div className="w-full sm:w-auto">
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
                    {isUnlocked ? (
                      <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                        Start Practice
                      </Button>
                    ) : (
                      <Button className="w-full sm:w-auto bg-red-600 hover:bg-red-700">
                        <Lock className="mr-2 h-4 w-4" />
<<<<<<< HEAD
                        Unlock Test
=======
                        Premium
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
<<<<<<< HEAD

        {filteredTests.length === 0 && (
          <div className="mt-12 rounded-xl bg-white p-10 text-center text-sm text-gray-500">
            No reading tests found
          </div>
        )}
      </main>

      {/* ================= UNLOCK MODAL ================= */}
=======
      </main>

>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
      {selectedTest && (
        <UnlockModal
          open={showUnlockModal}
          onOpenChange={setShowUnlockModal}
          onUnlock={handleUnlock}
          testTitle={selectedTest.title}
        />
      )}
    </div>
  )
}
