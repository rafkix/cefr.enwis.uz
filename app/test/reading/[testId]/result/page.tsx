"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  calculateReadingResult,
  type ReadingResult,
} from "@/lib/calculate-reading-score"
import { READING_TESTS } from "@/lib/reading-tests-data"
import { Button } from "@/components/ui/button"
<<<<<<< HEAD
import { Card } from "@/components/ui/card"
import {
  ArrowLeft,
  BookOpen,
  RotateCcw,
  Home,
  BarChart3,
} from "lucide-react"
import { Footer } from "@/components/footer"

/* ================= PAGE ================= */

=======
import { ArrowLeft, BookOpen } from "lucide-react"
import { Footer } from "@/components/footer"

>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
export default function ReadingResultPage() {
  const router = useRouter()
  const { testId } = useParams<{ testId: string }>()

  const test = READING_TESTS.find((t) => t.id === testId) ?? null

  const [result, setResult] = useState<ReadingResult | null>(null)
  const [activeId, setActiveId] = useState<number | null>(null)

  useEffect(() => {
    if (!test) {
      router.replace("/test/reading")
      return
    }

    const saved = localStorage.getItem(`reading-${testId}-answers`)
    if (!saved) {
      router.replace("/test/reading")
      return
    }

    const answers = JSON.parse(saved)
    const calculated = calculateReadingResult(test.examData, answers)
    setResult(calculated)
  }, [test, testId, router])

  if (!result) {
    return (
      <div className="flex h-screen items-center justify-center text-zinc-400">
        Calculating result…
      </div>
    )
  }

  const activeQuestion = result.detailed.find(
    (q) => q.questionId === activeId
  )

<<<<<<< HEAD
  /* ================= HELPERS ================= */

  const getLevel = (p: number) => {
    if (p >= 85) return { label: "C1", color: "text-green-600", bg: "bg-green-50" }
    if (p >= 70) return { label: "B2", color: "text-orange-600", bg: "bg-orange-50" }
    if (p >= 50) return { label: "B1", color: "text-blue-600", bg: "bg-blue-50" }
    return { label: "A2", color: "text-red-600", bg: "bg-red-50" }
  }

  const level = getLevel(result.percent)

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ===== HEADER ===== */}
        <Card className="overflow-hidden shadow-xl">
          <div className="bg-emerald-600 p-8 text-center text-white">
            <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-80" />
            <h1 className="text-3xl font-extrabold">Reading Test Result</h1>
            <p className="opacity-90 mt-1">CEFR Reading Assessment</p>
          </div>

          <div className="p-8 bg-white grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-4 rounded-xl bg-slate-50">
              <p className="text-xs font-bold text-slate-400 uppercase mb-1">
                Score
              </p>
              <p className="text-3xl font-black text-slate-800">
                {result.correct}/{result.total}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50">
              <p className="text-xs font-bold text-emerald-400 uppercase mb-1">
                Percent
              </p>
              <p className="text-3xl font-black text-emerald-600">
                {result.percent}%
              </p>
            </div>

            <div className={`p-4 rounded-xl ${level.bg}`}>
              <p className="text-xs font-bold uppercase mb-1">
                CEFR Level
              </p>
              <p className={`text-2xl font-extrabold ${level.color}`}>
                {level.label}
              </p>
            </div>
          </div>
        </Card>

        {/* ===== QUESTION MAP ===== */}
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">
            Question Review
          </h2>

          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
