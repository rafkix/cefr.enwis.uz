"use client"

import { useEffect, useState } from "react"
import QuestionRenderer from "@/components/question-renderer"
import HighlightText from "@/components/highlight-text"
import type { ExamSet } from "@/lib/exam-data"

interface Highlight {
  id: string
  start: number
  end: number
  text: string
  color: string
}

type QuestionType =
  | "TRUE_FALSE_NOT_GIVEN"
  | "MULTIPLE_CHOICE"
  | "SENTENCE_COMPLETION"
  | "SHORT_ANSWER"
  | "MATCHING"
  | "GAP_FILL"
  | "TEXT_MATCH"
  | "HEADINGS_MATCH"

interface Question {
  id: number
  type: QuestionType
  text: string
  options?: string[]
  headings?: string[]
  completionText?: string
  word_limit?: number
}

export default function ExamContent({
  examData,
  currentQuestion,
  answered,
  onAnswer,
  onSelectQuestion,
  highlightColor = "bg-yellow-200",
}: {
  examData: ExamSet
  currentQuestion: number
  answered: Record<number, boolean>
  onAnswer: (value: string) => void
  onSelectQuestion: (questionNum: number) => void
  highlightColor?: string
}) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>(
    {},
  )
  const [highlights, setHighlights] = useState<Highlight[]>([])
  const [showPassage, setShowPassage] = useState(false)

  // 🔥 MOBILE KEYBOARD OFFSET
  const [keyboardOffset, setKeyboardOffset] = useState(0)

  useEffect(() => {
    if (typeof window === "undefined") return

    const updateKeyboard = () => {
      if (window.visualViewport) {
        const diff =
          window.innerHeight - window.visualViewport.height
        setKeyboardOffset(diff > 0 ? diff : 0)
      }
    }

    window.visualViewport?.addEventListener("resize", updateKeyboard)
    window.visualViewport?.addEventListener("scroll", updateKeyboard)

    return () => {
      window.visualViewport?.removeEventListener("resize", updateKeyboard)
      window.visualViewport?.removeEventListener("scroll", updateKeyboard)
    }
  }, [])

  let currentQ: Question | null = null
  let currentPart: any = null

  for (const part of examData.parts) {
    const q = part.questions.find((q: Question) => q.id === currentQuestion)
    if (q) {
      currentQ = q
      currentPart = part
      break
    }
  }

  if (!currentQ || !currentPart) {
    return <div>Question not found</div>
  }

  const handleSelectAnswer = (value: string) => {
    setSelectedAnswers((p) => ({ ...p, [currentQuestion]: value }))
    onAnswer(value)
  }

  const handleInputChange = (value: string) => {
    setSelectedAnswers((p) => ({ ...p, [currentQuestion]: value }))
    onAnswer(value)
  }

  const handleAddHighlight = (start: number, end: number, color: string) => {
    const text = currentPart.passage.substring(start, end)
    setHighlights((p) => [
      ...p,
      { id: `${currentQuestion}-${Date.now()}`, start, end, text, color },
    ])
  }

  const relatedQuestions = currentPart.questions.filter(
    (q: Question) =>
      q.type === currentQ.type &&
      q.id >= Math.floor(currentQ.id / 10) * 10,
  )

  const startQNum = Math.floor(currentQuestion / 10) * 10 || currentQuestion
  const endQNum = Math.min(
    startQNum + 9,
    currentPart.questions[currentPart.questions.length - 1].id,
  )

  return (
    <>
      {/* ================= MOBILE ================= */}
      <div className="lg:hidden flex flex-col h-full">
        <button
          onClick={() => setShowPassage((p) => !p)}
          className="sticky top-0 z-10 bg-white border-b py-3 text-sm font-semibold"
        >
          {showPassage ? "Hide Reading Passage" : "Show Reading Passage"}
        </button>

        {showPassage && (
          <div className="p-4 max-h-[45vh] overflow-y-auto border-b">
            <HighlightText
              text={currentPart.passage}
              highlights={highlights}
              onAddHighlight={handleAddHighlight}
              highlightColor={highlightColor}
            />
          </div>
        )}

        <div
          className="flex-1 overflow-y-auto p-4 transition-[padding] duration-200"
          style={{ paddingBottom: keyboardOffset + 16 }}
        >
          {relatedQuestions.map((question: Question) => (
            <div
              key={question.id}
              onClick={() => onSelectQuestion(question.id)}
              className={`mb-4 rounded-lg p-4 cursor-pointer ${
                currentQuestion === question.id
                  ? "bg-blue-50 border-l-4 border-blue-600"
                  : "bg-gray-50"
              }`}
            >
              <div className="flex gap-3">
                <span className="h-6 w-6 rounded-full bg-gray-300 text-xs font-bold flex items-center justify-center">
                  {question.id}
                </span>
                <p className="text-sm font-medium">{question.text}</p>
              </div>

              {currentQuestion === question.id && (
                <div className="mt-3 ml-9">
                  <QuestionRenderer
                    question={question}
                    answer={selectedAnswers[question.id] || ""}
                    onAnswer={handleSelectAnswer}
                    onInputChange={handleInputChange}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ================= DESKTOP (ASL, BUZILMAGAN) ================= */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        {/* Passage */}
        <div className="w-1/2 border-r border-gray-300 overflow-y-auto p-6 bg-white">
          <div className="max-w-2xl">
            <div className="mb-4 p-3 bg-gray-100 rounded">
              <p className="text-xs text-gray-700">
                <strong>{currentPart.title}</strong>
                <br />
                {currentPart.description}
              </p>
            </div>

            <HighlightText
              text={currentPart.passage}
              highlights={highlights}
              onAddHighlight={handleAddHighlight}
              highlightColor={highlightColor}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="w-1/2 overflow-y-auto p-6 bg-white">
          <div className="max-w-2xl">
            <div className="mb-6">
              <h3 className="text-sm font-bold text-red-600 mb-2">
                Questions {startQNum}–{endQNum}
              </h3>
            </div>

            <div className="space-y-6">
              {relatedQuestions.map((question: Question) => (
                <div
                  key={question.id}
                  onClick={() => onSelectQuestion(question.id)}
                  className={`pb-4 border-b cursor-pointer ${
                    currentQuestion === question.id
                      ? "bg-blue-50 -mx-6 px-6 py-4 border-l-4 border-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex gap-3 mb-3">
                    <span className="h-6 w-6 rounded-full bg-gray-300 text-xs font-bold flex items-center justify-center">
                      {question.id}
                    </span>
                    <p className="text-sm font-medium">{question.text}</p>
                  </div>

                  {currentQuestion === question.id && (
                    <div className="ml-9">
                      <QuestionRenderer
                        question={question}
                        answer={selectedAnswers[question.id] || ""}
                        onAnswer={handleSelectAnswer}
                        onInputChange={handleInputChange}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
