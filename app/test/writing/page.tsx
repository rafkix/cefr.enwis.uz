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
<<<<<<< HEAD
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
=======
import { writingSets } from "@/lib/writing-data"
import { UnlockModal } from "@/components/unlock-modal"

export default function WritingPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [showUnlock, setShowUnlock] = useState(false)
  const [selectedTestId, setSelectedTestId] = useState("")

  const filtered = writingSets.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  )

  const openTest = (id: string, isFree: boolean) => {
    if (isFree) router.push(`/test/writing/${id}`)
    else {
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
      setSelectedTestId(id)
      setShowUnlock(true)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-50 to-zinc-100">
      {/* ================= HEADER ================= */}
      <header className="border-b bg-white">
<<<<<<< HEAD
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
=======
        <div className="container mx-auto px-6 py-6">
          <Button
            variant="ghost"
            size="sm"
            className="mb-4 text-zinc-600 hover:text-zinc-900"
            onClick={() => router.push("/test")}
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-3">
<<<<<<< HEAD
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-100 sm:h-12 sm:w-12">
              <Pencil className="h-6 w-6 text-orange-600" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-zinc-900 sm:text-2xl">
                Writing
              </h1>
              <p className="text-sm text-zinc-600">
                CEFR-based Writing Practice
=======
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
              <Pencil className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900">
                Writing Result
              </h1>
              <p className="text-sm text-zinc-600">
                CEFR Writing Assessment
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
              </p>
            </div>
          </div>
        </div>
      </header>
<<<<<<< HEAD

      <section className="container mx-auto px-4 pt-6">
=======
      {/* ================= SEARCH ================= */}
      <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
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

<<<<<<< HEAD
      {/* ================= CONTENT ================= */}
      <main className="container mx-auto px-4 py-6 sm:py-8">
        <h2 className="mb-5 text-lg font-semibold text-zinc-900">
          Available Tests
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
          {filteredTests.map((test) => {
            const isLocked = !test.isFree
=======
      {/* ================= LIST ================= */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400">
          Available Tests
        </h2>

        <div className="grid gap-5 sm:grid-cols-2">
          {filtered.map((test) => {
            const locked = !test.isFree
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee

            return (
              <Card
                key={test.id}
<<<<<<< HEAD
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
=======
                onClick={() => openTest(test.id, test.isFree)}
                className={`
                  group relative cursor-pointer overflow-hidden
                  border transition-all
                  hover:-translate-y-1 hover:shadow-lg
                `}
              >
                {/* LOCK OVERLAY */}
                {locked && (
                  <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-[2px] opacity-0 transition group-hover:opacity-100" />
                )}

                <div className="relative z-20 flex h-full flex-col justify-between p-5">
                  {/* TOP */}
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-zinc-900">
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
                        {test.title}
                      </h3>

                      {test.isFree ? (
                        <Badge className="bg-emerald-100 text-emerald-700">
                          Free
                        </Badge>
                      ) : (
<<<<<<< HEAD
                        <Badge variant="destructive">Premium</Badge>
=======
                        <Badge className="bg-red-100 text-red-700">
                          Premium
                        </Badge>
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
                      )}
                    </div>

                    <p className="mb-3 text-sm text-zinc-500">
                      Tasks: {test.tasks.length} • CEFR {test.cefrLevel}
                    </p>

<<<<<<< HEAD
                    <div className="flex gap-4 text-sm text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {test.durationMinutes} min
=======
                    <div className="flex gap-4 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {test.duration} min
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
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
<<<<<<< HEAD
                      <Button variant="destructive" className="w-full">
=======
                      <Button className="w-full bg-red-600 text-white hover:bg-red-700">
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
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

<<<<<<< HEAD
        {filteredTests.length === 0 && (
=======
        {filtered.length === 0 && (
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
          <div className="mt-12 rounded-xl bg-white p-10 text-center text-sm text-zinc-500">
            No writing tests found
          </div>
        )}
      </main>

<<<<<<< HEAD
      {/* ================= UNLOCK MODAL ================= */}
      {selectedTestId && (
        <UnlockModal
          isOpen={showUnlock}
          onClose={() => setShowUnlock(false)}
          testId={selectedTestId}
          testType="writing"
        />
      )}
=======
      <UnlockModal
        isOpen={showUnlock}
        onClose={() => setShowUnlock(false)}
        testId={selectedTestId}
        testType="writing"
      />
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
    </div>
  )
}
