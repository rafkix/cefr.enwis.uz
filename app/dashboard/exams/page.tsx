"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Search, Clock, HelpCircle, ArrowRight, Lock, 
    Layout, BookOpen, Headphones, PenTool, Trophy, Eye
} from "lucide-react"

// --- TYPES ---
const EXAMS_DATA = [
    {
        id: "ielts-mock-1", // Bu ID View sahifasidagi DB da bo'lishi kerak
        title: "IELTS Full Mock #1",
        category: "IELTS",
        time: "160 daqiqa",
        questions: 80,
        level: "Hard",
        icon: Layout,
        color: "purple",
        isAvailable: true
    },
    {
        id: "cefr-reading-b2",
        title: "CEFR B2 Reading Practice",
        category: "CEFR",
        time: "60 daqiqa",
        questions: 30,
        level: "Medium",
        icon: BookOpen,
        color: "blue",
        isAvailable: true
    },
    {
        id: "listening-intensive",
        title: "Intensive Listening",
        category: "Listening",
        time: "40 daqiqa",
        questions: 40,
        level: "Hard",
        icon: Headphones,
        color: "emerald",
        isAvailable: true
    },
    {
        id: "writing-task-1",
        title: "General Writing Task 1",
        category: "Writing",
        time: "20 daqiqa",
        questions: 1,
        level: "Easy",
        icon: PenTool,
        color: "orange",
        isAvailable: false
    },
    {
        id: "ielts-mock-2",
        title: "IELTS Full Mock #2",
        category: "IELTS",
        time: "160 daqiqa",
        questions: 80,
        level: "Hard",
        icon: Layout,
        color: "purple",
        isAvailable: false
    },
    {
        id: "multi-level-test",
        title: "Multi-level Simulation",
        category: "CEFR",
        time: "120 daqiqa",
        questions: 70,
        level: "Medium",
        icon: Trophy,
        color: "red",
        isAvailable: true
    }
]

export default function ExamsPage() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")

    // 🔥 MUHIM O'ZGARISH: Navigatsiya endi View sahifasiga boradi
    const handleViewDetails = (id: string, isAvailable: boolean) => {
        if (!isAvailable) return;
        
        // Biz yasagan 'view' sahifasiga ID bilan yuboramiz
        router.push(`/dashboard/exams/view?id=${id}`);
    }

    const filteredExams = EXAMS_DATA.filter(exam => 
        exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exam.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-10 pb-20">

            {/* HEADER AREA */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Imtihonlar ro'yxati</h2>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Bilimingizni sinash uchun testlar</p>
                </div>
                
                <div className="relative group w-full md:w-80">
                    <input 
                        type="text"
                        placeholder="Imtihonni izlash..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold shadow-sm focus:ring-4 focus:ring-[#17776A]/5 focus:border-[#17776A]/20 transition-all outline-none"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#17776A] transition-colors">
                        <Search size={20} strokeWidth={2.5} />
                    </div>
                </div>
            </div>

            {/* EXAMS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredExams.map((exam, index) => (
                        <motion.div 
                            layout
                            key={exam.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            // Karta bosilganda ham View sahifasiga o'tadi
                            onClick={() => handleViewDetails(exam.id, exam.isAvailable)}
                            className={`group relative overflow-hidden p-8 rounded-[36px] border border-slate-100 transition-all duration-500 shadow-xl shadow-slate-200/40 
                                ${exam.isAvailable 
                                    ? `bg-white hover:border-${exam.color}-200 cursor-pointer hover:shadow-2xl hover:shadow-${exam.color}-200/20 hover:-translate-y-1` 
                                    : 'bg-slate-50/80 cursor-not-allowed grayscale'}`}
                        >
                            {/* Decorative Background Shape */}
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-${exam.color}-50 rounded-bl-[100px] -mr-10 -mt-10 transition-transform group-hover:scale-125 duration-700 opacity-50`}></div>

                            <div className="relative z-10 flex flex-col h-full">
                                
                                {/* Icon & Level Badge */}
                                <div className="flex justify-between items-start mb-8">
                                    <div className={`w-16 h-16 bg-${exam.color}-100 text-${exam.color}-600 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:rotate-6`}>
                                        <exam.icon size={32} />
                                    </div>
                                    <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-${exam.color}-50 text-${exam.color}-600`}>
                                        {exam.level}
                                    </span>
                                </div>

                                <div className="mb-8">
                                    <div className="flex items-center gap-3 mb-3">
                                        <h3 className="text-xl font-black text-slate-800 tracking-tight leading-tight line-clamp-2">
                                            {exam.title}
                                        </h3>
                                    </div>
                                    
                                    {/* Meta Data */}
                                    <div className="flex flex-col gap-2">
                                        {!exam.isAvailable ? (
                                            <span className="bg-slate-200 text-slate-500 text-[10px] font-black uppercase px-2 py-1.5 rounded-lg flex items-center gap-1.5 w-fit">
                                                <Lock size={12} /> Tez Kunda
                                            </span>
                                        ) : (
                                            <div className="flex items-center gap-4 text-slate-500 text-xs font-bold uppercase tracking-wide">
                                                <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg">
                                                    <Clock size={14} /> {exam.time}
                                                </span>
                                                <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg">
                                                    <HelpCircle size={14} /> {exam.questions}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Button */}
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation(); 
                                        handleViewDetails(exam.id, exam.isAvailable);
                                    }}
                                    className={`mt-auto inline-flex items-center font-black text-[11px] uppercase tracking-[0.2em] transition-all 
                                    ${exam.isAvailable ? `text-${exam.color}-600 group-hover:gap-4 group-hover:text-${exam.color}-700` : 'text-slate-300'}`}>
                                    {exam.isAvailable ? "Ko'rish" : 'Yopiq'} 
                                    {/* Ikonkani o'zgartirdik: ArrowRight -> Eye yoki ArrowRight */}
                                    <ArrowRight size={16} className="ml-2" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* EMPTY STATE */}
            {filteredExams.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-100">
                    <p className="font-bold text-slate-400 tracking-widest uppercase text-xs">Hech qanday imtihon topilmadi</p>
                </div>
            )}
        </div>
    )
}