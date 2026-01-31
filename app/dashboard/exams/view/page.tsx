"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    Headphones, Clock, FileText, Lock, ChevronRight, ChevronLeft,
    Loader2, Zap, Activity, Search, Filter, PlayCircle, Star,
    ShieldCheck, Globe, Users, Layout, Sparkles, CheckCircle2,
    MonitorPlay, HelpCircle, Unlock, Download, Target,
    MessageSquare,
    ChevronUp,
    ChevronDown,
    AlertCircle
} from "lucide-react"

import { Badge } from "@/components/ui/badge"

// --- TYPES ---
interface ExamDetail {
    id: string
    title: string
    shortDesc: string
    description: string
    category: "IELTS" | "CEFR" | "General"
    level: "Easy" | "Medium" | "Hard"
    questions: number
    duration: number
    usersCount: number
    price: number
    rating: number
    reviewsCount: number
    color: string
    isPurchased: boolean
    author: { name: string, role: string, avatar: string }
    sections: { id: number, title: string, count: number, type: string }[]
    requirements: string[]
    skills: string[]
}

// --- MOCK DATA ---
const MOCK_EXAM: ExamDetail = {
    id: "ielts-mock-1",
    title: "IELTS Full Mock: Academic Module",
    shortDesc: "Rasmiy Cambridge standartlari asosida tuzilgan to'liq imtihon simulyatsiyasi.",
    description: "Ushbu kurs nafaqat test, balki to'liq o'quv tajribasidir. Siz Listening, Reading va Writing ko'nikmalaringizni real vaqt rejimida sinovdan o'tkazasiz. Natijalar AI va Ekspert o'qituvchilar tomonidan tekshiriladi.",
    category: "IELTS",
    level: "Hard",
    questions: 80,
    duration: 160,
    usersCount: 1540,
    price: 45000,
    rating: 4.9,
    reviewsCount: 124,
    color: "purple",
    isPurchased: false,
    author: { name: "Mr. Simon", role: "Ex-IELTS Examiner", avatar: "https://i.pravatar.cc/150?u=simon" },
    sections: [
        { id: 1, title: "Listening Part 1: Social Context", count: 10, type: "Audio" },
        { id: 2, title: "Listening Part 2: Monologue", count: 10, type: "Audio" },
        { id: 3, title: "Reading Passage 1", count: 13, type: "Text" },
        { id: 4, title: "Writing Task 2", count: 1, type: "Essay" },
    ],
    requirements: ["Laptop yoki PC", "Headphones", "Stabil internet"],
    skills: ["Time Management", "Critical Thinking", "Vocabulary", "Grammar"]
}

