"use client"

import { useState } from "react"
import { useRouter, useSearchParams, useParams } from "next/navigation"
import {
    RotateCcw,
    Home,
    BarChart3,
    X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

/* ================= TYPES ================= */

type DetailedResult = {
    questionNumber: number
    question?: string
    userAnswer: string | null
    correctAnswer: string
    isCorrect: boolean
}

/* ================= PAGE ================= */

export default function ListeningResultPage() {
    const router = useRouter()
    const params = useParams()
    const searchParams = useSearchParams()

    const testId = params.testId as string

    const correct = Number(searchParams.get("correct") || 0)
    const total = Number(searchParams.get("total") || 0)

    const detailed: DetailedResult[] = JSON.parse(
        searchParams.get("detailed") || "[]"
    )

    const percent = total ? Math.round((correct / total) * 100) : 0

    const [selected, setSelected] = useState<DetailedResult | null>(null)

    /* ================= HELPERS ================= */

    const getLevel = (p: number) => {
        if (p >= 85) return { label: "C1", color: "text-blue-600", bg: "bg-blue-50" }
        if (p >= 70) return { label: "B2", color: "text-orange-600", bg: "bg-orange-50" }
        if (p >= 50) return { label: "B1", color: "text-blue-600", bg: "bg-blue-50" }
        return { label: "A2", color: "text-red-600", bg: "bg-red-50" }
    }

    const level = getLevel(percent)

    /* ================= RENDER ================= */

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* ===== HEADER ===== */}
                <Card className="overflow-hidden shadow-xl">
                    <div className="bg-purple-600 p-8 text-center text-white">
                        <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-80" />
                        <h1 className="text-3xl font-extrabold">Listening Test Result</h1>
                        <p className="opacity-90 mt-1">Test ID: {testId}</p>
                    </div>

                    <div className="p-8 bg-white grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div className="p-4 rounded-xl bg-slate-50">
                            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Score</p>
                            <p className="text-3xl font-black text-slate-800">
                                {correct}/{total}
                            </p>
                        </div>

                        <div className="p-4 rounded-xl bg-purple-50">
                            <p className="text-xs font-bold text-purple-400 uppercase mb-1">Percent</p>
                            <p className="text-3xl font-black text-purple-600">{percent}%</p>
                        </div>

                        <div className={`p-4 rounded-xl ${level.bg}`}>
                            <p className="text-xs font-bold uppercase mb-1">CEFR Level</p>
                            <p className={`text-2xl font-extrabold ${level.color}`}>
                                {level.label}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* ===== QUESTION GRID ===== */}
                <Card className="p-6">
                    <h2 className="text-lg font-bold mb-4">Question Review</h2>

                    <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
                        {detailed.map((q) => (
                            <button
                                key={q.questionNumber}
                                onClick={() => setSelected(q)}
                                className={`h-10 w-10 rounded-lg font-bold text-sm transition-all
                  ${q.isCorrect
                                        ? "bg-purple-100 text-purple-600 hover:bg-purple-300"
                                        : "bg-red-100 text-red-600 hover:bg-red-200"
                                    }
                  hover:scale-105`}
                                title="Click to view answer"
                            >
                                {q.questionNumber}
                            </button>
                        ))}
                    </div>
                </Card>

                {/* ===== ACTIONS ===== */}
                <div className="flex gap-4">
                    <Button
                        onClick={() => router.push(`/test/listening/${testId}`)}
                        className="flex-1 bg-purple-600"
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

            {/* ===== MODAL ===== */}
            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">

                        <button
                            onClick={() => setSelected(null)}
                            className="absolute top-3 right-3 text-slate-400 hover:text-slate-700"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h3 className="text-lg font-bold mb-3">
                            Question {selected.questionNumber}
                        </h3>

                        {selected.question && (
                            <p className="text-slate-700 mb-4">
                                {selected.question}
                            </p>
                        )}

                        <div className="space-y-2 text-sm">
                            <p>
                                <span className="font-semibold">Your answer:</span>{" "}
                                <span className={selected.isCorrect ? "text-purple-600" : "text-red-600"}>
                                    {selected.userAnswer || "—"}
                                </span>
                            </p>

                            <p>
                                <span className="font-semibold">Correct answer:</span>{" "}
                                <span className="text-purple-600 font-bold">
                                    {selected.correctAnswer}
                                </span>
                            </p>
                        </div>

                        {!selected.isCorrect && (
                            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-orange-700">
                                ⚠️ Review this question carefully
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
