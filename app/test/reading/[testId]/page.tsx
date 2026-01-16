"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import ExamHeader from "@/components/exam/exam-header"
import ExamContent from "@/components/exam/exam-content"
import ExamSidebar from "@/components/exam/exam-sidebar"
import { READING_TESTS } from "@/lib/reading-tests-data"
import { isTestUnlocked } from "@/lib/test-access"

export default function ExamPage() {
    const params = useParams()
    const testId = params?.testId as string
    const router = useRouter()

    const test = READING_TESTS.find((t) => String(t.id) === String(testId))

    const [timeLeft, setTimeLeft] = useState(0)
    const [currentQuestion, setCurrentQuestion] = useState(1)
    const [answers, setAnswers] = useState<Record<number, string>>({})
    const [answered, setAnswered] = useState<Record<number, boolean>>({})
    const [fontSize, setFontSize] = useState(18) // Boshlang'ich shrift 18px

    useEffect(() => {
        if (test) {
            setTimeLeft(test.durationMinutes * 60)
        }
    }, [test])

    useEffect(() => {
        if (!testId || !test) return
        if (!isTestUnlocked(test.id, test.isFree)) {
            router.push("/test/reading")
        }
    }, [test, testId, router])

    useEffect(() => {
        if (!test) return
        const interval = setInterval(() => {
            setTimeLeft((t) => (t > 0 ? t - 1 : 0))
        }, 1000)
        return () => clearInterval(interval)
    }, [test])

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60)
        const sec = s % 60
        return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
    }

    const handleAnswer = (qId: number, value: string) => {
        setAnswers((prev) => ({ ...prev, [qId]: value }))
        setAnswered((prev) => ({ ...prev, [qId]: !!value.trim() }))
    }

    const handleFinish = () => {
        if (confirm("Imtihonni yakunlamoqchimisiz?")) {
            localStorage.setItem(`reading-${testId}-answers`, JSON.stringify(answers))
            router.push(`/test/reading/${testId}/result`)
        }
    }

    if (!test) return <div className="p-10 text-center font-bold">Yuklanmoqda...</div>

    return (
        <div className="flex h-screen flex-col bg-white overflow-hidden">
            <ExamHeader />
            <div className="flex flex-1 overflow-hidden flex-row">
                {/* MATN VA SAVOLLAR QISMI */}
                <main className="flex-1 overflow-hidden">
                    <ExamContent
                        examData={test.examData}
                        currentQuestion={currentQuestion}
                        answered={answered}
                        onAnswer={(value) => handleAnswer(currentQuestion, value)}
                        onSelectQuestion={setCurrentQuestion}
                        fontSize={fontSize} // Content-ga uzatildi
                    />
                </main>

                {/* SIDEBAR QISMI */}
                <ExamSidebar
                    currentQuestion={currentQuestion}
                    totalQuestions={test.examData.parts.reduce((acc, part) => acc + part.questions.length, 0)}
                    answered={answered}
                    timeLeft={formatTime(timeLeft)}
                    onSelectQuestion={setCurrentQuestion}
                    onFinish={handleFinish}
                    fontSize={fontSize} // Sidebar-ga uzatildi (ko'rsatish uchun)
                    onIncreaseFontSize={() => setFontSize(s => Math.min(s + 2, 30))}
                    onDecreaseFontSize={() => setFontSize(s => Math.max(s - 2, 12))}
                />
            </div>
        </div>
    )
}