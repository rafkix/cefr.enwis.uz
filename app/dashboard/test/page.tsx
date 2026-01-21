"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Headphones, BookOpen, PenTool, Mic, ArrowRight, Zap, Lock } from "lucide-react"

// Test turlari uchun ma'lumotlar strukturasi
const TEST_CATEGORIES = [
    {
        id: "listening",
        title: "Listening",
        description: "Audio materiallarni tinglash va tushunish ko'nikmasi.",
        icon: Headphones,
        color: "purple",
        path: "/dashboard/test/listening",
        isAvailable: true
    },
    {
        id: "reading",
        title: "Reading",
        description: "Akademik va ijtimoiy matnlarni o'qish va tahlil qilish.",
        icon: BookOpen,
        color: "blue",
        path: "/dashboard/test/reading",
        isAvailable: true
    },
    {
        id: "writing",
        title: "Writing",
        description: "Insho va akademik xat yozish ko'nikmalarini baholash.",
        icon: PenTool,
        color: "orange",
        path: "/dashboard/test/writing",
        isAvailable: false // Tez kunda
    },
    {
        id: "speaking",
        title: "Speaking",
        description: "AI bilan og'zaki muloqot va talaffuzni tekshirish.",
        icon: Mic,
        color: "red",
        path: "/dashboard/test/speaking",
        isAvailable: false // Tez kunda
    }
]

export default function TestPage() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")

    // Qidiruv bo'yicha filtrlash mantiqi
    const filteredCategories = TEST_CATEGORIES.filter(test => 
        test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-10 pb-20">
    

            {/* SEARCH & TITLE AREA */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Asosiy yo'nalishlar</h2>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Siz uchun tayyorlangan testlar</p>
                </div>
                
                <div className="relative group w-full md:w-80">
                    <input 
                        type="text"
                        placeholder="Bo'limni izlash..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold shadow-sm focus:ring-4 focus:ring-[#17776A]/5 focus:border-[#17776A]/20 transition-all outline-none"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#17776A] transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </div>
                </div>
            </div>

            {/* CATEGORIES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredCategories.map((test, index) => (
                        <motion.div 
                            layout
                            key={test.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => test.isAvailable && router.push(test.path)}
                            className={`group relative overflow-hidden p-8 rounded-[36px] border border-slate-100 transition-all duration-500 shadow-xl shadow-slate-200/40 
                                ${test.isAvailable 
                                    ? `bg-white hover:border-${test.color}-200 cursor-pointer hover:shadow-2xl hover:shadow-${test.color}-200/20` 
                                    : 'bg-slate-50/80 cursor-not-allowed grayscale'}`}
                        >
                            {/* Decorative Background Shape */}
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-${test.color}-50 rounded-bl-[100px] -mr-10 -mt-10 transition-transform group-hover:scale-125 duration-700 opacity-50`}></div>

                            <div className="relative z-10 flex flex-col h-full">
                                <div className={`w-16 h-16 bg-${test.color}-100 text-${test.color}-600 rounded-2xl flex items-center justify-center mb-8 shadow-inner transition-transform group-hover:rotate-6`}>
                                    <test.icon size={32} />
                                </div>

                                <div className="mb-8">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">{test.title}</h3>
                                        {!test.isAvailable && (
                                            <span className="bg-slate-200 text-slate-500 text-[9px] font-black uppercase px-2 py-1 rounded-md flex items-center gap-1">
                                                <Lock size={10} /> Coming Soon
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[240px]">
                                        {test.description}
                                    </p>
                                </div>

                                <div className={`mt-auto inline-flex items-center font-black text-[11px] uppercase tracking-[0.2em] transition-all 
                                    ${test.isAvailable ? `text-${test.color}-600 group-hover:gap-4` : 'text-slate-300'}`}>
                                    {test.isAvailable ? 'Kirish' : 'Vaqtincha yopiq'} 
                                    <ArrowRight size={16} className="ml-2" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* EMPTY STATE */}
            {filteredCategories.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-100">
                    <p className="font-bold text-slate-400 tracking-widest uppercase text-xs">Hech qanday bo'lim topilmadi</p>
                </div>
            )}
        </div>
    )
}