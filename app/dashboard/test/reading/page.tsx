"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    BookOpen,
    Clock,
    FileText,
    ChevronRight,
    Zap,
    Search,
    Inbox,
    Filter,
    Activity
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { getAllReadingExamsAPI } from "@/lib/api/reading"
import { ReadingExam } from "@/lib/types/reading"

export default function ReadingPage() {
    const router = useRouter()
    
    const [exams, setExams] = useState<ReadingExam[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'all' | 'free' | 'premium'>('all')
    const [searchTerm, setSearchTerm] = useState("")

    // 1. DATA FETCHING
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await getAllReadingExamsAPI()
                // Backenddan kelayotgan ma'lumot response.data ichida bo'ladi
                setExams(Array.isArray(response.data) ? response.data : [])
            } catch (error) {
                console.error("Imtihonlarni yuklashda xatolik:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    // 2. SEARCH & FILTER LOGIC (useMemo bilan optimallashgan)
    const filteredTests = useMemo(() => {
        return exams.filter((test) => {
            const matchesSearch = 
                test.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                test.cefr_level.toLowerCase().includes(searchTerm.toLowerCase())
            
            // Hozircha backend 'type' yoki 'isFree' qaytarmayotgan bo'lsa, 'all' ko'rsatiladi
            if (activeTab === 'free') return matchesSearch && true; // Kelajakda test.is_free mantiqi uchun
            if (activeTab === 'premium') return false; // Hozircha premium testlar yo'q deb hisoblaymiz
            
            return matchesSearch
        })
    }, [exams, searchTerm, activeTab])

    const handleTestClick = (testId: string) => {
        // Yo'lakni sizning routeringizga moslashtirdim: /test/reading/[testId]
        router.push(`/dashboard/test/reading/${testId}`)
    }

    return (
        <div className="space-y-8 pb-10">
            {/* 1. TOP HERO BANNER */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="md:col-span-2 p-8 rounded-[32px] bg-gradient-to-br from-blue-600 to-indigo-700 text-white relative overflow-hidden shadow-2xl shadow-blue-200"
                >
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Zap size={18} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-black uppercase tracking-widest opacity-80">CEFR Reading</span>
                        </div>
                        <h2 className="text-3xl font-black mb-4 tracking-tight">O'qish ko'nikmalaringizni <br/>professional darajaga olib chiqing.</h2>
                        <p className="text-blue-100 text-sm font-medium max-w-md opacity-90 leading-relaxed italic">
                            Haqiqiy imtihon muhiti, akademik matnlar va batafsil natijalar tahlili sizni kutmoqda.
                        </p>
                    </div>
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                    <BookOpen size={180} className="absolute -right-10 -bottom-10 text-white opacity-10 rotate-12" />
                </motion.div>

                {/* CATEGORY FILTER */}
                <div className="p-8 rounded-[32px] bg-white border border-slate-100 flex flex-col justify-center shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Filter size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Saralash</p>
                            <p className="text-lg font-black text-slate-900">Kategoriyalar</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        {(['all', 'free', 'premium'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-left ${
                                    activeTab === tab 
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100" 
                                    : "text-slate-400 hover:bg-slate-50 border border-transparent hover:border-slate-100"
                                }`}
                            >
                                {tab === 'all' ? 'Barcha Testlar' : tab === 'free' ? 'Bepul Mashqlar' : 'Premium Imtihonlar'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. SEARCH AREA (Mobile & Tablet) */}
            <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input 
                    type="text"
                    placeholder="Test nomi yoki darajani qidiring (masalan: B2, Practice Test...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-[24px] text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all shadow-sm"
                />
            </div>

            {/* 3. TEST LIST AREA */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                        <Activity size={18} className="text-blue-500" />
                        <h3 className="font-black text-slate-800 text-sm tracking-widest uppercase">Mavjud Imtihonlar</h3>
                    </div>
                    <Badge variant="secondary" className="bg-blue-50 text-blue-600 rounded-full px-4 py-1 border-none font-black text-[10px]">
                        {filteredTests.length} TA TEST
                    </Badge>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-28 w-full bg-white rounded-[32px] border border-slate-100 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        <AnimatePresence mode="popLayout">
                            {filteredTests.map((test, index) => {
                                // Savollar sonini hisoblash
                                const totalQuestions = test.parts?.reduce((acc, part) => acc + part.questions.length, 0) || 0;
                                
                                return (
                                    <motion.div
                                        key={test.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => handleTestClick(test.id)}
                                        className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 rounded-[32px] bg-white border border-slate-100 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/[0.06] transition-all cursor-pointer relative overflow-hidden"
                                    >
                                        <div className="flex items-center gap-6 z-10">
                                            {/* Status Badge for Hover */}
                                            <div className="w-16 h-16 rounded-[24px] bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                                                <BookOpen size={26} />
                                            </div>
                                            
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-black text-slate-900 text-lg tracking-tight group-hover:text-blue-600 transition-colors uppercase">
                                                        {test.title}
                                                    </h3>
                                                    <Badge className="bg-blue-50 text-blue-600 border-none text-[9px] font-black uppercase px-2">Reading</Badge>
                                                </div>
                                                
                                                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                                                        <Clock size={12} className="text-blue-500" />
                                                        <span>{test.duration_minutes} MIN</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                                                        <FileText size={12} className="text-orange-500" />
                                                        <span>{totalQuestions} SAVOL</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                                                        <Badge className="h-4 bg-indigo-500 text-white border-none text-[8px]">{test.cefr_level}</Badge>
                                                        <span className="text-slate-500">LEVEL</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 sm:mt-0 shrink-0 w-full sm:w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                                            <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                                        </div>

                                        {/* Decorative element */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>
                )}

                {!loading && filteredTests.length === 0 && (
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-slate-100"
                    >
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Inbox className="text-slate-200" size={40} />
                        </div>
                        <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Hech qanday imtihon topilmadi</p>
                        <button 
                            onClick={() => {setSearchTerm(""); setActiveTab('all')}}
                            className="mt-4 text-blue-600 text-[10px] font-black uppercase hover:underline"
                        >
                            Filtrlarni tozalash
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    )
}