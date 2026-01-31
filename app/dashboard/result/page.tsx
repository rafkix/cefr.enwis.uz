"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
    Calendar, CheckCircle2, Loader2, FileText,
    ChevronRight, Headphones, BookOpen,
    Activity, Trophy, Target, ArrowUpRight
} from "lucide-react"

import { getMyListeningResultsAPI } from "@/lib/api/listening"
import { getMyReadingResultsAPI } from "@/lib/api/reading"

// --- TYPES ---
interface ResultItem {
    id: string
    exam_id: string
    section: 'LISTENING' | 'READING'
    created_at: string
    raw_score: number
    correct_answers?: number
    total_questions: number
    cefr_level: string
    standard_score: number
}

export default function ResultPage() {
    const [results, setResults] = useState<ResultItem[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'all' | 'listening' | 'reading'>('all')

    useEffect(() => {
        const fetchAllResults = async () => {
            try {
                setLoading(true)
                const [listeningRes, readingRes] = await Promise.all([
                    getMyListeningResultsAPI().catch(() => ({ data: [] })),
                    getMyReadingResultsAPI().catch(() => ({ data: [] }))
                ])

                // @ts-ignore
                const combined = [
                    ...(Array.isArray(listeningRes.data)
                        ? listeningRes.data.map((item: any) => ({ ...item, section: 'LISTENING' }))
                        : []),
                    ...(Array.isArray(readingRes.data)
                        ? readingRes.data.map((item: any) => ({ ...item, section: 'READING' }))
                        : [])
                ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

                setResults(combined)
            } catch (error) {
                console.error("Error loading results:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchAllResults()
    }, [])

    // --- LOGIC ---
    const filteredResults = results.filter(item =>
        activeTab === 'all' ? true : item.section.toLowerCase() === activeTab
    )

    const totalAttempts = results.length
    const avgScore = results.length > 0
        ? Math.round(results.reduce((acc, curr) => acc + (curr.standard_score || 0), 0) / results.length)
        : 0

    // --- HELPERS ---
    const formatDate = (dateString: string) => {
        if (!dateString) return "—"
        return new Date(dateString).toLocaleDateString('uz-UZ', {
            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
        })
    }

    // Dynamic Colors Helper
    const getTheme = (section: string) => {
        const isReading = section === 'READING'
        return {
            bg: isReading ? 'bg-blue-50' : 'bg-purple-50',
            text: isReading ? 'text-blue-600' : 'text-purple-600',
            border: isReading ? 'border-blue-200' : 'border-purple-200',
            icon: isReading ? BookOpen : Headphones
        }
    }

    const getLevelStyle = (level: string) => {
        const l = level?.toUpperCase() || ""
        switch (l) {
            case 'C1': return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' }
            case 'B2': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' }
            case 'B1': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' }
            default: return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' }
        }
    }

    return (
        <div className="min-h-screen pb-10 font-sans text-slate-800 pt-6">

            <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8">

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

                    {/* --- LEFT COLUMN: RESULTS LIST (3/4 qism) --- */}
                    <div className="xl:col-span-3 space-y-6">

                        {/* Header & Tabs */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Natijalar</h2>
                                <p className="text-sm text-slate-500 font-medium">Barcha urinishlaringiz tarixi</p>
                            </div>
                            <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                                {["all", "listening", "reading"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as any)}
                                        className={`px-5 py-2 rounded-lg text-xs font-bold capitalize transition-all
                                            ${activeTab === tab
                                                ? "bg-slate-900 text-white shadow-md"
                                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
                                    >
                                        {tab === "all" ? "Barchasi" : tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* List Container */}
                        <div className="space-y-3">
                            {loading ? (
                                <div className="py-20 flex flex-col items-center justify-center">
                                    <Loader2 className="animate-spin text-slate-400 w-8 h-8 mb-2" />
                                    <span className="text-xs font-medium text-slate-400">Yuklanmoqda...</span>
                                </div>
                            ) : (
                                <AnimatePresence mode="popLayout">
                                    {filteredResults.map((item, index) => {
                                        const theme = getTheme(item.section)
                                        const levelStyle = getLevelStyle(item.cefr_level)

                                        return (
                                            <motion.div
                                                layout
                                                key={`${item.section}-${item.id}`}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.98 }}
                                                transition={{ delay: index * 0.03 }}
                                                className="group bg-white rounded-[20px] p-5 border border-slate-100 hover:border-slate-300 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                                            >
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">

                                                    {/* --- LEFT SECTION: Icon & Main Info --- */}
                                                    <div className="flex items-center gap-5 flex-1 min-w-0 w-full">

                                                        {/* Icon Box */}
                                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${theme.bg} ${theme.text}`}>
                                                            <theme.icon size={24} />
                                                        </div>

                                                        {/* Text Info */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                                                                    #{item.exam_id}
                                                                </span>
                                                                <span className="text-xs font-medium text-slate-400 flex items-center gap-1 whitespace-nowrap">
                                                                    <Calendar size={12} /> {formatDate(item.created_at)}
                                                                </span>
                                                            </div>

                                                            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide truncate">
                                                                {item.section} TEST
                                                            </h3>

                                                            {/* Mobile Only: Correct Answers */}
                                                            <div className="md:hidden mt-1 text-xs font-medium text-slate-500 flex items-center gap-1">
                                                                <CheckCircle2 size={12} className="text-emerald-500" />
                                                                {item.raw_score ?? item.correct_answers ?? 0}/{item.total_questions || 40}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* --- MIDDLE SECTION: Desktop Stats (Hidden on Mobile) --- */}
                                                    <div className="hidden md:flex flex-col items-center px-6 border-l border-slate-100 shrink-0">
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">To'g'ri Javoblar</span>
                                                        <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                                                            <CheckCircle2 size={16} className="text-emerald-500" />
                                                            {item.raw_score ?? item.correct_answers ?? 0} / {item.total_questions || 40}
                                                        </span>
                                                    </div>

                                                    {/* --- RIGHT SECTION: Score & Level & Action --- */}
                                                    {/* flex-wrap: Mobil ekranlarda sig'may qolsa pastga tushib ketishiga yo'l qo'yadi (yoki aksincha nowrap bilan siqib qo'yadi).
    shrink-0: O'ng taraf qisqarib ketmasligi uchun.
*/}
                                                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto border-t sm:border-t-0 border-slate-100 pt-4 sm:pt-0 shrink-0">

                                                        {/* Score (Ball) */}
                                                        <div className="text-right min-w-[60px]">
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5 tracking-wide">Score</p>
                                                            <p className={`text-xl font-black ${theme.text}`}>
                                                                {item.standard_score ?? 0}
                                                            </p>
                                                        </div>

                                                        {/* Level Badge (Daraja) */}
                                                        {/* w-12 h-12: Kvadrat shaklida. Flex col va center: Matnni o'rtaga joylash uchun. */}
                                                        <div className={`flex flex-col items-center justify-center w-28 h-12 rounded-xl border ${levelStyle.bg} ${levelStyle.text} ${levelStyle.border}`}>
                                                            <span className="text-sm font-bold">{item.cefr_level || "-"}</span>
                                                        </div>

                                                        {/* Action Button (Ko'rish tugmasi) */}
                                                        <Link
                                                            href={`/dashboard/result/${item.section.toLowerCase()}/view?id=${item.id}`}
                                                            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm group-hover:shadow-md"
                                                            title="Batafsil ko'rish"
                                                        >
                                                            <ArrowUpRight size={20} />
                                                        </Link>

                                                    </div>
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </AnimatePresence>
                            )}

                            {!loading && filteredResults.length === 0 && (
                                <div className="text-center py-20 bg-white rounded-[24px] border border-dashed border-slate-300">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                        <FileText size={24} />
                                    </div>
                                    <p className="text-slate-500 font-medium text-sm">Hozircha natijalar yo'q</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: STATS SIDEBAR (1/4 qism) --- */}
                    <div className="xl:col-span-1 space-y-6">
                        <div className="sticky top-8 space-y-6">

                            {/* Stats Card */}
                            <div className="bg-slate-900 rounded-[24px] p-6 text-white shadow-xl shadow-slate-200">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-white/10 rounded-lg">
                                        <Activity size={20} />
                                    </div>
                                    <span className="font-bold text-sm">Umumiy Statistika</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                                        <p className="text-slate-400 text-xs font-medium">Jami Urinishlar</p>
                                        <p className="text-2xl font-bold flex items-center gap-2">
                                            <Trophy size={18} className="text-yellow-500" /> {totalAttempts}
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className="text-slate-400 text-xs font-medium">O'rtacha Ball</p>
                                        <p className="text-2xl font-bold flex items-center gap-2">
                                            <Target size={18} className="text-blue-400" /> {avgScore}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Stats */}
                            <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-6">Faollik</h3>
                                <div className="space-y-6">
                                    {/* Reading Bar */}
                                    <div>
                                        <div className="flex justify-between mb-2 text-sm">
                                            <span className="font-medium text-slate-600 flex items-center gap-2">
                                                <BookOpen size={16} className="text-blue-500" /> Reading
                                            </span>
                                            <span className="font-bold text-slate-900">{results.filter(r => r.section === 'READING').length}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${totalAttempts ? (results.filter(r => r.section === 'READING').length / totalAttempts) * 100 : 0}%` }}></div>
                                        </div>
                                    </div>

                                    {/* Listening Bar */}
                                    <div>
                                        <div className="flex justify-between mb-2 text-sm">
                                            <span className="font-medium text-slate-600 flex items-center gap-2">
                                                <Headphones size={16} className="text-purple-500" /> Listening
                                            </span>
                                            <span className="font-bold text-slate-900">{results.filter(r => r.section === 'LISTENING').length}</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                            <div className="bg-purple-500 h-full rounded-full" style={{ width: `${totalAttempts ? (results.filter(r => r.section === 'LISTENING').length / totalAttempts) * 100 : 0}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}