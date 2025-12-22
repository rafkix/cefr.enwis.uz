"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import ExamHeader from "@/components/exam-header"
import ExamContent from "@/components/exam-content"
import ExamFooter from "@/components/exam-footer"
import { READING_TESTS } from "@/lib/reading-tests-data"
import { isTestUnlocked } from "@/lib/test-access"

export default function ExamPage() {
  const { testId } = useParams<{ testId: string }>()
  const router = useRouter()

  const test = READING_TESTS.find((t) => t.id === testId)

  const [timeLeft, setTimeLeft] = useState(
    test ? test.durationMinutes * 60 : 0
  )
  const [currentQuestion, setCurrentQuestion] = useState(1)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [answered, setAnswered] = useState<Record<number, boolean>>({})
  const [flagged, setFlagged] = useState<Record<number, boolean>>({})

  // 🔒 Access check
  useEffect(() => {
    if (!test) {
      router.push("/test")
      return
    }

    if (!isTestUnlocked(test.id, test.isFree)) {
      router.push("/test/reading")
    }
  }, [test, router])

  // ⏱ Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const totalQuestions =
    test?.examData.parts.reduce(
      (sum, part) => sum + part.questions.length,
      0
    ) ?? 0

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
  }

  // ✅ Answer save (MUHIM)
  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: value,
    }))

    setAnswered((prev) => ({
      ...prev,
      [currentQuestion]: true,
    }))
  }

  // ✅ Finish exam
  const handleFinish = () => {
    localStorage.setItem(
      `reading-${testId}-answers`,
      JSON.stringify(answers)
    )
    router.push(`/test/reading/${testId}/result`)
  }

  if (!test) return null

  return (
    <div className="flex h-screen flex-col bg-white">
      <ExamHeader/>

      <div className="flex flex-1 overflow-hidden">
        <ExamContent
          examData={test.examData}
          currentQuestion={currentQuestion}
          answered={answered}
          onAnswer={handleAnswer}
          onSelectQuestion={setCurrentQuestion}
        />
      </div>

      <ExamFooter
        currentQuestion={currentQuestion}
        totalQuestions={totalQuestions}
        answered={answered}
        flagged={flagged}
        onSelectQuestion={setCurrentQuestion}
        onFinish={handleFinish}
      />
    </div>
  )
}
