"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  RotateCcw,
  Home,
  FileText,
  BarChart3,
} from "lucide-react"

/* ================= TYPES ================= */

interface CriterionScore {
  score: number
  comment: string
}

interface WritingTaskResult {
  part: string
  wordCount: number
  band: number
  cefr: string
  criteria: {
    content: CriterionScore
    coherence: CriterionScore
    grammar: CriterionScore
    vocabulary: CriterionScore
  }
  strengths: string[]
  weaknesses: string[]
  corrections: {
    original: string
    corrected: string
    type: string
  }[]
  summary: string
  correctedText: string
}

interface WritingResultData {
  overallBand: number
  cefrLevel: string
  tasks: WritingTaskResult[]
}

/* ================= PAGE ================= */

export default function WritingResultPage() {
  const { testId } = useParams<{ testId: string }>()
  const router = useRouter()

  const [data, setData] = useState<WritingResultData | null>(null)

  /* ================= LOAD RESULT ================= */

  useEffect(() => {
    const raw = sessionStorage.getItem(`writing-result-${testId}`)
    if (!raw) {
      router.replace("/test/writing")
      return
    }

    try {
      const parsed = JSON.parse(raw)
      // Map backend key to frontend
      setData({
        overallBand: parsed.overallBand,
        cefrLevel: parsed.overallCEFR,
        tasks: parsed.tasks,
      })
    } catch {
      router.replace("/test/writing")
    }
  }, [testId, router])

  if (!data) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-400">
        Loading result…
      </div>
    )
  }

  const tasks = Array.isArray(data.tasks) ? data.tasks : []

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ================= HEADER ================= */}
        <Card className="overflow-hidden shadow-xl">
          <div className="bg-orange-600 p-8 text-center text-white">
            <BarChart3 className="h-12 w-12 mx-auto mb-3" />
            <h1 className="text-3xl font-extrabold">
              Writing Test – Full AI Report
            </h1>
            <p className="opacity-90 mt-1">
              CEFR-aligned Writing Assessment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-white text-center">
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-xs font-bold uppercase text-slate-400">
                Overall Band
              </p>
              <p className="text-3xl font-black">
                {data.overallBand.toFixed(1)}
              </p>
            </div>

            <div className="bg-emerald-50 rounded-xl p-4">
              <p className="text-xs font-bold uppercase">
                CEFR Level
              </p>
              <p className="text-2xl font-extrabold text-emerald-600">
                {data.cefrLevel}
              </p>
            </div>

            <div className="bg-orange-50 rounded-xl p-4">
              <p className="text-xs font-bold uppercase text-orange-400">
                Tasks
              </p>
              <p className="text-3xl font-black text-orange-600">
                {tasks.length}
              </p>
            </div>
          </div>
        </Card>

        {/* ================= TASKS ================= */}
        {tasks.map((task) => (
          <Card key={task.part} className="p-6 space-y-8">

            {/* HEADER */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-orange-600" />
                <h2 className="text-xl font-bold">
                  Task {task.part}
                </h2>
              </div>

              <Badge className="bg-orange-100 text-orange-700">
                Band {task.band} · {task.cefr}
              </Badge>
            </div>

            {/* USER TEXT */}
            <div>
              <h3 className="font-semibold mb-2">Your Writing</h3>
              <div className="whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm border">
                {task.correctedText || "—"}
              </div>
              <p className="text-xs mt-1 text-gray-500">
                Word count: {task.wordCount}
              </p>
            </div>

            {/* CRITERIA */}
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(task.criteria || {}).map(([key, c]) => (
                <div key={key} className="p-4 rounded-xl bg-white border">
                  <div className="flex justify-between mb-1">
                    <span className="capitalize font-medium">
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <strong>{c.score}</strong>
                  </div>
                  <p className="text-sm text-gray-600">
                    {c.comment}
                  </p>
                </div>
              ))}
            </div>

            {/* STRENGTHS & WEAKNESSES */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-emerald-700 mb-2">
                  Strengths
                </h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {(task.strengths || []).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-rose-700 mb-2">
                  Weaknesses
                </h3>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {(task.weaknesses || []).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CORRECTIONS */}
            {task.corrections && task.corrections.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <h4 className="font-semibold text-red-700 mb-2">
                  Corrections
                </h4>
                <ul className="text-sm space-y-2">
                  {task.corrections.map((c, i) => (
                    <li key={i}>
                      ❌ <strong>{c.original}</strong> → ✅ {c.corrected} <em>({c.type})</em>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* SUMMARY */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-900 mb-1">
                Examiner Summary
              </h4>
              <p className="text-sm text-blue-800">
                {task.summary}
              </p>
            </div>
          </Card>
        ))}

        {/* ACTIONS */}
        <div className="flex gap-4">
          <Button
            className="flex-1 bg-orange-600"
            onClick={() => router.push(`/test/writing/${testId}`)}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Retry Writing
          </Button>

          <Button
            variant="outline"
            className="flex-1"
            onClick={() => router.push("/test")}
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Tests
          </Button>
        </div>

      </div>
    </div>
  )
}
