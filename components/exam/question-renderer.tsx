"use client"

import type { Question } from "@/lib/exams/reading/types"

interface QuestionRendererProps {
    question: Question
    answer: string
    onAnswer: (value: string) => void
    onInputChange: (value: string) => void
    fontSize?: number
}

// 1. TRUE/FALSE/NOT GIVEN - Tugmalar ko'rinishida
export function TrueFalseNotGivenRenderer({
    answer,
    onAnswer,
    fontSize = 16
}: {
    answer: string
    onAnswer: (value: string) => void
    fontSize?: number
}) {
    const options = ["TRUE", "FALSE", "NOT GIVEN"]

    return (
        <div className="flex flex-wrap gap-2">
            {options.map((option) => (
                <button
                    key={option}
                    onClick={() => onAnswer(option)}
                    className={`px-4 py-2 rounded-lg border-2 text-[11px] font-bold transition-all duration-200 ${answer === option
                            ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100"
                            : "bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50/30"
                        }`}
                    style={{ fontSize: `${Math.max(fontSize - 4, 11)}px` }}
                >
                    {option}
                </button>
            ))}
        </div>
    )
}

// 2. MULTIPLE CHOICE - Variantli savollar
export function MultipleChoiceRenderer({
    question,
    answer,
    onAnswer,
    fontSize = 16
}: {
    question: Question
    answer: string
    onAnswer: (value: string) => void
    fontSize?: number
}) {
    return (
        <div className="space-y-2">
            {question.options?.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onAnswer(option.value)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl border-2 transition-all duration-200 ${answer === option.value
                            ? "bg-blue-50 border-blue-500 shadow-sm"
                            : "bg-white border-gray-100 hover:border-gray-200"
                        }`}
                >
                    <div className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center ${answer === option.value ? "border-blue-600" : "border-gray-300"
                        }`}>
                        {answer === option.value && <div className="h-2 w-2 rounded-full bg-blue-600" />}
                    </div>
                    <span
                        className={`text-left leading-tight ${answer === option.value ? "text-blue-900 font-bold" : "text-gray-700 font-medium"}`}
                        style={{ fontSize: `${fontSize - 2}px` }}
                    >
                        {option.value}
                    </span>
                </button>
            ))}
        </div>
    )
}

// 3. GAP FILL FILL - O'ng tomonda chiqadigan input oynasi
export function GapFillFillRenderer({
    question,
    answer,
    onInputChange,
    fontSize = 16
}: {
    question: Question
    answer: string
    onInputChange: (value: string) => void
    fontSize?: number
}) {
    const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0
    const isLimitExceeded = question.word_limit ? wordCount > question.word_limit : false

    return (
        <div className="w-full space-y-2">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Write your answer here..."
                    value={answer}
                    onChange={(e) => onInputChange(e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition-all font-bold ${isLimitExceeded
                            ? "border-red-400 bg-red-50 text-red-900 focus:border-red-500"
                            : "border-blue-100 bg-blue-50/30 focus:border-blue-500 focus:bg-white text-blue-900"
                        }`}
                    style={{ fontSize: `${fontSize}px` }}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                </div>
            </div>

            <div className="flex justify-between items-center px-1">
                <p className={`text-[10px] font-bold uppercase tracking-wider ${isLimitExceeded ? "text-red-500" : "text-gray-400"}`}>
                    Words: {wordCount} {question.word_limit ? `/ Max ${question.word_limit}` : ""}
                </p>
                {isLimitExceeded && (
                    <span className="text-[10px] text-red-500 font-bold animate-pulse">LIMIT EXCEEDED</span>
                )}
            </div>
        </div>
    )
}

// 4. SELECT RENDERER - Match savollari uchun
export function SelectRenderer({
    question,
    answer,
    onAnswer,
    fontSize = 16,
    placeholder = "-- Select an option --"
}: {
    question: Question
    answer: string
    onAnswer: (value: string) => void
    fontSize?: number
    placeholder?: string
}) {
    return (
        <div className="relative">
            <select
                value={answer}
                onChange={(e) => onAnswer(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-100 bg-white focus:border-blue-500 outline-none appearance-none font-bold text-gray-800 cursor-pointer transition-all"
                style={{ fontSize: `${fontSize - 2}px` }}
            >
                <option value="" className="font-normal text-gray-400">{placeholder}</option>
                {question.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label || option.value}
                    </option>
                ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </div>
        </div>
    )
}

// ASOSIY KOMPONENT
export default function QuestionRenderer({
    question,
    answer = "",
    onAnswer,
    onInputChange,
    fontSize = 16
}: QuestionRendererProps) {

    if (!question) return null

    const commonProps = { question, answer, onAnswer, onInputChange, fontSize }

    switch (question.type) {
        case "TRUE_FALSE_NOT_GIVEN":
            return <TrueFalseNotGivenRenderer {...commonProps} />

        case "MULTIPLE_CHOICE":
            return <MultipleChoiceRenderer {...commonProps} />

        // GAP_FILL_FILL o'ng tomonda render bo'ladi
        case "GAP_FILL_FILL":
            return <GapFillFillRenderer {...commonProps} />

        case "TEXT_MATCH":
            return <SelectRenderer {...commonProps} />

        case "HEADINGS_MATCH":
            return <SelectRenderer {...commonProps} placeholder="-- Select Heading --" />

        // GAP_FILL uchun o'ng tomonda hech narsa qaytarmaymiz
        case "GAP_FILL":
            return null

        default:
            return (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-700 italic">
                    Question type "{question.type}" is not implemented.
                </div>
            )
    }
}