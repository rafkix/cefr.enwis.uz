"use client"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getReadingResultDetailAPI } from "@/lib/api/reading"
import { 
    CheckCircle2, ChevronLeft, Award, 
    BarChart3, Hash, Loader2, Calendar,
    Info, Target, BookOpen
} from "lucide-react"
import Link from "next/link"

export default function ReadingResultPage() {
    const params = useParams()
    const router = useRouter()
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (params.id) {
            getReadingResultDetailAPI(Number(params.id))
                .then(res => setData(res.data))
                .catch(() => router.push('/dashboard/result'))
                .finally(() => setLoading(false))
        }
    }, [params.id, router])

    if (loading) return (
        <div className="h-[60vh] flex flex-col items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
            <p className="text-slate-500 font-bold">Reading tahlili yuklanmoqda...</p>
        </div>
    )

    const { summary, review } = data;

    return (
        <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-700">
            <Link href="/dashboard/result" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 font-bold transition-colors group">
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
                Natijalarga qaytish
            </Link>

            {/* HEADER CARD */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden mb-10">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="bg-white/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase">Reading</span>
                                <span className="bg-white/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1">
                                    <Calendar size={10} /> {new Date(summary.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <h1 className="text-4xl font-black tracking-tight mb-2 uppercase italic">Reading Report</h1>
                            <p className="text-blue-100 font-medium italic">Test ID: {summary.exam_id}</p>
                        </div>
                        <div className="flex items-center gap-4 bg-white/10 p-6 rounded-[32px] backdrop-blur-md border border-white/20">
                            <div className="text-center px-4 border-r border-white/20">
                                <p className="text-[10px] font-black uppercase opacity-60">To'g'ri</p>
                                <p className="text-3xl font-black">{summary.raw_score}</p>
                            </div>
                            <div className="text-center px-4">
                                <p className="text-[10px] font-black uppercase opacity-60">CEFR Ball</p>
                                <p className="text-5xl font-black">{summary.standard_score}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100 py-6 bg-slate-50/50">
                    <StatItem icon={<Hash size={18}/>} label="Savollar" value={`${review.length} ta`} />
                    <StatItem icon={<CheckCircle2 size={18} className="text-emerald-500"/>} label="To'g'ri" value={`${summary.raw_score} ta`} />
                    <StatItem icon={<BarChart3 size={18} className="text-blue-500"/>} label="Foiz" value={`${Math.round(summary.percentage)}%`} />
                    <StatItem icon={<Award size={18} className="text-purple-500"/>} label="Daraja" value={summary.cefr_level} />
                </div>
            </div>

            {/* JAVOBLAR GRIDI */}
            <div className="bg-white rounded-[35px] border border-slate-100 p-8 shadow-xl shadow-slate-100/50">
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-3 mb-8 uppercase">
                    <Target className="text-blue-600" /> Savollar tahlili
                </h2>
                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
                    {review.map((item: any, index: number) => (
                        <div key={index} className="group relative">
                            <div className={`w-full aspect-square rounded-2xl flex items-center justify-center font-black text-sm transition-all border
                                ${item.is_correct 
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-500 hover:text-white' 
                                    : 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-500 hover:text-white'}`}>
                                {item.question_number}
                            </div>
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-900 text-white rounded-xl text-[10px] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20">
                                <p className="opacity-60 uppercase font-black mb-1">Savol {item.question_number}</p>
                                <p className="font-bold">Siz: <span className={item.is_correct ? "text-emerald-400" : "text-rose-400"}>{item.user_answer || "—"}</span></p>
                                {!item.is_correct && <p className="font-bold border-t border-white/10 mt-1 pt-1">Asli: <span className="text-emerald-400">{item.correct_answer}</span></p>}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function StatItem({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex flex-col items-center py-2 px-4 text-center">
            <div className="text-slate-400 mb-1">{icon}</div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{label}</span>
            <span className="text-sm font-bold text-slate-700">{value}</span>
        </div>
    )
}