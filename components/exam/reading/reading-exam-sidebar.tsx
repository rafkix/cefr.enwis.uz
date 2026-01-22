"use client"

import { Minus, Plus, Type, Video, CheckCircle2 } from "lucide-react"
import React from "react"

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

export default function ReadingExamSidebar({
    currentQuestion, totalQuestions, answered, timeLeft, fontSize,
    onSelectQuestion, onFinish, onIncreaseFontSize, onDecreaseFontSize
}: ExamSidebarProps) {

    const questions = Array.from({ length: totalQuestions }, (_, i) => i + 1)

    return (
        <div className="w-72 h-screen bg-[#F8FAFC] border-l border-slate-200 flex flex-col p-4 overflow-hidden shrink-0 shadow-xl relative">

            {/* 1. VAQT (TIMER) */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center shrink-0 mb-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black mb-1">Qolgan vaqt</span>
                <div className="text-3xl font-mono font-black text-slate-800 tabular-nums">
                    {timeLeft}
                </div>
            </div>

            {/* 1. YAKUNLASH */}
            <button
                onClick={onFinish}
                className="w-full bg-blue-500 hover:bg-red-600 text-white font-bold py-4 rounded-lg text-xs transition-all active:scale-95 uppercase tracking-wider mb-4"
            >
                Yakunlash
            </button>

            {/* 2. SOZLAMALAR */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm space-y-4 shrink-0 mb-4">
                <div className="flex items-center justify-between">
                    <button onClick={onDecreaseFontSize} className="w-8 h-8 items-center justify-center bg-white rounded-lg shadow-sm border border-slate-100 hover:bg-blue-50 transition-all active:scale-90 font-bold">-A</button>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Type className="w-4 h-4 text-blue-500" /> Matn hajmi
                    </span>
                    <button onClick={onIncreaseFontSize} className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm border border-slate-100 hover:bg-blue-50 transition-all active:scale-90 font-bold">A+</button>
                </div>
            </div>

            {/* 3. SAVOLLAR NAVIGATORI */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col shrink-0 mb-4 h-fit overflow-visible">
                <div className="flex items-center justify-between mb-3 shrink-0">
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-black">Savollar</span>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-3 py-0.5 rounded-full border border-blue-100">
                        {Object.keys(answered).length}/{totalQuestions}
                    </span>
                </div>

                {/* Skrollni butunlay yo'qotish uchun overflow-visible qilamiz */}
                <div className="overflow-visible">
                    <div className="grid grid-cols-5 gap-2 pb-1">
                        {questions.map((q) => {
                            const isActive = q === currentQuestion
                            const isDone = answered[q]
                            return (
                                <button
                                    key={q}
                                    onClick={() => onSelectQuestion(q)}
                                    className={`
                            aspect-square flex items-center justify-center rounded-full border-2 text-xs font-black transition-all relative
                            ${isActive
                                            ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105 z-10"
                                            : isDone
                                                ? "bg-emerald-500 text-white border-emerald-500"
                                                : "bg-slate-50 text-slate-400 border-slate-100 hover:border-blue-300"
                                        }
                        `}
                                >
                                    {q}
                                    {isDone && !isActive && (
                                        <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                        </div>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* 4. KAMERA VA FINISH - Pastdan 30px yuqorida mahkamlangan */}
            <div className="bottom-2.5 left-4 right-4 flex flex-col gap-4 bg-[#F8FAFC] pt-2">

                {/* KAMERA */}
                <div className="bg-slate-900 aspect-video rounded-2xl overflow-hidden relative border-2 border-white shadow-xl group">
                    <div className="absolute top-2 right-2 z-10 flex items-center gap-1.5 bg-black/50 px-2 py-1 rounded-full backdrop-blur-md border border-white/10">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-[8px] text-white font-black uppercase tracking-widest">Live Proctor</span>
                    </div>
                    <div className="w-full h-full flex items-center justify-center bg-slate-800">
                        <Video className="text-slate-700" size={32} />
                    </div>
                </div>
            </div>
        </div>
    )
}