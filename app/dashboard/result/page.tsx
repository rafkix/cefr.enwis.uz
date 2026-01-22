"use client"

import { useEffect, useState } from "react"
import { getMyListeningResultsAPI } from "@/lib/api/listening"
import { getMyReadingResultsAPI } from "@/lib/api/reading"
import { 
    Calendar, CheckCircle2, Loader2, FileText, 
    ChevronRight, Headphones, BookOpen, 
    ArrowRight, Activity, Award
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function ResultPage() {
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAllResults = async () => {
            try {
                setLoading(true)
                const [listeningRes, readingRes] = await Promise.all([
                    getMyListeningResultsAPI().catch(() => ({ data: [] })),
                    getMyReadingResultsAPI().catch(() => ({ data: [] }))
                ])

                const combined = [
                    ...(Array.isArray(listeningRes.data) 
                        ? listeningRes.data.map(item => ({ ...item, section: 'LISTENING' })) 
                        : []),
                    ...(Array.isArray(readingRes.data) 
                        ? readingRes.data.map(item => ({ ...item, section: 'READING' })) 
                        : [])
                ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

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
            day: 'numeric', month: 'short', year: 'numeric'
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
        <div className="space-y-6 md:space-y-8 pb-10 px-2 sm:px-0">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase italic">Natijalar</h1>
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest mt-1">O'quv jarayoningiz statistikasi</p>
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3 w-fit">
                    <Activity className="text-blue-500" size={18} />
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase leading-none tracking-tighter">Jami Urinishlar</p>
                        <p className="text-base font-black text-slate-800 leading-none mt-1">{results.length}</p>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
                    <p className="font-black text-slate-400 uppercase tracking-widest text-[9px]">Yuklanmoqda...</p>
                </div>
            ) : results.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {/* DESKTOP TABLE (Faqat MD va undan katta ekranlar uchun) */}
                    <div className="hidden md:block bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Bo'lim</th>
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
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${res.section === 'READING' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                                    {res.section === 'READING' ? <BookOpen size={20} /> : <Headphones size={20} />}
                                                </div>
                                                <p className="text-xs font-black text-slate-900 uppercase">#{res.exam_id}</p>
                                            </div>
                                        </td>
                                        <td className="p-6 text-xs font-bold text-slate-500">{formatDate(res.created_at)}</td>
                                        <td className="p-6 text-center font-bold text-xs">{res.raw_score ?? res.correct_answers ?? 0} / {res.total_questions || 40}</td>
                                        <td className="p-6 text-center">
                                            <span className={`px-3 py-1 rounded-lg text-[9px] font-black border uppercase ${getLevelBadge(res.cefr_level)}`}>
                                                {res.cefr_level || "N/A"}
                                            </span>
                                        </td>
                                        <td className="p-6 text-center font-black text-lg text-slate-800">{res.standard_score ?? 0}</td>
                                        <td className="p-6 text-right">
                                            <Link href={`/dashboard/result/${(res.section || 'reading').toLowerCase()}/${res.id}`}
                                                className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white transition-all">
                                                <ChevronRight size={18} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* MOBILE CARDS (Faqat kichik ekranlar uchun) */}
                    <div className="md:hidden space-y-4">
                        <AnimatePresence>
                            {results.map((res, index) => (
                                <motion.div 
                                    key={`${res.section}-${res.id}`}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white p-5 rounded-[30px] border border-slate-100 shadow-sm relative overflow-hidden"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${res.section === 'READING' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                                {res.section === 'READING' ? <BookOpen size={18} /> : <Headphones size={18} />}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{res.section}</p>
                                                <p className="text-sm font-black text-slate-900 uppercase leading-none">Exam #{res.exam_id}</p>
                                            </div>
                                        </div>
                                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black border uppercase italic ${getLevelBadge(res.cefr_level)}`}>
                                            {res.cefr_level || "N/A"}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50">
                                        <div>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">To'g'ri javoblar</p>
                                            <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                                <CheckCircle2 size={12} className="text-emerald-500" />
                                                {res.raw_score ?? res.correct_answers ?? 0} / {res.total_questions || 40}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Topshirilgan sana</p>
                                            <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                                <Calendar size={12} className="text-slate-400" />
                                                {formatDate(res.created_at)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div>
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Standard Score</p>
                                            <p className={`text-2xl font-black tracking-tighter ${res.section === 'READING' ? 'text-blue-600' : 'text-purple-600'}`}>
                                                {res.standard_score ?? 0}
                                            </p>
                                        </div>
                                        <Link 
                                            href={`/dashboard/result/${(res.section || 'reading').toLowerCase()}/${res.id}`}
                                            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-200"
                                        >
                                            Tahlil <ChevronRight size={14} />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            ) : (
                <div className="py-20 text-center bg-white rounded-[40px] border border-slate-100 shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-[30px] flex items-center justify-center mx-auto mb-6">
                        <FileText size={40} className="text-slate-200" />
                    </div>
                    <h3 className="text-lg font-black text-slate-800 mb-1 uppercase">Hali natijalar yo'q</h3>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-8">Testni topshirib natijangizni ko'ring</p>
                    <Link href="/dashboard/test/reading" className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase shadow-xl hover:bg-blue-700 transition-all">
                        Testni boshlash <ArrowRight size={16} />
                    </Link>
                </div>
            )}
        </div>
    )
}