// --- SYLLABUS COMPONENT (Accordion) ---
const SyllabusItem = ({ section, index }: { section: any, index: number }) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div className="border border-slate-100 rounded-[24px] bg-white mb-3 overflow-hidden transition-all hover:border-purple-200 hover:shadow-sm">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 bg-slate-50/30 hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-500 text-sm font-black shadow-sm group-hover:text-purple-600">
                        {index + 1}
                    </div>
                    <div className="text-left">
                        <span className="block text-sm font-black text-slate-800 tracking-tight">{section.title}</span>
                    </div>
                </div>
                {isOpen ? <div className="bg-purple-100 p-1 rounded-lg text-purple-600"><ChevronUp size={18} /></div> : <div className="bg-slate-100 p-1 rounded-lg text-slate-400"><ChevronDown size={18} /></div>}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-50"
                    >
                        <div className="p-5 flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-white">
                            <span className="flex items-center gap-1.5"><HelpCircle size={14} className="text-purple-400" /> {section.count} SAVOL</span>
                            <span className="flex items-center gap-1.5"><MonitorPlay size={14} className="text-blue-400" /> {section.type}</span>
                            <span className="flex items-center gap-1.5 text-emerald-600 ml-auto"><Unlock size={14} /> OCHIQ</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function ExamViewLogic() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [exam, setExam] = useState<ExamDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("overview")

    useEffect(() => {
        const foundExam = MOCK_EXAM
        setTimeout(() => {
            setExam(foundExam)
            setLoading(false)
        }, 500)
    }, [])

    const handleAction = () => {
        if (!exam) return;
        if (exam.isPurchased || exam.price === 0) {
            router.push(`/dashboard/test/listening?id=${exam.id}`)
        } else {
            router.push(`/dashboard/payment?examId=${exam.id}`)
        }
    }

    if (loading) return <div className="h-screen flex items-center justify-center bg-[#F8FAFC]"><Loader2 className="animate-spin text-purple-600 w-10 h-10" /></div>
    if (!exam) return null

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-20 px-2 sm:px-0 pt-6">

            {/* --- BACK BUTTON --- */}
            <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => router.back()}
                className="group flex items-center gap-3 text-slate-400 hover:text-purple-600 transition-all"
            >
                <div className="w-9 h-9 rounded-2xl bg-white border border-slate-100 flex items-center justify-center group-hover:bg-purple-50 group-hover:border-purple-200 shadow-sm transition-all">
                    <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Orqaga qaytish</span>
            </motion.button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* --- LEFT COLUMN (8 cols) --- */}
                <div className="lg:col-span-8 space-y-8">

                    {/* 1. TOP HERO & STATS BLOCK (ListeningPage style) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* HERO CARD */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="p-8 rounded-[32px] bg-gradient-to-br from-blue-900 to-blue-600 text-white relative overflow-hidden shadow-2xl shadow-slate-200 border border-slate-700 md:col-span-2"
                        >
                            <div className="relative z-10">
                                <div className="flex flex-wrap gap-3 mb-6">
                                    <div className="flex items-center gap-2 bg-white/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-md border border-white/5">
                                        <Layout size={14} className="text-white" />
                                        <span className="text-[10px] font-black uppercase tracking-widest opacity-90">{exam.category}</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-purple-600 w-fit px-3 py-1.5 rounded-full shadow-lg shadow-purple-900/20">
                                        <Sparkles size={14} className="text-yellow-300 fill-yellow-300" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{exam.level}</span>
                                    </div>
                                </div>

                                <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight">
                                    {exam.title}
                                </h2>
                                <p className="text-slate-300 text-sm font-medium max-w-xl opacity-90 leading-relaxed">
                                    {exam.shortDesc}
                                </p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mt-6">
                                    {exam.skills.map((skill, i) => (
                                        <span key={i} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-slate-300 flex items-center gap-2 backdrop-blur-sm uppercase tracking-wider">
                                            <CheckCircle2 size={12} className="text-emerald-400" /> {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="absolute inset-0 opacity-[0.7] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
                            {/* Decorative Glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600 rounded-full opacity-20 blur-[80px] -mr-10 -mt-10 pointer-events-none"></div>
                        </motion.div>

                        {/* STATS ROW (Inside Left Col) */}
                        <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { label: "Vaqt", val: `${exam.duration} m`, icon: Clock, color: "text-blue-500" },
                                { label: "Savollar", val: exam.questions, icon: HelpCircle, color: "text-purple-500" },
                                { label: "Qatnashchilar", val: exam.usersCount, icon: Users, color: "text-emerald-500" },
                                { label: "Reyting", val: exam.rating, icon: Star, color: "text-yellow-500" }
                            ].map((stat, i) => (
                                <div key={i} className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
                                    <stat.icon size={20} className={`mb-2 ${stat.color}`} />
                                    <span className="text-lg font-black text-slate-900 tracking-tight">{stat.val}</span>
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* TABS CONTENT */}
                    <div className="bg-white rounded-[32px] p-6 sm:p-8 border border-slate-100 shadow-sm">
                        {/* Custom Tabs */}
                        <div className="flex p-1.5 bg-slate-50 rounded-2xl mb-8 w-fit gap-1">
                            {["overview", "curriculum", "reviews"].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                                        ${activeTab === tab
                                            ? "bg-white text-slate-900 shadow-sm"
                                            : "text-slate-400 hover:text-slate-600"}`}
                                >
                                    {tab === "overview" ? "Tavsif" : tab === "curriculum" ? "Tarkib" : "Sharhlar"}
                                </button>
                            ))}
                        </div>

                        <div className="min-h-[200px]">
                            {activeTab === "overview" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2"><FileText size={18} className="text-blue-500" /> Umumiy Ma'lumot</h3>
                                        <p className="text-slate-500 leading-relaxed font-medium text-sm">{exam.description}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100">
                                            <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <Target size={16} className="text-purple-500" /> Nimaga ega bo'lasiz?
                                            </h4>
                                            <ul className="space-y-3">
                                                {["Real imtihon muhiti", "AI tekshiruvi (Writing/Speaking)", "Batafsil tahlil va xatolar", "Sertifikat"].map((item, i) => (
                                                    <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100">
                                            <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <AlertCircle size={16} className="text-orange-500" /> Talablar
                                            </h4>
                                            <ul className="space-y-3">
                                                {exam.requirements.map((req, i) => (
                                                    <li key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                                        {req}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === "curriculum" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                                    <div className="flex justify-between items-center mb-4 px-2">
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Kurs Dasturi</h3>
                                        <Badge variant="secondary" className="bg-purple-50 text-purple-600 rounded-full px-3 py-0.5 border-none font-black text-[10px]">
                                            {exam.questions} SAVOL
                                        </Badge>
                                    </div>
                                    {exam.sections.map((sec, i) => (
                                        <SyllabusItem key={sec.id} section={sec} index={i} />
                                    ))}
                                </motion.div>
                            )}

                            {activeTab === "reviews" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <MessageSquare size={32} className="text-slate-300" />
                                    </div>
                                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Hozircha sharhlar mavjud emas</p>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN (4 cols) - Sticky Sidebar --- */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="sticky top-6 space-y-6">

                        {/* Pricing Card */}
                        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500"></div>

                            <div className="relative z-10 text-center">
                                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mb-2">Jami qiymat</p>
                                <div className="flex items-end justify-center gap-1 mb-8">
                                    {exam.price === 0 ? (
                                        <span className="text-5xl font-black tracking-tighter text-emerald-500">BEPUL</span>
                                    ) : (
                                        <>
                                            <span className="text-4xl font-black tracking-tighter text-slate-900">{exam.price.toLocaleString()}</span>
                                            <span className="text-sm font-bold text-slate-400 mb-1.5">so'm</span>
                                        </>
                                    )}
                                </div>

                                <button
                                    onClick={handleAction}
                                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-purple-600 transition-all shadow-lg shadow-slate-200 active:scale-95 flex items-center justify-center gap-3 group/btn"
                                >
                                    {exam.isPurchased ? "Davom ettirish" : (exam.price === 0 ? "Boshlash" : "Xarid qilish")}
                                    <PlayCircle size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>

                                <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-3">
                                    <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                        <ShieldCheck size={14} className="text-emerald-500" /> Rasmiy sertifikat
                                    </div>
                                    <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                        <Globe size={14} className="text-blue-500" /> 24/7 Online kirish
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Author Mini Profile */}
                        <div className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
                            <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-white shadow-md flex items-center justify-center overflow-hidden font-bold text-slate-500">
                                {exam.author.avatar.includes('http') ? (
                                    <img src={exam.author.avatar} alt="Author" className="w-full h-full object-cover" />
                                ) : (
                                    exam.author.avatar
                                )}
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Test Muallifi</p>
                                <h4 className="font-bold text-slate-900 text-sm">{exam.author.name}</h4>
                                <p className="text-[10px] font-bold text-purple-600">{exam.author.role}</p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            {/* MOBILE FIXED BOTTOM BAR */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 lg:hidden z-50 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <div className="flex gap-4 items-center">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Narxi</span>
                        <span className="text-xl font-black text-slate-900 leading-none">
                            {exam.price === 0 ? "BEPUL" : `${exam.price.toLocaleString()} so'm`}
                        </span>
                    </div>
                    <button
                        onClick={handleAction}
                        className="flex-1 py-3.5 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    >
                        {exam.isPurchased ? "Davom ettirish" : "Xarid qilish"}
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Styles */}
            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .pb-safe { padding-bottom: env(safe-area-inset-bottom); }
            `}</style>
        </div>
    )
}

export default function ExamViewPage() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#F8FAFC]"><Loader2 className="animate-spin text-purple-600 w-10 h-10" /></div>}>
            <ExamViewLogic />
        </Suspense>
    )
}