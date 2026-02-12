"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { 
    CheckCircle2, ChevronLeft, Award, 
    BarChart3, Hash, Loader2, Calendar,
    Target, AlertCircle, BookOpen,
    ArrowLeft, Heart, CreditCard, ExternalLink
} from "lucide-react"

// API
import { getReadingResultDetailAPI } from "@/lib/api/reading"

export default function ReadingResultPage() {
    const searchParams = useSearchParams()
    const resultId = searchParams.get("id")
    const router = useRouter()
    
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    // ASOSIY QAYTISH FUNKSIYASI
    const handleGoBack = () => {
        router.push('/dashboard/results')
    }

    useEffect(() => {
        const fetchResult = async () => {
            if (!resultId) {
                setLoading(false);
                return;
            }

            try {
                const res = await getReadingResultDetailAPI(Number(resultId));
                const resultData = res.data || res;
                
                if (resultData && (resultData.summary || resultData.review)) {
                    setData(resultData);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error("Natijani yuklashda xato:", err);
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchResult();
    }, [resultId])

    if (!resultId || error || !data) return (
        <div className="h-[60vh] flex flex-col items-center justify-center text-center p-6">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-sm w-full">
                <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">Xatolik!</h3>
                <p className="text-slate-500 font-medium mb-6">Natija topilmadi.</p>
                <button
                    onClick={handleGoBack}
                    className="w-full flex items-center justify-center gap-2 bg-[#17776A] text-white py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-teal-100"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Natijalarga qaytish
                </button>
            </div>
        </div>
    )

    if (loading) return (
        <div className="h-[60vh] flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
            <p className="text-slate-500 font-bold animate-pulse">Reading tahlili yuklanmoqda...</p>
        </div>
    )

    const summary = data?.summary || {};
    const review = data?.review || [];
    const percentage = summary.percentage ?? (summary.total_questions > 0 ? Math.round((summary.correct_answers / summary.total_questions) * 100) : 0);

    return (
        <div className="max-w-4xl mx-auto pb-20 px-4 pt-8 animate-in fade-in duration-700">
            {/* BACK BUTTON */}
            <button 
                onClick={handleGoBack}
                className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 mb-8 font-bold transition-colors group text-xs uppercase tracking-widest"
            >
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-blue-200 group-hover:bg-blue-50 transition-all">
                    <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> 
                </div>
                Natijalarga qaytish
            </button>

            {/* REPORT CARD */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden mb-10">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 sm:p-10 text-white relative overflow-hidden">
                    <BookOpen size={180} className="absolute -bottom-10 -right-10 text-white opacity-10 rotate-12 pointer-events-none" />
                    
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                        <div className="text-center md:text-left">
                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-4">
                                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">Reading Section</span>
                                <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1">
                                    <Calendar size={10} /> {summary.created_at ? new Date(summary.created_at).toLocaleDateString() : "Yaqinda"}
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 uppercase italic">Reading Report</h1>
                            <p className="text-blue-100 font-medium italic text-sm">Test ID: <span className="font-mono opacity-70">{summary.exam_id || resultId}</span></p>
                        </div>
                        
                        <div className="flex items-center gap-4 bg-white/10 p-6 rounded-[32px] backdrop-blur-md border border-white/20 shadow-lg">
                            <div className="text-center px-4 border-r border-white/20">
                                <p className="text-[10px] font-black uppercase opacity-70 mb-1 text-blue-100 tracking-wider">Correct</p>
                                <p className="text-3xl font-black">{summary.correct_answers || 0}</p>
                            </div>
                            <div className="text-center px-4">
                                <p className="text-[10px] font-black uppercase opacity-70 mb-1 text-blue-100 tracking-wider">Standart Ball</p>
                                <p className="text-5xl font-black text-white drop-shadow-sm">{summary.standard_score || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100 border-b border-slate-100 bg-white">
                    <StatItem icon={<Hash size={18}/>} label="Savollar" value={`${summary.total_questions || 0}`} />
                    <StatItem icon={<CheckCircle2 size={18} className="text-emerald-500"/>} label="To'g'ri" value={`${summary.correct_answers || 0}`} />
                    <StatItem icon={<BarChart3 size={18} className="text-blue-500"/>} label="Foizda" value={`${percentage}%`} />
                    <StatItem icon={<Award size={18} className="text-purple-500"/>} label="Daraja" value={summary.cefr_level || "—"} />
                </div>
            </div>

            {/* QUESTIONS ANALYSIS */}
            <div className="bg-white rounded-[35px] border border-slate-100 p-8 shadow-xl shadow-slate-200/40 mb-10">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-lg font-black text-slate-800 flex items-center gap-3 uppercase tracking-tight">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Target size={20} />
                        </div>
                        Savollar tahlili
                    </h2>
                </div>

                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
                    {review.map((item: any, index: number) => (
                        <QuestionNode key={index} item={item} />
                    ))}
                </div>
            </div>

            {/* --- SUPPORT SECTION (Reading sahifasiga moslandi) --- */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl flex flex-col gap-8">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center animate-pulse">
                        <Heart className="text-rose-500 fill-rose-500" size={24} />
                    </div>
                    <div>
                        <h4 className="font-black text-slate-800 leading-tight uppercase text-sm tracking-tight">Loyiha rivojiga hissa qo'shing</h4>
                        <p className="text-xs text-slate-400 font-medium tracking-wide">Sizning qo'llab-quvvatlovingiz biz uchun muhim</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Karta qismi */}
                    <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 flex items-center gap-4 group hover:border-blue-400 transition-all">
                        <CreditCard className="text-blue-500" size={24} />
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Uzcard</span>
                            <span className="text-sm font-mono font-black text-slate-700 tracking-wider">6262 5708 0051 9183</span>
                            <span className="text-[10px] text-slate-500 font-bold mt-1">Diyorbek Abdumutlalibov</span>
                        </div>
                    </div>

                    {/* iDonate Link qismi */}
                    <Link 
                        href="https://idonate.uz/d/rafkix" 
                        target="_blank"
                        className="bg-blue-700 px-6 py-4 rounded-2xl flex items-center justify-center gap-3 text-white font-black uppercase text-xs tracking-widest hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-teal-100/50 group"
                    >
                        <span>Donat qilish (iDonate)</span>
                        <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Link>
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

function QuestionNode({ item }: { item: any }) {
    return (
        <div className="group relative">
            <div className={`w-full aspect-square rounded-2xl flex items-center justify-center font-black text-sm transition-all border shadow-sm cursor-default
                ${item.is_correct 
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-500 hover:text-white' 
                    : 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-500 hover:text-white'}`}>
                {item.question_number}
            </div>
            
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-4 bg-slate-900 text-white rounded-[20px] text-[11px] opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-30 shadow-2xl scale-95 group-hover:scale-100">
                <p className="opacity-60 uppercase font-black mb-2 border-b border-white/10 pb-1">Savol {item.question_number}</p>
                <div className="space-y-1.5">
                    <p className="font-bold flex flex-col">
                        <span className="text-[9px] opacity-50 uppercase tracking-wider">Sizning javob:</span> 
                        <span className={item.is_correct ? "text-emerald-400 text-sm" : "text-rose-400 text-sm line-through"}>
                            {item.user_answer || "(Bo'sh)"}
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
    )
}