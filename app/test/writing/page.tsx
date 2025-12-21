"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Pencil,
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

import { writingSets } from "@/lib/exams/writing/data"

export default function WritingPage() {
  const router = useRouter()

  const [search, setSearch] = useState("")
  const [showUnlock, setShowUnlock] = useState(false)
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null)

  const filteredTests = writingSets.filter((test) =>
    test.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleOpenTest = (id: string, isFree: boolean) => {
    if (isFree) {
      router.push(`/test/writing/${id}`)
    } else {
      setSelectedTestId(id)
      setShowUnlock(true)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-50 to-zinc-100">
      {/* ================= HEADER ================= */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-5 sm:py-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/test")}
            className="
              mb-4
              text-orange-600
              hover:text-orange-800
              hover:bg-orange-100
              transition-colors
            "
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-100 sm:h-12 sm:w-12">
              <Pencil className="h-6 w-6 text-orange-600" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-zinc-900 sm:text-2xl">
                Writing
              </h1>
              <p className="text-sm text-zinc-600">
                CEFR-based Writing Practice
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 pt-6">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-zinc-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search writing tests"
            className="pl-9"
          />
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <h2 className="mb-5 text-lg font-semibold text-zinc-900">
          Available Tests
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
          {filteredTests.map((test) => {
            const isLocked = !test.isFree

            return (
              <Card
                key={test.id}
                onClick={() => handleOpenTest(test.id, test.isFree)}
                className="
                  cursor-pointer
                  border-l-4 border-l-transparent
                  p-5 sm:p-6
                  transition-all
                  hover:border-l-orange-500
                  hover:shadow-md
                "
              >
                {/* LOCK OVERLAY */}
                {isLocked && (
                  <div
                    className="
                      pointer-events-none
                      absolute inset-0 z-10
                      rounded-xl
                      bg-white/60
                      backdrop-blur-[2px]
                      opacity-0
                      transition
                      group-hover:opacity-100
                    "
                  />
                )}

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  {/* TOP */}
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="text-base font-semibold text-zinc-900">
                        {test.title}
                      </h3>

                      {test.isFree ? (
                        <Badge className="bg-emerald-100 text-emerald-700">
                          Free
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Premium</Badge>
                      )}
                    </div>

                    <p className="mb-3 text-sm text-zinc-500">
                      Tasks: {test.tasks.length} • CEFR {test.cefrLevel}
                    </p>

                    <div className="flex gap-4 text-sm text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {test.durationMinutes} min
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        Writing tasks
                      </span>
                    </div>
                  </div>

                  {/* ACTION */}
                  <div className="mt-5">
                    {test.isFree ? (
                      <Button className="w-full bg-orange-600 hover:bg-orange-700">
                        Start Test
                      </Button>
                    ) : (
                      <Button variant="destructive" className="w-full">
                        <Lock className="mr-2 h-4 w-4" />
                        Unlock Test
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {filteredTests.length === 0 && (
          <div className="mt-12 rounded-xl bg-white p-10 text-center text-sm text-zinc-500">
            No writing tests found
          </div>
        )}
      </main>

      {/* ================= UNLOCK MODAL ================= */}
      {selectedTestId && (
        <UnlockModal
          isOpen={showUnlock}
          onClose={() => setShowUnlock(false)}
          testId={selectedTestId}
          testType="writing"
        />
      )}
    </div>
  )
}
