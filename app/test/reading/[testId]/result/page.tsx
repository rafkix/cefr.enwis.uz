"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  calculateReadingResult,
  type ReadingResult,
} from "@/lib/calculate-reading-score"
import { READING_TESTS } from "@/lib/reading-tests-data"
import { Button } from "@/components/ui/button"
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
            {result.detailed.map((q, i) => {
              const isActive = activeId === q.questionId

              return (
                <button
                  key={q.questionId}
                  onClick={() =>
                    setActiveId(isActive ? null : q.questionId)
                  }
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
                    }
                  `}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>

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
                  }`}
                >
                  {activeQuestion.isCorrect ? "Correct" : "Wrong"}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-slate-500">
                    Your answer:
                  </span>
                  <span className="ml-2 font-medium text-slate-900">
                    {activeQuestion.userAnswer || "—"}
                  </span>
                </p>

                {!activeQuestion.isCorrect && (
                  <p>
                    <span className="text-slate-500">
                      Correct answer:
                    </span>
                    <span className="ml-2 font-medium text-green-600">
                      {activeQuestion.correctAnswer}
                    </span>
                  </p>
                )}

                {activeQuestion.explanation && (
                  <p className="text-slate-500 mt-2">
                    {activeQuestion.explanation}
                  </p>
                )}
              </div>
            </div>
          )}
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
    </div>
  )
}
