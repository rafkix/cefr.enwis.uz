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

    // State-lar
    const [timeLeft, setTimeLeft] = useState(0)
    const [currentQuestion, setCurrentQuestion] = useState(1)
    const [answers, setAnswers] = useState<Record<number, string>>({})
    const [answered, setAnswered] = useState<Record<number, boolean>>({})
    const [fontSize, setFontSize] = useState(18)
    const [isFinishModalOpen, setIsFinishModalOpen] = useState(false) // Modal uchun

    // Test ma'lumotlarini yuklash
    useEffect(() => {
        if (test) {
            setTimeLeft(test.durationMinutes * 60)
        }
    }, [test])

    // Kirish huquqini tekshirish
    useEffect(() => {
        if (!testId || !test) return
        if (!isTestUnlocked(test.id, test.isFree)) {
            router.push("/test/reading")
        }
    }, [test, testId, router])

    // Taymer logikasi
    useEffect(() => {
        if (!test) return
        const interval = setInterval(() => {
            setTimeLeft((t) => (t > 0 ? t - 1 : 0))
        }, 1000)
        return () => clearInterval(interval)
    }, [test])

    // Statistika hisoblash
    const totalQuestions = test?.examData.parts.reduce((acc, part) => acc + part.questions.length, 0) || 0
    const answeredCount = Object.values(answered).filter(v => v === true).length
    const skippedCount = totalQuestions - answeredCount

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60)
        const sec = s % 60
        return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
    }

    const handleAnswer = (qId: number, value: string) => {
        setAnswers((prev) => ({ ...prev, [qId]: value }))
        setAnswered((prev) => ({ ...prev, [qId]: !!value.trim() }))
    }

    // Modalni ochish
    const handleFinishAttempt = () => {
        setIsFinishModalOpen(true)
    }

    // Haqiqiy yakunlash va natijaga yo'naltirish
    const confirmFinish = () => {
        localStorage.setItem(`reading-${testId}-answers`, JSON.stringify(answers))
        router.push(`/test/reading/${testId}/result`)
    }

    if (!test) return <div className="p-10 text-center font-bold">Yuklanmoqda...</div>

    return (
        <div className="flex h-screen flex-col bg-white overflow-hidden relative">
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
                        fontSize={fontSize}
                    />
                </main>

                {/* SIDEBAR QISMI */}
                <ExamSidebar
                    currentQuestion={currentQuestion}
                    totalQuestions={totalQuestions}
                    answered={answered}
                    timeLeft={formatTime(timeLeft)}
                    onSelectQuestion={setCurrentQuestion}
                    onFinish={handleFinishAttempt} // Modalni ochish funksiyasi
                    fontSize={fontSize}
                    onIncreaseFontSize={() => setFontSize(s => Math.min(s + 2, 30))}
                    onDecreaseFontSize={() => setFontSize(s => Math.max(s - 2, 12))}
                />
            </div>

            {/* YAKUNLASH TASDIQLASH MODALI */}
            {isFinishModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Imtihonni yakunlaysizmi?</h2>
                            <p className="text-gray-500 mb-6">Natijalarni tekshirishdan oldin holatni ko'zdan kechiring:</p>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Javob berildi</p>
                                    <p className="text-2xl font-bold text-green-600">{answeredCount}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Qolib ketgan</p>
                                    <p className="text-2xl font-bold text-red-500">{skippedCount}</p>
                                </div>
                            </div>

                            {skippedCount > 0 && (
                                <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-sm">
                                    Diqqat! Sizda hali belgilanmagan savollar bor.
                                </div>
                            )}

                            <div className="flex flex-col gap-3">
                                <button 
                                    onClick={confirmFinish}
                                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all transform active:scale-95 shadow-lg shadow-blue-200"
                                >
                                    Ha, yakunlash
                                </button>
                                <button 
                                    onClick={() => setIsFinishModalOpen(false)}
                                    className="w-full py-3 bg-white text-gray-600 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                                >
                                    Yo'q, davom ettirish
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}