"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    Search, Clock, ArrowRight, Lock,
    Layout, BookOpen, Headphones, PenTool, Trophy,
    Loader2, Coins, CheckCircle2, ShoppingBag, Sparkles, Layers
} from "lucide-react"
import { getMyMockExamsAPI } from "@/lib/api/mock"
import { ApiMockExam } from "@/lib/types/mock"
import { toast } from "sonner"

type ViewTab = "all" | "mine";

export default function ExamsListPage() {
    const router = useRouter()
    const [view, setView] = useState<ViewTab>("all") // Hozirgi tanlangan tab
    const [searchQuery, setSearchQuery] = useState("")
    const [exams, setExams] = useState<ApiMockExam[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await getMyMockExamsAPI()
                setExams(response.data)
            } catch (error: any) {
                console.error("Failed to load exams:", error)
                toast.error("Imtihonlarni yuklashda xatolik yuz berdi")
            } finally {
                setLoading(false)
            }
        }
        fetchExams()
    }, [])

    // Filtrlash mantiqi (Tab va Qidiruv birgalikda)
    const filteredExams = useMemo(() => {
        return exams.filter(exam => {
            const matchesTab = view === "all" ? true : (exam.is_purchased || exam.is_free);
            const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                exam.description?.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesTab && matchesSearch;
        })
    }, [exams, view, searchQuery])

    const handleCardClick = (exam: ApiMockExam) => {
        if (!exam.is_active) {
            toast.warning("Bu imtihon hozircha faol emas")
            return
        }
        router.push(`/dashboard/exams/view?id=${exam.id}`)
    }

    const getExamStyle = (title: string) => {
        const t = title.toLowerCase()
        if (t.includes("ielts")) return { color: "purple", icon: Layout }
        if (t.includes("cefr")) return { color: "blue", icon: BookOpen }
        if (t.includes("writing")) return { color: "orange", icon: PenTool }
        if (t.includes("listening")) return { color: "emerald", icon: Headphones }
        return { color: "teal", icon: Trophy }
    }

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center flex-col gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-[#17776A]" />
                <p className="text-slate-400 font-medium animate-pulse uppercase tracking-widest text-[10px]">Yuklanmoqda...</p>
            </div>
        )
    }

    return (
        <div className="max-w-[1600px] mx-auto p-6 md:p-10 space-y-10 pb-20">

            {/* HEADER & TABS */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
                <div>
                    <div className="flex items-center gap-2 text-[#17776A] mb-1">
                        <Sparkles size={18} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Mock Center</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Imtihonlar</h2>
                    <p className="text-slate-500 font-medium mt-1 text-sm">Bilimingizni sinash uchun mavjud barcha mock testlar.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* TABS BUTTONS */}
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full sm:w-auto">
                        <button
                            onClick={() => setView("all")}
                            className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2
                                ${view === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                        >
                            <Layers size={14} /> Barcha
                        </button>
                        <button
                            onClick={() => setView("mine")}
                            className={`flex-1 sm:flex-none px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2
                                ${view === "mine" ? "bg-white text-[#17776A] shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                        >
                            <CheckCircle2 size={14} /> Mening imtihonlarim
                        </button>
                    </div>

                    {/* SEARCH */}
                    <div className="relative group w-full sm:w-72">
                        <input
                            type="text"
                            placeholder="Izlash..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-12 pr-4 text-xs font-bold focus:ring-2 focus:ring-[#17776A] transition-all outline-none"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#17776A] transition-colors">
                            <Search size={18} />
                        </div>
                    </div>
                </div>
            </div>

            {/* GRID */}
            {filteredExams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    <AnimatePresence mode="popLayout">
                        {filteredExams.map((exam, index) => {
                            const style = getExamStyle(exam.title)
                            const isMine = exam.is_free || exam.is_purchased

                            return (
                                <motion.div
                                    layout
                                    key={exam.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => handleCardClick(exam)}
                                    className={`group relative overflow-hidden p-8 rounded-[40px] border-2 transition-all duration-500
                                        ${!exam.is_active ? 'bg-slate-50 opacity-80 cursor-not-allowed border-transparent' :
                                            isMine ? `bg-white border-emerald-100 cursor-pointer hover:shadow-2xl hover:shadow-emerald-100 hover:-translate-y-1` :
                                                `bg-white border-slate-50 cursor-pointer hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1`}`}
                                >
                                    {/* Background Decor */}
                                    <div className={`absolute top-0 right-0 w-40 h-40 bg-${style.color}-50 rounded-bl-[100px] -mr-12 -mt-12 transition-transform group-hover:scale-110 duration-700`}></div>

                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className={`w-14 h-14 bg-${style.color}-50 text-${style.color}-600 border border-${style.color}-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:rotate-6 transition-transform duration-500`}>
                                                <style.icon size={28} />
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white shadow-lg shadow-slate-900/10`}>
                                                    {exam.cefr_level}
                                                </span>
                                                {isMine && (
                                                    <span className="flex items-center gap-1.5 text-[8px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 uppercase tracking-widest">
                                                        <CheckCircle2 size={10} /> FAOL
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-8 flex-1">
                                            <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-tight mb-3 group-hover:text-[#17776A] transition-colors">
                                                {exam.title}
                                            </h3>
                                            <p className="text-slate-400 text-xs font-bold leading-relaxed uppercase tracking-wider line-clamp-2">
                                                {exam.description || "To'liq mock imtihon formati."}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                <Clock size={14} /> {exam.duration_minutes} MIN
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                <Coins size={14} /> {exam.is_free ? "BEPUL" : `${(exam.price).toLocaleString()}`}
                                            </div>
                                        </div>

                                        <div className={`mt-auto flex items-center justify-between border-t border-slate-50 pt-6`}>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">Status</span>
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${exam.is_active ? "text-emerald-600" : "text-red-500"}`}>
                                                    {exam.is_active ? (isMine ? "Ishlashga tayyor" : "Sotuvda mavjud") : "Yopiq"}
                                                </span>
                                            </div>

                                            <button className={`w-14 h-14 rounded-[22px] flex items-center justify-center transition-all shadow-xl
                                                ${!exam.is_active ? 'bg-slate-100 text-slate-300 cursor-not-allowed' :
                                                    isMine ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/20' :
                                                        'bg-slate-900 text-white hover:bg-[#17776A] shadow-slate-900/20 group-hover:scale-110'}`}>
                                                {!exam.is_active ? <Lock size={20} /> : isMine ? <ArrowRight size={24} /> : <ShoppingBag size={22} />}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[48px] border-2 border-dashed border-slate-200">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
                        <Search size={40} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 uppercase italic">Ma'lumot topilmadi</h3>
                    <p className="text-slate-400 text-sm font-medium mt-2">Ushbu ruknda hozircha imtihonlar mavjud emas.</p>
                </div>
            )}
        </div>
    )
}