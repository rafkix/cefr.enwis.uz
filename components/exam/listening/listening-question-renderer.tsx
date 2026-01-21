"use client"

import React from "react"
import { Map, Type, ListChecks, HelpCircle } from "lucide-react"

// Tipni kengaytiramiz (35 ta savol va 6 tur uchun)
type ListeningQuestionType =
    | "MULTIPLE_CHOICE"     // Part 1: Rasm yoki matnli
    | "GAP_FILL"           // Part 2: Note completion
    | "MATCHING"           // Part 3: Fikrlar/Xususiyatlar
    | "MAP_DIAGRAM"        // Part 4: Xarita/Diagramma
    | "SENTENCE_COMPLETION"// Part 5: Akademik qismlar
    | "SHORT_ANSWER"       // Part 6: Qisqa javob/Guruhlash

interface Question {
    id: number
    type: ListeningQuestionType
    text?: string
    options?: { label: string; value: string }[]
    imageUrl?: string // Xarita yoki diagramma uchun
}

interface QuestionRendererProps {
    question: Question
    answer: string
    onAnswer: (value: string) => void
    onInputChange: (value: string) => void
    fontSize?: number
}

// 1. MULTIPLE CHOICE (Part 1 - Rasm yoki Matnli)
export function MultipleChoiceRenderer({ question, answer, onAnswer, fontSize = 16 }: any) {
    return (
        <div className="space-y-3">
            {question.imageUrl && (
                <div className="mb-3 rounded-lg overflow-hidden border border-gray-200">
                    <img src={question.imageUrl} alt="Context" className="w-full h-auto" />
                </div>
            )}
            <div className="grid grid-cols-1 gap-2">
                {question.options?.map((option: any) => {
                    // isSelected tekshiruvi: User matnni bosgan bo'lsa ham, harfni bosgan bo'lsa ham ishlaydi
                    const isSelected = answer === option.value || answer === option.label;

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onAnswer(option.value)} // Javob sifatida MATNNI yuboramiz
                            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left
                                ${isSelected
                                    ? "bg-blue-50 border-blue-500 ring-1 ring-blue-200"
                                    : "bg-white border-gray-100 hover:border-gray-300"}`}
                        >

                            <div className="flex items-center gap-3">
                                {/* Variant HARFI o'ng tomonda alohida turadi */}

                                <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center 
                                    ${isSelected ? "border-blue-600" : "border-gray-300"}`}>
                                    {/* {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />} */}
                                    <span className={`text-sm font-bold ${isSelected ? "text-blue-600" : "text-slate-400"}`}>
                                        {option.value}
                                    </span>
                                </div>
                                <span style={{ fontSize: `${fontSize}px` }} className="font-medium text-gray-700">
                                    {option.label} {/* Bu yerda MATN chiqadi */}
                                </span>
                            </div>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

// 2, 5 & 6. INPUT ASOSIDAGI SAVOLLAR (Gap-fill, Sentence, Short Answer)
export function TextEntryRenderer({ answer, onInputChange, fontSize = 16, placeholder }: any) {
    return (
        <div className="relative group">
            <input
                type="text"
                placeholder={placeholder}
                value={answer}
                onChange={(e) => onInputChange(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-blue-50 bg-blue-50/30 text-blue-900 font-bold outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm"
                style={{ fontSize: `${fontSize}px` }}
            />
            <Type className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-200 group-focus-within:text-blue-500" />
        </div>
    )
}

// 3. MATCHING (Part 3 - Moslashtirish)
export function MatchingRenderer({ question, answer, onAnswer, fontSize = 16 }: any) {
    return (
        <div className="relative">
            <select
                value={answer}
                onChange={(e) => onAnswer(e.target.value)}
                className="w-full px-3 py-3 rounded-xl border-2 border-gray-100 bg-white focus:border-blue-500 outline-none appearance-none font-bold text-gray-700 cursor-pointer transition-all"
                style={{ fontSize: `${fontSize - 2}px` }}
            >
                <option value="">-- Variantni tanlang --</option>
                {question.options?.map((opt: any) => (
                    <option key={opt.label} value={opt.label}>{opt.label}: {opt.value}</option>
                ))}
            </select>
            <ListChecks className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
    )
}

// 4. MAP / DIAGRAM LABELING (Part 4 - Xarita)
export function MapLabelingRenderer({ answer, onInputChange, fontSize = 16 }: any) {
    return (
        <div className="bg-gray-50 p-6 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center">
            <div className="bg-white p-3 rounded-full shadow-sm mb-4">
                <Map className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Harf kiritish (A-H)</p>
            <input
                type="text"
                maxLength={1}
                value={answer}
                onChange={(e) => onInputChange(e.target.value.toUpperCase())}
                className="w-20 h-20 text-center text-3xl font-black border-4 border-white shadow-xl rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none text-blue-600 uppercase"
            />
        </div>
    )
}

// --- ASOSIY RENDERER ---
export default function ListeningQuestionRenderer({
    question,
    answer = "",
    onAnswer,
    onInputChange,
    fontSize = 16
}: QuestionRendererProps) {

    if (!question) return null

    const props = { question, answer, onAnswer, onInputChange, fontSize }

    switch (question.type) {
        case "MULTIPLE_CHOICE":
            return <MultipleChoiceRenderer {...props} />

        case "GAP_FILL":
            return <TextEntryRenderer {...props} placeholder="Note completion..." />

        case "MATCHING":
            return <MatchingRenderer {...props} />

        case "MAP_DIAGRAM":
            return <MapLabelingRenderer {...props} />

        case "SENTENCE_COMPLETION":
            return <TextEntryRenderer {...props} placeholder="Complete the sentence..." />

        case "SHORT_ANSWER":
            return <TextEntryRenderer {...props} placeholder="Short answer (max 3 words)..." />

        default:
            return (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-700">
                    <HelpCircle className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase">Noma'lum tur: {question.type}</span>
                </div>
            )
    }
}