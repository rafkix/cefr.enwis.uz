"use client"
import { useEffect, useState, use } from "react"
import { useParams, useRouter } from "next/navigation"
import { getListeningResultDetailAPI } from "@/lib/api/listening"
import { 
    CheckCircle2, ChevronLeft, Award, 
    BarChart3, Hash, Loader2, Calendar,
    Target
} from "lucide-react"
import Link from "next/link"

// Ma'lumotlar tuzilishi uchun interfeyslar
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

export default function ListeningResultPage() {
    const params = useParams()
    const router = useRouter()
    
    // State'lar aniq tiplar bilan
    const [data, setData] = useState<{ summary: Summary; review: ReviewItem[] } | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        // params.id mavjudligini va xavfsizligini tekshirish
        const resultId = params?.id;
        
        if (resultId) {
            getListeningResultDetailAPI(Number(resultId))
                .then(res => {
                    if (res.data) {
                        setData(res.data)
                    } else {
                        setError(true)
                    }
                })
                .catch((err) => {
                    console.error("Result fetch error:", err)
                    setError(true)
                })
                .finally(() => setLoading(false))
        }
    }, [params, router])

    // 1. Yuklanish holati
    if (loading) return (
        <div className="h-[60vh] flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-purple-700 mb-4" />
            <p className="text-slate-500 font-bold">Listening tahlili yuklanmoqda...</p>
        </div>
    )

    // 2. Xatolik yoki Ma'lumot topilmagan holati
    if (error || !data) return (
        <div className="h-[60vh] flex flex-col items-center justify-center text-center p-6">
            <div className="bg-rose-50 p-6 rounded-[32px] border border-rose-100">
                <p className="text-rose-600 font-bold mb-4">Natija topilmadi yoki yuklashda xatolik yuz berdi.</p>
                <Link href="/dashboard/result" className="text-sm font-black uppercase text-rose-700 underline">
                    Natijalar ro'yxatiga qaytish
                </Link>
            </div>
        </div>
    )

    // 3. Ma'lumotni xavfsiz destruktizatsiya qilish
    const { summary, review } = data;

    return (
        <div className="max-w-4xl mx-auto pb-20 px-4 pt-8 animate-in fade-in duration-700">
            <Link href="/dashboard/result" className="inline-flex items-center gap-2 text-slate-500 hover:text-purple-700 mb-8 font-bold transition-colors group">
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
                Natijalarga qaytish
            </Link>

            {/* HEADER CARD */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden mb-10">
                <div className="bg-gradient-to-br from-purple-600 to-indigo-800 p-10 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="text-center md:text-left">
                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-4">
                                <span className="bg-white/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">Listening</span>
                                <span className="bg-white/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1">
                                    <Calendar size={10} /> {summary.created_at ? new Date(summary.created_at).toLocaleDateString() : "Sana ko'rsatilmadi"}
                                </span>
                            </div>
                            <h1 className="text-4xl font-black tracking-tight mb-2 uppercase italic">Listening Report</h1>
                            <p className="text-purple-100 font-medium italic opacity-80 text-sm">Test ID: {summary.exam_id}</p>
                        </div>
                        
                        <div className="flex items-center gap-4 bg-white/10 p-6 rounded-[32px] backdrop-blur-md border border-white/20 shadow-inner">
                            <div className="text-center px-4 border-r border-white/20">
                                <p className="text-[10px] font-black uppercase opacity-60 mb-1 text-white">To'g'ri</p>
                                <p className="text-3xl font-black">{summary.correct_answers}</p>
                            </div>
                            <div className="text-center px-4">
                                <p className="text-[10px] font-black uppercase opacity-60 mb-1 text-white">CEFR Ball</p>
                                <p className="text-5xl font-black">{summary.standard_score}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100 py-6 bg-slate-50/50">
                    <StatItem icon={<Hash size={18}/>} label="Savollar" value={`${summary.total_questions} ta`} />
                    <StatItem icon={<CheckCircle2 size={18} className="text-emerald-500"/>} label="To'g'ri" value={`${summary.correct_answers} ta`} />
                    <StatItem icon={<BarChart3 size={18} className="text-blue-500"/>} label="Foiz" value={summary.total_questions > 0 ? `${Math.round((summary.correct_answers / summary.total_questions) * 100)}%` : "0%"} />
                    <StatItem icon={<Award size={18} className="text-purple-500"/>} label="Daraja" value={summary.cefr_level || "—"} />
                </div>
            </div>

            {/* JAVOBLAR GRIDI */}
            <div className="bg-white rounded-[35px] border border-slate-100 p-8 shadow-xl shadow-slate-100/50">
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-3 mb-8 uppercase tracking-tight">
                    <Target className="text-purple-600" /> Savollar tahlili
                </h2>
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
                    {review && review.map((item, index) => (
                        <div key={index} className="group relative">
                            <div className={`w-full aspect-square rounded-2xl flex items-center justify-center font-black text-sm transition-all border
                                ${item.is_correct 
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-500 hover:text-white' 
                                    : 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-500 hover:text-white'}`}>
                                {item.question_number}
                            </div>
                            
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-4 bg-slate-900 text-white rounded-[20px] text-[11px] opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-30 shadow-2xl scale-95 group-hover:scale-100">
                                <p className="opacity-60 uppercase font-black mb-2 border-b border-white/10 pb-1">Savol {item.question_number}</p>
                                <div className="space-y-1">
                                    <p className="font-bold flex justify-between">
                                        <span>Siz:</span> 
                                        <span className={item.is_correct ? "text-emerald-400" : "text-rose-400"}>{item.user_answer || "—"}</span>
                                    </p>
                                    {!item.is_correct && (
                                        <p className="font-bold flex justify-between border-t border-white/5 pt-1 mt-1">
                                            <span>Asli:</span> 
                                            <span className="text-emerald-400">{item.correct_answer}</span>
                                        </p>
                                    )}
                                </div>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-[10px] border-transparent border-t-slate-900" />
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
        <div className="flex flex-col items-center py-2 px-4 text-center">
            <div className="text-slate-400 mb-2">{icon}</div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">{label}</span>
            <span className="text-base font-bold text-slate-800">{value}</span>
        </div>
    )
}