=======
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      {/* ================= HEADER ================= */}
      <header className="border-b bg-white sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
          <Button
            variant="ghost"
            size="sm"
            className="mb-3 text-gray-600 hover:text-gray-900"
            onClick={() => router.push("/test/reading")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100">
              <BookOpen className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Reading Result
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                CEFR Reading Assessment
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 p-4 sm:p-6">
        {/* ================= SUMMARY ================= */}
        <aside className="rounded-2xl bg-white p-5 sm:p-6 shadow-sm border">
          <h2 className="text-xs uppercase tracking-widest text-zinc-400">
            Summary
          </h2>

          <div className="mt-5 text-center">
            <div className="text-4xl sm:text-5xl font-bold text-green-600">
              {result.percent}%
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              Overall accuracy
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-zinc-500">Scaled score</p>
            <p className="text-xl font-semibold text-zinc-900">
              {result.scaledScore} / 75
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-sm text-zinc-500">CEFR Level</p>
            <p className="text-xl font-bold text-emerald-600">
              {result.cefrLevel}
            </p>
          </div>

          <div className="mt-6">
            <div className="h-2 rounded-full bg-zinc-200 overflow-hidden">
              <div
                className="h-full bg-green-600 transition-all"
                style={{ width: `${result.percent}%` }}
              />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 text-center text-xs text-zinc-500">
            <div>
              <p className="text-lg font-semibold text-zinc-900">
                {result.correct}
              </p>
              Correct
            </div>
            <div>
              <p className="text-lg font-semibold text-zinc-900">
                {result.wrong}
              </p>
              Wrong
            </div>
            <div>
              <p className="text-lg font-semibold text-zinc-900">
                {result.total}
              </p>
              Total
            </div>
          </div>
        </aside>

        {/* ================= QUESTION MAP ================= */}
        <section className="lg:col-span-2 rounded-2xl bg-white p-5 sm:p-6 shadow-sm border">
          <h2 className="text-xs uppercase tracking-widest text-zinc-400 mb-4">
            Question Map
          </h2>

          {/* GRID — BARQAROR */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 gap-3">
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
            {result.detailed.map((q, i) => {
              const isActive = activeId === q.questionId

              return (
                <button
                  key={q.questionId}
                  onClick={() =>
                    setActiveId(isActive ? null : q.questionId)
                  }
<<<<<<< HEAD
                  className={`h-10 w-10 rounded-lg font-bold text-sm transition-all
                    ${
                      q.isCorrect
                        ? "bg-green-100 text-green-600 hover:bg-green-200"
                        : "bg-red-100 text-red-600 hover:bg-red-200"
                    }
                    ${
                      isActive
                        ? "ring-2 ring-indigo-500 scale-110"
                        : "hover:scale-105"
=======
                  className={`
                    h-11 w-11 sm:h-12 sm:w-12
                    rounded-xl
                    text-sm font-semibold
                    border
                    flex items-center justify-center
                    transition-colors transition-shadow
                    ${
                      q.isCorrect
                        ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                        : "bg-rose-50 border-rose-300 text-rose-700"
                    }
                    ${
                      isActive
                        ? "outline outline-2 outline-indigo-500 shadow-md"
                        : "hover:shadow-sm"
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
                    }
                  `}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>

<<<<<<< HEAD
          {/* ===== DETAIL PANEL ===== */}
          {activeQuestion && (
            <div className="mt-6 rounded-xl border bg-slate-50 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900">
                  Question {activeQuestion.questionId}
                </h3>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    activeQuestion.isCorrect
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
=======
          {/* ================= DETAIL PANEL ================= */}
          {activeQuestion && (
            <div className="mt-6 rounded-xl border bg-zinc-50 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-zinc-900">
                  Question {activeQuestion.questionId}
                </h3>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    activeQuestion.isCorrect
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
                  }`}
                >
                  {activeQuestion.isCorrect ? "Correct" : "Wrong"}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <p>
<<<<<<< HEAD
                  <span className="text-slate-500">
                    Your answer:
                  </span>
                  <span className="ml-2 font-medium text-slate-900">
=======
                  <span className="text-zinc-500">
                    Your answer:
                  </span>
                  <span className="ml-2 font-medium text-zinc-900">
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
                    {activeQuestion.userAnswer || "—"}
                  </span>
                </p>

                {!activeQuestion.isCorrect && (
                  <p>
<<<<<<< HEAD
                    <span className="text-slate-500">
                      Correct answer:
                    </span>
                    <span className="ml-2 font-medium text-green-600">
=======
                    <span className="text-zinc-500">
                      Correct answer:
                    </span>
                    <span className="ml-2 font-medium text-emerald-600">
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
                      {activeQuestion.correctAnswer}
                    </span>
                  </p>
                )}

                {activeQuestion.explanation && (
<<<<<<< HEAD
                  <p className="text-slate-500 mt-2">
=======
                  <p className="text-zinc-500 mt-2">
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
                    {activeQuestion.explanation}
                  </p>
                )}
              </div>
            </div>
          )}
<<<<<<< HEAD
        </Card>

        {/* ===== ACTIONS ===== */}
        <div className="flex gap-4">
          <Button
            onClick={() => router.push(`/test/reading/${testId}`)}
            className="flex-1 bg-emerald-600 "
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Retry Test
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/test")}
            className="flex-1"
          >
            <Home className="mr-2 h-4 w-4" />
            Go to Test
          </Button>
        </div>
      </div>
=======
        </section>
      </main>

      <Footer />
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
    </div>
  )
}
