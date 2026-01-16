"use client"

import { Minus, Plus, Type } from "lucide-react"
import React, { useEffect, useRef } from "react"

interface ExamSidebarProps {
    currentQuestion: number
    totalQuestions: number
    answered: Record<number, boolean>
    timeLeft: string
    fontSize: number
    onSelectQuestion: (q: number) => void
    onFinish: () => void
    onIncreaseFontSize: () => void
    onDecreaseFontSize: () => void
}

export default function ExamSidebar({
    currentQuestion, totalQuestions, answered, timeLeft, fontSize,
    onSelectQuestion, onFinish, onIncreaseFontSize, onDecreaseFontSize
}: ExamSidebarProps) {

    const questions = Array.from({ length: totalQuestions }, (_, i) => i + 1)

    return (
        <div className="w-64 h-screen bg-gray-50 border-l border-gray-200 flex flex-col p-3 gap-3 overflow-hidden shrink-0">

            {/* 1. YAKUNLASH */}
            <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 shrink-0 text-center">
                <button
                    onClick={onFinish}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded-lg text-xs transition-all active:scale-95 uppercase tracking-wider"
                >
                    Yakunlash
                </button>
            </div>

            {/* 2. TIMER */}
            <div className="bg-white py-2 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center shrink-0 text-center leading-none">
                <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">Timer</span>
                <div className="text-2xl font-mono font-black text-gray-700">
                    {timeLeft}
                </div>
            </div>

            {/* 3. SHRIFT BOSHQARUVI */}
            <div className="bg-white p-2 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded-lg border">
                    <button onClick={onDecreaseFontSize} className="p-1.5 hover:bg-white rounded shadow-sm text-gray-600 transition-all active:scale-75">
                        <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-1.5 text-gray-700 font-bold">
                        <Type className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-xs"></span>
                    </div>
                    <button onClick={onIncreaseFontSize} className="p-1.5 hover:bg-white rounded shadow-sm text-gray-600 transition-all active:scale-75">
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* 4. SAVOLLAR PANELI - 1 qatorda 6 ta tugma */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col min-h-0 max-h-[40%] overflow-hidden shrink-0">
                <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2 block text-center">
                    Savollar raqami
                </span>

                <div className="overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-6 gap-1.5 pb-1">
                        {questions.map((q) => {
                            const isActive = q === currentQuestion
                            const isAnswered = answered[q]

                            let btnClass = "bg-gray-50 text-gray-400 border-gray-100 hover:border-blue-300"
                            if (isActive) btnClass = "bg-blue-600 text-white border-blue-600 shadow-sm"
                            else if (isAnswered) btnClass = "bg-blue-500 text-white border-blue-500"

                            return (
                                <button
                                    key={q}
                                    onClick={() => onSelectQuestion(q)}
                                    className={`h-7 w-full flex items-center justify-center rounded-md border text-[10px] font-bold transition-all ${btnClass}`}
                                >
                                    {q}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* 5. FOYDALANUVCHI MA'LUMOTI (Kamera o'rniga oddiy profil) */}
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 shrink-0 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                    ID
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-700 leading-tight">Student_2026</span>
                    <span className="text-[8px] text-blue-500 font-bold uppercase">Online</span>
                </div>
            </div>

        </div>
    )
}