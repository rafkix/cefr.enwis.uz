"use client"

import { useEffect, useState, useMemo } from "react"
import { getMyListeningResultsAPI } from "@/lib/api/listening"
import { getMyReadingResultsAPI } from "@/lib/api/reading"
import { 
    Calendar, CheckCircle2, Loader2, FileText, 
    Award, ChevronRight, Headphones, BookOpen, 
    ArrowRight, Activity
} from "lucide-react"
import Link from "next/link"

export default function ResultPage() {
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // 1. DATA FETCHING
    useEffect(() => {
        const fetchAllResults = async () => {
            try {
                setLoading(true)
                const [listeningRes, readingRes] = await Promise.all([
                    getMyListeningResultsAPI().catch(() => ({ data: [] })),
                    getMyReadingResultsAPI().catch(() => ({ data: [] }))
                ])

                // Ma'lumotlarni xavfsiz birlashtirish
                const combined = [
                    ...(Array.isArray(listeningRes.data) 
                        ? listeningRes.data.map(item => ({ ...item, section: 'LISTENING' })) 
                        : []),
                    ...(Array.isArray(readingRes.data) 
                        ? readingRes.data.map(item => ({ ...item, section: 'READING' })) 
                        : [])
                ].sort((a, b) => {
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                })

                setResults(combined)
            } catch (error) {
                console.error("Natijalarni yuklashda xato:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchAllResults()
    }, [])

    const formatDate = (dateString: string) => {
        if (!dateString) return "—"
        return new Date(dateString).toLocaleDateString('uz-UZ', {
            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        })
    }

    const getLevelBadge = (level: string) => {
        const l = level?.toUpperCase() || ""
        switch(l) {
            case 'C1': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'B2': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'B1': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    }

    return (
        <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Mening Natijalarim</h1>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">O'quv jarayoningiz statistikasi va tahlili</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                        <Activity className="text-blue-500" size={20} />
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Jami Urinishlar</p>
                            <p className="text-lg font-black text-slate-800 leading-none mt-1">{results.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABLE CONTAINER */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <Loader2 className="w-12 h-12 animate-spin mb-4 text-blue-600" />
                        <p className="font-black text-slate-400 uppercase tracking-widest text-[10px]">Ma'lumotlar yuklanmoqda...</p>
                    </div>
                ) : results.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bo'lim & ID</th>
                                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sana</th>
                                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Natija</th>
                                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Daraja</th>
                                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Ball</th>
                                    <th className="p-6"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {results.map((res) => (
                                    <tr key={`${res.section}-${res.id}`} className="hover:bg-slate-50/80 transition-all group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-inner 
                                                    ${res.section === 'READING' 
                                                        ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white' 
                                                        : 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white'}`}>
                                                    {res.section === 'READING' ? <BookOpen size={22} /> : <Headphones size={22} />}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-slate-900 tracking-tight uppercase">#{res.exam_id}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{res.section}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-slate-300" />
                                                <p className="text-xs font-bold text-slate-600">{formatDate(res.created_at)}</p>
                                            </div>
                                        </td>
                                        <td className="p-6 text-center">
                                            <span className="inline-flex items-center font-black text-blue-700 bg-slate-100 px-3 py-1.5 rounded-xl text-[10px] border border-slate-200">
                                                <CheckCircle2 size={12} className="mr-1.5 text-slate-400" />
                                                {res.raw_score ?? res.correct_answers ?? 0} / {res.total_questions || 40}
                                            </span>
                                        </td>
                                        <td className="p-6 text-center">
                                            <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black border uppercase italic ${getLevelBadge(res.cefr_level)}`}>
                                                {res.cefr_level || "N/A"}
                                            </span>
                                        </td>
                                        <td className="p-6 text-center">
                                            <p className={`font-black text-xl tracking-tighter ${res.section === 'READING' ? 'text-blue-600' : 'text-purple-600'}`}>
                                                {res.standard_score ?? 0}
                                            </p>
                                        </td>
                                        <td className="p-6 text-right">
                                            {/* Himoyalangan Link: section mavjudligi tekshiriladi */}
                                            <Link 
                                                href={`/dashboard/result/${(res.section || 'reading').toLowerCase()}/${res.id}`}
                                                className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm group-hover:scale-110"
                                            >
                                                <ChevronRight size={20} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-32 text-center">
                        <div className="w-24 h-24 bg-slate-50 rounded-[30px] flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-slate-200">
                            <FileText size={48} className="text-slate-200" />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-2 uppercase italic">Hali natijalar yo'q</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">Siz hali birorta ham imtihon topshirmadingiz</p>
                        <Link 
                            href="/dashboard/test/reading" 
                            className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-blue-700 transition-all active:scale-95"
                        >
                            Testni boshlash <ArrowRight size={18} />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}