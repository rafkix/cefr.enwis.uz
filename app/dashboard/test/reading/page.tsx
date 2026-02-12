"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    BookOpen, Clock, FileText, ChevronRight, ChevronLeft, Zap, Search, Inbox,
    Filter, Activity, Lock, Award
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { getAllReadingExamsAPI } from "@/lib/api/reading" 
import { UnlockModal } from "@/components/UnlockModal"

export interface ExamCardItem {
    id: string
    title: string
    isDemo: boolean
    isFree: boolean
    isMock: boolean
    isActive: boolean    
    level: string
    duration: number
    totalQuestions: number
    price: number
}

export default function ReadingPage() {
    const router = useRouter()

    const [exams, setExams] = useState<ExamCardItem[]>([])
    const [loading, setLoading] = useState(true)
    // "mock" tabi olib tashlandi, chunki bu yerda faqat practice bo'ladi
    const [activeTab, setActiveTab] = useState<'all' | 'free' | 'premium'>('all')
    const [searchTerm, setSearchTerm] = useState("")
    
    const [showUnlockModal, setShowUnlockModal] = useState(false)
    const [selectedTestId, setSelectedTestId] = useState<string | null>(null)

    // --- 1. MA'LUMOTLARNI YUKLASH ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await getAllReadingExamsAPI()
                const rawData: any[] = Array.isArray(response.data) ? response.data : (response.data as any)?.items || [];

                const formattedData: ExamCardItem[] = rawData.map((item) => ({
                    id: String(item.id),
                    title: item.title || "Nomsiz Test",
                    isDemo: item.is_demo ?? false,
                    isFree: item.is_free ?? false,
                    isMock: item.is_mock ?? false,
                    isActive: item.is_active ?? true, 
                    level: item.cefr_level || "General",
                    duration: item.duration_minutes || 60,
                    totalQuestions: item.total_questions || 0,
                    price: item.price || 0
                }))

                // MOCKLARNI OLIB TASHLASH (Client-side filtering)
                // Agar backend faqat readinglarni bersa yaxshi, lekin agar aralash bersa shu yerda filtrlaymiz
                const onlyReadingPractice = formattedData.filter(exam => !exam.isMock);

                setExams(onlyReadingPractice)
            } catch (error) {
                console.error("Testlarni yuklashda xatolik:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    // --- 2. FILTRLASH MANTIGI ---
    const filteredTests = useMemo(() => {
        return exams.filter((test) => {
            const matchesSearch =
                test.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                test.level.toLowerCase().includes(searchTerm.toLowerCase());

            if (activeTab === 'free') return matchesSearch && test.isFree;
            if (activeTab === 'premium') return matchesSearch && !test.isFree;

            return matchesSearch;
        });
    }, [exams, searchTerm, activeTab]);

    // --- 3. BOSILGANDA ---
    const handleTestClick = (test: ExamCardItem) => {
        if (!test.isActive) return;

        // Bu yerda faqat Practice testlar bor, shuning uchun Mock tekshiruvi shart emas
        if (test.isFree) {
            router.push(`/dashboard/test/reading/start?id=${test.id}&mode=practice`)
        } else {
            setSelectedTestId(test.id)
            setShowUnlockModal(true)
        }
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-10 px-4 sm:px-6 pt-6 font-sans text-slate-900">
            
            {/* Back Button */}
            <motion.button 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => router.back()}
                className="group flex items-center gap-3 text-slate-400 hover:text-blue-600 transition-all"
            >
                <div className="w-9 h-9 rounded-2xl bg-white border border-slate-100 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-200 shadow-sm transition-all">
                    <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Orqaga qaytish</span>
            </motion.button>

            {/* Banner va Filter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="md:col-span-2 p-8 rounded-[32px] bg-gradient-to-br from-blue-600 to-indigo-600 text-white relative overflow-hidden shadow-2xl shadow-blue-200"
                >
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-md">
                            <Zap size={16} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-80">O'qish Tushunish Qismi</span>
                        </div>
                        <h2 className="text-3xl font-black mb-4 tracking-tight leading-tight">Reading ko'nikmalaringizni <br />oshiring.</h2>
                        <p className="text-blue-100 text-sm font-medium max-w-md opacity-90 leading-relaxed italic">
                            Har xil darajadagi matnlar va savollar bilan shug'ullaning.
                        </p>
                    </div>
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                    <BookOpen size={180} className="absolute -right-10 -bottom-10 text-white opacity-10 rotate-12" />
                </motion.div>

                <div className="p-8 rounded-[32px] bg-white border border-slate-100 flex flex-col justify-center shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                            <Filter size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-nowrap">Saralash</p>
                            <p className="text-lg font-black text-slate-900 tracking-tight">Kategoriyalar</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        {(['all', 'free', 'premium'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-left ${activeTab === tab
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                                    : "text-slate-400 hover:bg-slate-50 border border-transparent hover:border-slate-100"
                                }`}
                            >
                                {tab === 'all' ? 'Barcha Testlar' : tab === 'free' ? 'Bepul Mashqlar' : 'Premium Mashqlar'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Qidiruv */}
            <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input
                    type="text"
                    placeholder="Test nomi yoki darajani qidiring..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[24px] text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all shadow-sm"
                />
            </div>

            {/* Testlar Ro'yxati */}
            <div className="space-y-5">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                        <Activity size={18} className="text-blue-500 animate-pulse" />
                        <h3 className="font-black text-slate-800 text-xs tracking-[0.2em] uppercase">Mavjud Mashqlar</h3>
                    </div>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-600 rounded-full px-4 py-1 border-none font-black text-[10px]">
                        {filteredTests.length} TA TEST
                    </Badge>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-28 w-full bg-white rounded-[32px] border border-slate-50 animate-pulse" />
                        ))}
                    </div>
                ) : (
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
                                        className={`group flex flex-col sm:flex-row items-center justify-between p-6 rounded-[32px] bg-white border border-slate-100 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/[0.06] transition-all cursor-pointer relative overflow-hidden 
                                            ${!test.isActive ? 'opacity-75 grayscale pointer-events-none' : ''}`}
                                    >
                                        <div className="flex items-center gap-6 z-10 w-full sm:w-auto">
                                            {/* Icon */}
                                            <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all duration-500 shadow-inner shrink-0
                                                ${isLocked 
                                                    ? 'bg-slate-50 text-slate-300' 
                                                    : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}`}>
                                                {isLocked ? <Lock size={26} /> : <BookOpen size={26} />}
                                            </div>

                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                                    <h3 className="font-black text-slate-900 text-lg tracking-tight group-hover:text-blue-600 transition-colors uppercase">
                                                        {test.title}
                                                    </h3>
                                                    
                                                    {!test.isActive && <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-black uppercase border border-slate-200">YAQINDA</span>}
                                                    
                                                    {test.isFree ? (
                                                        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[10px] font-black">OPEN</Badge>
                                                    ) : (
                                                        <Badge className="bg-blue-50 text-blue-600 border-blue-100 text-[10px] font-black tracking-widest">PREMIUM</Badge>
                                                    )}
                                                </div>

                                                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                                                        <Clock size={12} className="text-blue-500" />
                                                        <span>{test.duration} MIN</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                                                        <FileText size={12} className="text-orange-500" />
                                                        <span>{test.totalQuestions} SAVOL</span>
                                                    </div>
                                                    <Badge className="h-4 bg-indigo-500 text-white border-none text-[8px] px-2">{test.level}</Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`mt-4 sm:mt-0 shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm
                                            ${isLocked 
                                                ? 'text-slate-200' 
                                                : 'bg-slate-50 text-slate-300 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg'
                                            }`}>
                                            <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>
                )}
                
                {!loading && filteredTests.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
                        <Inbox className="mx-auto text-slate-200 mb-6" size={40} />
                        <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Hozircha testlar mavjud emas</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedTestId && (
                <UnlockModal 
                    open={showUnlockModal} 
                    onClose={() => setShowUnlockModal(false)} 
                    testId={selectedTestId} 
                    testType="reading" 
                />
            )}
        </div>
    )
}