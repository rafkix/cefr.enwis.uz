"use client"

import type { Question } from "@/lib/types/reading"

interface QuestionRendererProps {
    question: Question
    answer: string
    onAnswer: (value: string) => void
    onInputChange: (value: string) => void
    fontSize?: number
}

// 1. TRUE/FALSE/NOT GIVEN - Tugmalar
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
                    className={`px-4 py-2 rounded-lg border-2 text-[11px] font-bold transition-all duration-200 
                        ${answer === option
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
                    // MUHIM: Multiple Choice da javob sifatida LABEL ("A", "B") ketadi
                    onClick={() => onAnswer(option.label)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl border-2 transition-all duration-200 text-left
                        ${answer === option.label
                            ? "bg-blue-50 border-blue-500 shadow-sm ring-1 ring-blue-200"
                            : "bg-white border-gray-100 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                >
                    {/* Radio Circle */}
                    <div className={`mt-0.6 h-6 w-6 shrink-0 rounded-full border-2 flex items-center justify-center 
                        ${answer === option.label ? "border-blue-600" : "border-gray-300"}`}
                    >
                        {answer === option.label && <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />}
                    {option.value}
                    </div>
                    

                    {/* Text: A) Variant matni */}
                    <span
                        className={`leading-tight ${answer === option.label ? "text-blue-900 font-bold" : "text-gray-700 font-medium"}`}
                        style={{ fontSize: `${fontSize - 2}px` }}
                        
                    >
                        <span className="font-bold mr-2">{option.label}</span>
                    </span>
                </button>
            ))}
        </div>
    )
}

// 3. GAP FILL FILL - Sidebar uchun input (Agar ExamContent ishlatmasa)
export function GapFillFillRenderer({
    answer,
    onInputChange,
    fontSize = 16
}: {
    answer: string
    onInputChange: (value: string) => void
    fontSize?: number
}) {
    return (
        <div className="w-full space-y-2">
            <input
                type="text"
                placeholder="Type your answer..."
                value={answer}
                onChange={(e) => onInputChange(e.target.value)}
                // 🟢 MUHIM: Tashqaridagi onClick ishlashini to'xtatadi
                onClick={(e) => e.stopPropagation()} 
                className="w-full px-4 py-2.5 rounded-lg border-2 border-blue-100 bg-blue-50/30 text-blue-900 font-bold outline-none focus:border-blue-500 focus:bg-white transition-all"
                style={{ fontSize: `${fontSize}px` }}
            />
        </div>
    )
}

// 4. SELECT RENDERER - Matching (Headings, Text match)
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
                className="w-full px-3 py-2.5 rounded-lg border-2 border-gray-200 bg-white focus:border-blue-500 outline-none appearance-none font-bold text-gray-800 cursor-pointer transition-all hover:border-blue-300"
                style={{ fontSize: `${fontSize - 2}px` }}
            >
                <option value="" className="text-gray-400 font-normal">{placeholder}</option>
                {question.options?.map((option, idx) => (
                    // Match savollarida VALUE ("A", "B", "I"...) javob sifatida ketadi
                    <option key={idx} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {/* Custom Arrow Icon */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </div>
        </div>
    )
}

// --- ASOSIY RENDER KOMPONENTI ---
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

        case "GAP_FILL_FILL":
            // Eslatma: ExamContent odatda buni o'zi render qiladi, 
            // lekin fallback sifatida bu yerda ham tursa ziyon qilmaydi.
            return <GapFillFillRenderer {...commonProps} />

        case "TEXT_MATCH":
            return <SelectRenderer {...commonProps} placeholder="-- Select Paragraph --" />

        case "HEADINGS_MATCH":
            return <SelectRenderer {...commonProps} placeholder="-- Select Heading --" />

        // GAP_FILL (Part 1) matn ichida bo'lgani uchun bu yerda render qilinmaydi
        case "GAP_FILL":
            return null

        default:
            return (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600 font-medium">
                    Unsupported question type: {question.type}
                </div>
            )
    }
}