"use client"

import type { Question } from "@/lib/exam-data"

interface QuestionRendererProps {
  question: Question
  answer: string
  onAnswer: (value: string) => void
  onInputChange: (value: string) => void
}

export function TrueFalseNotGivenRenderer({
  answer,
  onAnswer,
}: {
  answer: string
  onAnswer: (value: string) => void
}) {
  const options = ["TRUE", "FALSE", "NOT GIVEN"]

  return (
    <div className="space-y-2">
      {options.map((option) => (
        <label
          key={option}
          className="flex cursor-pointer items-center gap-3 p-3 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <input
            type="radio"
            name="tfng"
            value={option}
            checked={answer === option}
            onChange={() => onAnswer(option)}
            className="h-4 w-4 cursor-pointer accent-blue-600"
          />
          <span className="text-sm text-gray-800">{option}</span>
        </label>
      ))}
    </div>
  )
}

export function MultipleChoiceRenderer({
  question,
  answer,
  onAnswer,
}: {
  question: Question
  answer: string
  onAnswer: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      {question.options?.map((option) => (
        <label
          key={option.value}
          className="flex cursor-pointer items-start gap-3 p-3 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <input
            type="radio"
            name="mcq"
            value={option.value}
            checked={answer === option.value}
            onChange={() => onAnswer(option.value)}
            className="h-4 w-4 cursor-pointer accent-blue-600 mt-0.5 shrink-0"
          />
          <span className="text-sm text-gray-800">{option.value}</span>
        </label>
      ))}
    </div>
  )
}

export function GapFillRenderer({
  question,
  answer,
  onInputChange,
}: {
  question: Question
  answer: string
  onInputChange: (value: string) => void
}) {
  const words = answer.split(" ").length
  const wordClass = question.word_limit && words > question.word_limit ? "text-red-500" : "text-gray-600"

  return (
    <div>
      <input
        type="text"
        placeholder="Type your answer..."
        value={answer}
        onChange={(e) => onInputChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <p className={`text-xs mt-2 ${wordClass}`}>
        Words: {words} {question.word_limit ? `/ ${question.word_limit}` : ""}
      </p>
    </div>
  )
}

export function TextMatchRenderer({
  question,
  answer,
  onAnswer,
}: {
  question: Question
  answer: string
  onAnswer: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <select
        value={answer}
        onChange={(e) => onAnswer(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Select an option --</option>
        {question.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.value}
          </option>
        ))}
      </select>
    </div>
  )
}

export function HeadingsMatchRenderer({
  question,
  answer,
  onAnswer,
}: {
  question: Question
  answer: string
  onAnswer: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <select
        value={answer}
        onChange={(e) => onAnswer(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Select heading --</option>
        {question.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default function QuestionRenderer({ question, answer, onAnswer, onInputChange }: QuestionRendererProps) {
  switch (question.type) {
    case "TRUE_FALSE_NOT_GIVEN":
      return <TrueFalseNotGivenRenderer answer={answer} onAnswer={onAnswer} />
    case "MULTIPLE_CHOICE":
      return <MultipleChoiceRenderer question={question} answer={answer} onAnswer={onAnswer} />
    case "GAP_FILL":
      return <GapFillRenderer question={question} answer={answer} onInputChange={onInputChange} />
    case "TEXT_MATCH":
      return <TextMatchRenderer question={question} answer={answer} onAnswer={onAnswer} />
    case "HEADINGS_MATCH":
      return <HeadingsMatchRenderer question={question} answer={answer} onAnswer={onAnswer} />
    default:
      return null
  }
}
