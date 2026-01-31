"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation" // 👈 params o'rniga searchParams
import Link from "next/link"
import {
    CheckCircle2, ChevronLeft, Award,
    BarChart3, Hash, Loader2, Calendar,
    Target, AlertCircle
} from "lucide-react"

// API funksiyasini import qilish (buni o'zingizdagi manzilga to'g'rilang)
import { getListeningResultDetailAPI } from "@/lib/api/listening"

// --- TYPES ---
interface Summary {
    exam_id: string;
    created_at: string;
    correct_answers: number;
    total_questions: number;
    standard_score: number;
    cefr_level: string;
}

interface ReviewItem {
    question_number: number;
    is_correct: boolean;
    user_answer: string;
    correct_answer: string;
}

interface ResultData {
    summary: Summary;
    review: ReviewItem[];
}

export default function ListeningResultPage() {
    const searchParams = useSearchParams()
    const resultId = searchParams.get("id") // 👈 URL dan ID ni olamiz
    const router = useRouter()

    const [data, setData] = useState<ResultData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        if (resultId) {
            getListeningResultDetailAPI(Number(resultId))
                .then(res => {
                    // API dan kelgan ma'lumotni tekshirish
                    if (res.data) {
                        setData(res.data)
                    } else if (res.summary) {
                        // Ba'zan backend to'g'ridan-to'g'ri data ichisiz qaytarishi mumkin
                        setData(res as unknown as ResultData)
                    } else {
                        setError(true)
                    }
                })
                .catch((err) => {
                    console.error("Result fetch error:", err)
                    setError(true)
                })
                .finally(() => setLoading(false))
        } else {
            setLoading(false) // ID yo'q bo'lsa ham yuklashni to'xtatamiz
        }
    }, [resultId])

    // 1. ID yo'q bo'lsa (URL noto'g'ri)
    if (!resultId) return (
        <div className="h-[60vh] flex flex-col items-center justify-center text-center p-6">
            <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-500 font-bold">Natija ID si topilmadi.</p>
            <button onClick={() => router.back()} className="mt-4 text-blue-600 font-bold hover:underline">Orqaga qaytish</button>
        </div>
    )

    // 2. Yuklanish holati
    if (loading) return (
        <div className="h-[60vh] flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600 mb-4" />
            <p className="text-slate-500 font-bold animate-pulse">Natijalar tahlil qilinmoqda...</p>
        </div>
    )

    // 3. Xatolik yoki Ma'lumot yo'qligi
    if (error || !data) return (
        <div className="h-[60vh] flex flex-col items-center justify-center text-center p-6">
            <div className="bg-rose-50 p-8 rounded-[32px] border border-rose-100 max-w-md">
                <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-4" />
                <p className="text-rose-600 font-bold mb-4">Natijani yuklashda xatolik yuz berdi.</p>
                <Link href="/dashboard/test/listening" className="px-6 py-3 bg-white text-rose-600 rounded-xl text-sm font-black uppercase shadow-sm border border-rose-100 hover:bg-rose-500 hover:text-white transition-all">
                    Testlar ro'yxatiga qaytish
                </Link>
            </div>
        </div>
    )

    const { summary, review } = data;

    return (
        <div className="max-w-4xl mx-auto pb-20 px-4 pt-8 animate-in fade-in duration-700">
            {/* Orqaga tugmasi */}
            <Link href="/dashboard/test/listening" className="inline-flex items-center gap-2 text-slate-400 hover:text-purple-600 mb-8 font-bold transition-colors group text-xs uppercase tracking-widest">
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-purple-200 group-hover:bg-purple-50 transition-all">
                    <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                </div>
                Natijalarga qaytish
            </Link>

            {/* HEADER CARD */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden mb-10">
                <div className="bg-gradient-to-br from-purple-600 to-indigo-800 p-8 sm:p-10 text-white relative overflow-hidden">
                    {/* Orqa fon bezagi */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                        <div className="text-center md:text-left">
                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-4">
                                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border border-white/10">Listening</span>
                                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 border border-white/10">
                                    <Calendar size={10} /> {summary.created_at ? new Date(summary.created_at).toLocaleDateString() : "—"}
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 uppercase italic">Listening Report</h1>
                            <p className="text-purple-200 font-medium italic text-sm">Test ID: <span className="font-mono opacity-70">{summary.exam_id}</span></p>
                        </div>

                        <div className="flex items-center gap-4 bg-white/10 p-6 rounded-[32px] backdrop-blur-md border border-white/20 shadow-lg">
                            <div className="text-center px-4 border-r border-white/20">
                                <p className="text-[10px] font-black uppercase opacity-70 mb-1 text-purple-100 tracking-wider">To'g'ri</p>
                                <p className="text-3xl font-black">{summary.correct_answers}</p>
                            </div>
                            <div className="text-center px-4">
                                <p className="text-[10px] font-black uppercase opacity-70 mb-1 text-purple-100 tracking-wider">CEFR Ball</p>
                                <p className="text-5xl font-black text-white drop-shadow-sm">{summary.standard_score}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100 border-b border-slate-100 bg-white">
                    <StatItem icon={<Hash size={18} />} label="Savollar" value={`${summary.total_questions}`} />
                    <StatItem icon={<CheckCircle2 size={18} className="text-emerald-500" />} label="To'g'ri" value={`${summary.correct_answers}`} />
                    <StatItem
                        icon={<BarChart3 size={18} className="text-blue-500" />}
                        label="Samaradorlik"
                        value={summary.total_questions > 0 ? `${Math.round((summary.correct_answers / summary.total_questions) * 100)}%` : "0%"}
                    />
                    <StatItem icon={<Award size={18} className="text-purple-500" />} label="Daraja" value={summary.cefr_level || "—"} />
                </div>
            </div>

            {/* JAVOBLAR GRIDI */}
            <div className="bg-white rounded-[35px] border border-slate-100 p-8 shadow-xl shadow-slate-200/40">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-black text-slate-800 flex items-center gap-3 uppercase tracking-tight">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Target size={20} />
                        </div>
                        Savollar tahlili
                    </h2>
                    <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> To'g'ri</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-rose-500"></span> Xato</div>
                    </div>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
                    {review && review.map((item, index) => (
                        <div key={index} className="group relative">
                            <div className={`w-full aspect-square rounded-2xl flex items-center justify-center font-black text-sm transition-all border shadow-sm cursor-default
                                ${item.is_correct
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-500 hover:text-white hover:shadow-emerald-200'
                                    : 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-500 hover:text-white hover:shadow-rose-200'}`}>
                                {item.question_number}
                            </div>

                            {/* Custom Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-4 bg-slate-900 text-white rounded-[20px] text-[11px] opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-30 shadow-2xl scale-95 group-hover:scale-100 translate-y-2 group-hover:translate-y-0">
                                <p className="opacity-60 uppercase font-black mb-2 border-b border-white/10 pb-1">Savol {item.question_number}</p>
                                <div className="space-y-1.5">
                                    <p className="font-bold flex flex-col">
                                        <span className="text-[9px] opacity-50 uppercase tracking-wider">Sizning javob:</span>
                                        <span className={item.is_correct ? "text-emerald-400 text-sm" : "text-rose-400 text-sm line-through decoration-rose-500/50"}>
                                            {item.user_answer || "(Belgilanmagan)"}
                                        </span>
                                    </p>
                                    {!item.is_correct && (
                                        <p className="font-bold flex flex-col pt-1 border-t border-white/10">
                                            <span className="text-[9px] opacity-50 uppercase tracking-wider">To'g'ri javob:</span>
                                            <span className="text-emerald-400 text-sm">{item.correct_answer}</span>
                                        </p>
                                    )}
                                </div>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[8px] border-transparent border-t-slate-900" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function StatItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) {
    return (
        <div className="flex flex-col items-center justify-center py-6 px-2 text-center hover:bg-slate-50 transition-colors">
            <div className="mb-2 opacity-80 scale-90">{icon}</div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</span>
            <span className="text-lg font-black text-slate-800">{value}</span>
        </div>
    )
}