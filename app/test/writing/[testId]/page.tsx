"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import {
  ArrowLeft,
  Clock,
  Send,
  Sparkles,
  Eye,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Spinner } from "@/components/ui/spinner"

import { writingSets, type EvaluationResult } from "@/lib/exams/writing/data"
import { WritingEvaluationModal } from "@/components/writing-evaluation-modal"

export default function WritingTestPage() {
  const router = useRouter()
  const { testId } = useParams<{ testId: string }>()

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const test = writingSets.find((t) => t.id === testId)
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(3600)

  const [isEvaluating, setIsEvaluating] = useState(false)
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null)
  const [showEvaluation, setShowEvaluation] = useState(false)

  const [showQuestion, setShowQuestion] = useState(false)

  const currentTask = test?.tasks[currentTaskIndex]

  /* ================= TIMER ================= */
  useEffect(() => {
    const i = setInterval(() => {
      setTimeRemaining((t) => Math.max(t - 1, 0))
    }, 1000)
    return () => clearInterval(i)
  }, [])

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${m.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`
  }

  const wordCount =
    (responses[currentTask?.part || ""] || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length

  /* ================= AI CHECK ================= */
  const handleCheckWithAI = async () => {
    if (!currentTask || wordCount < currentTask.minWords) return

    setIsEvaluating(true)
    try {
      const res = await fetch("/api/evaluate-writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskPart: currentTask.part,
          taskPrompt: `
${currentTask.instruction}

${currentTask.prompt}
`,
          userAnswer: responses[currentTask.part] || "",
        }),
      })

      const result = await res.json()
      setEvaluation(result)
      setShowEvaluation(true)
    } finally {
      setIsEvaluating(false)
    }
  }

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!test) return

    setIsEvaluating(true)
    try {
      const res = await fetch("/api/evaluate-writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testId: test.id,
          cefrLevel: test.cefrLevel,
          tasks: test.tasks.map((t) => ({
            part: t.part,
            instruction: t.instruction,
            prompt: t.prompt,
            minWords: t.minWords,
            maxWords: t.maxWords,
            answer: responses[t.part] || "",
          })),
        }),
      })

      const data = await res.json()
      sessionStorage.setItem(
        `writing-result-${testId}`,
        JSON.stringify(data)
      )

      router.push(`/test/writing/${testId}/result`)
    } finally {
      setIsEvaluating(false)
    }
  }

  if (!test) {
    return (
      <div className="flex h-screen items-center justify-center">
        Test not found
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-white">
      {/* HEADER */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-white px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-orange-600 hover:bg-orange-100"
            onClick={() => router.push("/test/writing")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Exit Test
          </Button>
          <Badge className="bg-orange-100 text-orange-700">CEFR</Badge>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border bg-green-50">
            <Clock className="h-4 w-4" />
            <span className="font-mono text-sm">
              {formatTime(timeRemaining)}
            </span>
          </div>

          <Button
            size="icon"
            variant="outline"
            className="lg:hidden"
            onClick={() => setShowQuestion(true)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* CONTENT */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden lg:block w-1/2 border-r bg-gray-50 p-8">
          <QuestionContent
            test={test}
            currentTask={currentTask}
            setCurrentTaskIndex={setCurrentTaskIndex}
          />
        </aside>

        <section className="flex flex-1 flex-col">
          <div className="border-b px-4 py-2 text-sm">
            Words: {wordCount} / {currentTask?.minWords}
          </div>

          <div className="flex-1 overflow-y-auto p-4 pb-[130px]">
            <Textarea
              ref={textareaRef}
              value={responses[currentTask?.part || ""] || ""}
              onChange={(e) =>
                setResponses({
                  ...responses,
                  [currentTask?.part || ""]: e.target.value,
                })
              }
              className="min-h-[260px] resize-none border-0 text-base leading-7"
            />
          </div>

          <div className="sticky bottom-0 border-t bg-white p-4">
            <div className="flex justify-between gap-3">
              <Button
                variant="outline"
                disabled={currentTaskIndex === 0}
                onClick={() => setCurrentTaskIndex((i) => i - 1)}
              >
                Previous
              </Button>

              <div className="flex gap-3">
                <Button
                  onClick={handleCheckWithAI}
                  disabled={isEvaluating}
                  className="gap-2 bg-orange-600"
                >
                  {isEvaluating ? <Spinner /> : <Sparkles className="h-4 w-4" />}
                  Check with AI
                </Button>

                {currentTaskIndex < test.tasks.length - 1 ? (
                  <Button
                    onClick={() => setCurrentTaskIndex((i) => i + 1)}
                    className="bg-red-600"
                  >
                    Next Task
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    className="gap-2 bg-green-600"
                  >
                    <Send className="h-4 w-4" />
                    Submit All
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* MOBILE QUESTION */}
      {showQuestion && (
        <div className="fixed inset-0 z-40 bg-black/40 lg:hidden">
          <div className="absolute bottom-0 left-0 right-0 bg-white p-5">
            <div className="flex justify-between mb-4">
              <Badge className="bg-orange-600">
                Part {currentTask?.part}
              </Badge>
              <Button size="icon" onClick={() => setShowQuestion(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <QuestionContent
              test={test}
              currentTask={currentTask}
              setCurrentTaskIndex={(i) => {
                setCurrentTaskIndex(i)
                setShowQuestion(false)
              }}
              mobile
            />
          </div>
        </div>
      )}

      <WritingEvaluationModal
        open={showEvaluation}
        onOpenChange={setShowEvaluation}
        evaluation={evaluation}
        taskPart={currentTask?.part || ""}
      />
    </div>
  )
}

/* ================= QUESTION CONTENT ================= */
function QuestionContent({
  test,
  currentTask,
  setCurrentTaskIndex,
}: any) {
  return (
    <>
      <h2 className="mb-4 text-lg font-bold">
        {currentTask?.instruction}
      </h2>

      <Card className="p-5 text-sm">
        <div className="whitespace-pre-wrap">
          {currentTask?.prompt}
        </div>
      </Card>

      <Tabs
        value={currentTask?.part}
        onValueChange={(v) => {
          const i = test.tasks.findIndex((t: any) => t.part === v)
          if (i !== -1) setCurrentTaskIndex(i)
        }}
        className="mt-6"
      >
        <TabsList className="flex w-full overflow-x-auto">
          {test.tasks.map((t: any) => (
            <TabsTrigger key={t.part} value={t.part}>
              Task {t.part}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </>
  )
}
