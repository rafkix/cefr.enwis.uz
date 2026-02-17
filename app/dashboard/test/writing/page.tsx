"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    Pencil, Clock, ChevronRight, ChevronLeft, Search, Inbox,
    Filter, Activity, Lock, Sparkles, PenTool, Edit3, Loader2
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
// API xizmatlarini import qilamiz
import { getAllWritingExamsAPI } from "@/lib/api/writing" 
import { WritingExam } from "@/lib/types/writing"

export default function WritingListPage() {
    const router = useRouter()
    
    // --- STATE ---
    const [exams, setExams] = useState<WritingExam[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<'all' | 'free' | 'premium'>('all')
    const [searchTerm, setSearchTerm] = useState("")

    // --- API DAN MA'LUMOTLARNI OLISH ---
    useEffect(() => {
        const fetchExams = async () => {
            try {
                setLoading(true)
                const response = await getAllWritingExamsAPI()
                setExams(response.data)
            } catch (err: any) {
                setError("Imtihonlarni yuklashda xatolik yuz berdi.")
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchExams()
    }, [])

    // --- FILTRLASH MANTIGI ---
    const filteredTests = useMemo(() => {
        return exams.filter((test) => {
            const matchesSearch =
                test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                test.cefrLevel.toLowerCase().includes(searchTerm.toLowerCase());

            if (activeTab === 'free') return matchesSearch && test.isFree;
            if (activeTab === 'premium') return matchesSearch && !test.isFree;
            return matchesSearch;
        });
    }, [exams, searchTerm, activeTab]);

    const handleTestClick = (test: WritingExam) => {
        if (!test.isActive) return;
        // Agar premium bo'lsa va foydalanuvchida ruxsat bo'lmasa, bu yerda tekshirish mumkin
        router.push(`/dashboard/test/writing/start?id=${test.id}&mode=practice`)
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                <p className="text-sm font-black uppercase tracking-widest text-slate-400">Yuklanmoqda...</p>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-10 px-4 sm:px-6 pt-6 font-sans text-slate-900">
            
            {/* Back Button */}
            <motion.button 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => router.back()}
                className="group flex items-center gap-3 text-slate-400 hover:text-orange-600 transition-all"
            >
                <div className="w-9 h-9 rounded-2xl bg-white border border-slate-100 flex items-center justify-center group-hover:bg-orange-50 group-hover:border-orange-200 shadow-sm transition-all text-slate-400 group-hover:text-orange-600">
                    <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Orqaga qaytish</span>
            </motion.button>

            {/* Banner va Filter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="md:col-span-2 p-8 rounded-[32px] bg-gradient-to-br from-orange-500 to-orange-600 text-white relative overflow-hidden shadow-2xl shadow-orange-100"
                >
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
                            <Sparkles size={14} className="text-yellow-200 fill-yellow-200" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Writing Section</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight leading-tight uppercase">
                            Yozish Qismi<br /> <span className="italic text-orange-100">Mashqlari</span>
                        </h2>
                        <p className="text-orange-50 text-sm font-medium max-w-md opacity-90 leading-relaxed">
                            Mavzuni tanlang va yozishni boshlang. AI yordamida natijangizni darhol tekshiring.
                        </p>
                    </div>
                    <Edit3 size={180} className="absolute -right-10 -bottom-10 text-white opacity-10 -rotate-12" />
                </motion.div>

                <div className="p-8 rounded-[32px] bg-white border border-slate-100 flex flex-col justify-center shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 shadow-inner">
                            <Filter size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kategoriya</p>
                            <p className="text-lg font-black text-slate-900 tracking-tight">Filtrlash</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        {(['all', 'free', 'premium'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-left ${activeTab === tab
                                    ? "bg-orange-600 text-white shadow-lg shadow-orange-100"
                                    : "text-slate-400 hover:bg-slate-50 border border-transparent hover:border-slate-100"
                                }`}
                            >
                                {tab === 'all' ? 'Barcha Testlar' : tab === 'free' ? 'Bepul' : 'Premium'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Qidiruv */}
            <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                <input
                    type="text"
                    placeholder="Insho mavzusini qidiring..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[24px] text-sm font-bold outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-200 transition-all shadow-sm"
                />
            </div>

            {/* Testlar Ro'yxati */}
            <div className="space-y-5">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                        <Activity size={18} className="text-orange-500 animate-pulse" />
                        <h3 className="font-black text-slate-800 text-xs tracking-[0.2em] uppercase">Mavjud Mavzular</h3>
                    </div>
                    <Badge variant="secondary" className="bg-orange-50 text-orange-600 rounded-full px-4 py-1 border-none font-black text-[10px]">
                        {filteredTests.length} TA TEST
                    </Badge>
                </div>

                <div className="grid grid-cols-1 gap-4 pb-10">
                    <AnimatePresence mode="popLayout">
                        {filteredTests.map((test, index) => {
                            const isLocked = !test.isFree;

                            return (
                                <motion.div
                                    key={test.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                    onClick={() => handleTestClick(test)}
                                    className={`group flex flex-col sm:flex-row items-center justify-between p-6 rounded-[32px] bg-white border border-slate-100 hover:border-orange-300 hover:shadow-2xl hover:shadow-orange-500/[0.06] transition-all cursor-pointer relative overflow-hidden 
                                        ${!test.isActive ? 'opacity-70 grayscale pointer-events-none' : ''}`}
                                >
                                    <div className="flex items-center gap-6 z-10 w-full sm:w-auto">
                                        <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all duration-500 shadow-inner shrink-0
                                            ${isLocked 
                                                ? 'bg-slate-50 text-slate-300' 
                                                : 'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white'}`}>
                                            {isLocked ? <Lock size={26} /> : <PenTool size={26} />}
                                        </div>

                                        <div className="flex-1 text-center sm:text-left">
                                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-2">
                                                <h3 className="font-black text-slate-900 text-lg tracking-tight group-hover:text-orange-600 transition-colors uppercase">
                                                    {test.title}
                                                </h3>
                                                {test.isFree ? (
                                                    <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[9px] font-black uppercase tracking-tighter">OPEN</Badge>
                                                ) : (
                                                    <Badge className="bg-orange-50 text-orange-600 border-orange-100 text-[9px] font-black uppercase tracking-tighter">PREMIUM</Badge>
                                                )}
                                                <Badge variant="outline" className="text-[9px] font-black border-slate-200">
                                                    {test.tasks.length > 1 ? "Full Test" : "Task " + test.tasks[0]?.partNumber}
                                                </Badge>
                                            </div>

                                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                                                    <Clock size={12} className="text-orange-500" />
                                                    <span>{test.durationMinutes} MIN</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                                                    <Pencil size={12} className="text-slate-400" />
                                                    <span>{test.tasks.length} Task(s)</span>
                                                </div>
                                                <div className="px-2 py-1 rounded-md bg-orange-100 text-orange-700">
                                                    {test.cefrLevel}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`mt-4 sm:mt-0 shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm
                                        ${isLocked 
                                            ? 'text-slate-200 border border-slate-50' 
                                            : 'bg-slate-50 text-slate-300 group-hover:bg-orange-600 group-hover:text-white group-hover:shadow-lg'
                                        }`}>
                                        <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>
                
                {filteredTests.length === 0 && !loading && (
                    <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
                        <Inbox className="mx-auto text-slate-200 mb-6" size={40} />
                        <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Ma'lumot topilmadi</p>
                    </div>
                )}
            </div>
        </div>
    )
}