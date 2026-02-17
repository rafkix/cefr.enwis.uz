"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Headphones, BookOpen, PenTool, Mic, ArrowRight, Lock, ExternalLink, CreditCard, Heart, Search } from "lucide-react"
import Link from "next/link"

// Test turlari uchun ma'lumotlar strukturasi
const TEST_CATEGORIES = [
    {
        id: "listening",
        title: "Tinglab Tushunish Qismi",
        description: "Audio materiallarni tinglash va tushunish ko'nikmasi.",
        icon: Headphones,
        color: "purple", // Tailwind: bg-purple-50, text-purple-600
        path: "/dashboard/test/listening",
        isAvailable: true
    },
    {
        id: "reading",
        title: "O'qib Tushunish Qismi",
        description: "Akademik va ijtimoiy matnlarni o'qish va tahlil qilish.",
        icon: BookOpen,
        color: "blue", // Tailwind: bg-blue-50, text-blue-600
        path: "/dashboard/test/reading",
        isAvailable: true
    },
    {
        id: "writing",
        title: "Yozish Qismi",
        description: "Insho va akademik xat yozish ko'nikmalarini baholash.",
        icon: PenTool,
        color: "orange",
        path: "/dashboard/test/writing",
        isAvailable: true
    },
    {
        id: "speaking",
        title: "Gapirish Qismi",
        description: "AI bilan og'zaki muloqot va talaffuzni tekshirish.",
        icon: Mic,
        color: "red",
        path: "/dashboard/test/speaking",
        isAvailable: false
    }
]

export default function TestPage() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")

    const filteredCategories = TEST_CATEGORIES.filter(test =>
        test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        test.description.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-10 pb-20 max-w-7xl mx-auto px-4">

            {/* SEARCH & TITLE AREA */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Asosiy yo'nalishlar</h2>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1 italic">Muvaffaqiyat sari birinchi qadam</p>
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
                        <Search size={20} strokeWidth={2.5} />
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
                            className={`group relative overflow-hidden p-8 rounded-[40px] border border-slate-100 transition-all duration-500 shadow-xl shadow-slate-200/30 
                                ${test.isAvailable
                                    ? `bg-white cursor-pointer hover:shadow-2xl hover:-translate-y-1`
                                    : 'bg-slate-50/80 cursor-not-allowed grayscale'}`}
                        >
                            {/* Rangli dekoratsiya */}
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-bl-[100px] -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-700 opacity-40`} />

                            <div className="relative z-10 flex flex-col h-full">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-3 
                                    ${test.id === 'listening' ? 'bg-purple-50 text-purple-600' :
                                        test.id === 'reading' ? 'bg-blue-50 text-blue-600' :
                                            test.id === 'writing' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'}`}>
                                    <test.icon size={28} />
                                </div>

                                <div className="mb-8">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">{test.title}</h3>
                                        {!test.isAvailable && (
                                            <span className="bg-slate-200 text-slate-500 text-[9px] font-black uppercase px-2 py-1 rounded-md flex items-center gap-1">
                                                <Lock size={10} /> Soon
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-[280px]">
                                        {test.description}
                                    </p>
                                </div>

                                <div className={`mt-auto inline-flex items-center font-black text-[11px] uppercase tracking-[0.2em] transition-all 
                                    ${test.isAvailable ? `text-[#17776A] group-hover:gap-4` : 'text-slate-300'}`}>
                                    {test.isAvailable ? 'Testni boshlash' : 'Vaqtincha yopiq'}
                                    <ArrowRight size={16} className="ml-2" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* --- SUPPORT SECTION (Sahifa oxirida chiroyli kenglikda) --- */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-[40px] p-8 md:p-10 border border-slate-100 shadow-2xl shadow-slate-200/40 mt-12 overflow-hidden relative"
            >
                {/* Orqa fon uchun dekor */}
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-rose-50 rounded-full blur-3xl opacity-50" />

                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6 text-center lg:text-left flex-col lg:flex-row">
                        <div className="w-16 h-16 rounded-[24px] bg-rose-50 flex items-center justify-center shadow-inner animate-pulse">
                            <Heart className="text-rose-500 fill-rose-500" size={32} />
                        </div>
                        <div>
                            <h4 className="font-black text-slate-800 text-xl uppercase tracking-tight">Loyiha rivojiga hissa qo'shing</h4>
                            <p className="text-slate-400 font-medium mt-1">Sizning yordamingiz platformani yanada yaxshilashga xizmat qiladi</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full lg:w-auto">
                        {/* Karta qismi */}
                        <div className="bg-slate-50 px-6 py-5 rounded-3xl border border-slate-100 flex items-center gap-4 group hover:border-purple-200 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                                <CreditCard size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-0.5">Uzcard / Humo</span>
                                <span className="text-sm font-mono font-black text-slate-700 tracking-wider">6262 5708 0051 9183</span>
                                <span className="text-[10px] text-slate-500 font-bold opacity-70">Diyorbek A.</span>
                            </div>
                        </div>

                        {/* iDonate Link qismi */}
                        <Link
                            href="https://idonate.uz/d/rafkix"
                            target="_blank"
                            className="bg-purple-600 px-8 py-5 rounded-3xl flex items-center justify-center gap-3 text-white font-black uppercase text-xs tracking-[0.15em] hover:bg-purple-700 transition-all active:scale-95 shadow-xl shadow-purple-200 group"
                        >
                            <span>Donat qilish</span>
                            <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* EMPTY STATE */}
            {filteredCategories.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-100">
                    <p className="font-bold text-slate-400 tracking-widest uppercase text-xs">Hech qanday bo'lim topilmadi</p>
                </div>
            )}
        </div>
    )
}