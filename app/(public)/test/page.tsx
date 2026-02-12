"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    Trophy, Info, Clock, CheckCircle2,
    Headphones, BookOpen, PenTool, Mic,
    Zap, AlertCircle, Download, Eye, X,
    Target, Users, Flame, FileText, ArrowRight
} from "lucide-react"

// --- MOCK DATA (SAQLANDI) ---
const HALL_OF_FAME = [
    {
        id: 2, rank: 2, name: "Behro'zbek M.", score: "55",
        image: "https://image2url.com/r2/default/images/1769107982819-59a8a2f8-3149-474b-9150-922aded80f01.jpg",
        border: "border-slate-300", shadow: "shadow-slate-400/40", medal: "🥈", scale: "scale-95", position: "mt-8 z-0"
    },
    {
        id: 1, rank: 1, name: "Marjona T.", score: "57",
        image: "https://image2url.com/r2/default/images/1769107895562-bbb89618-9f70-43f2-96eb-9d96a836b498.jpg",
        border: "border-yellow-400", shadow: "shadow-yellow-500/50", medal: "🥇", scale: "scale-110", position: "mt-0 z-10"
    },
    {
        id: 3, rank: 3, name: "Jahongir R.", score: "51",
        image: "https://image2url.com/r2/default/images/1769108031137-5fd5d55a-6b8d-4575-abf2-9de6a779a6be.jpg",
        border: "border-orange-400", shadow: "shadow-orange-500/40", medal: "🥉", scale: "scale-95", position: "mt-8 z-0"
    },
]

const DAILY_CHALLENGE = {
    title: "Bugungi Challenj: Lug'at boyligi",
    task: "Writing Task 1 uchun 10 ta akademik so'zni yodlang va mashq qiling.",
    reward: "+50 tanga",
    timeLeft: "4 soat qoldi"
}

// --- YORDAMCHI KOMPONENT (SAQLANDI) ---
function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between p-3.5 sm:p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
            <span className="text-slate-500 font-bold text-xs sm:text-sm tracking-tight">{label}</span>
            <span className="font-black text-slate-900 text-xs sm:text-sm">{value}</span>
        </div>
    );
}

export default function TestInfoPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'listening' | 'reading' | 'writing' | 'speaking'>('listening')
    const [selectedCert, setSelectedCert] = useState<string | null>(null)

    return (
        /* 🟢 HEADER BILAN TO'QNASHUVNI YECHISH: pt-4 va ichki paddinglar orqali desktop/mobile muammosi hal bo'ldi */
        <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans text-slate-800 relative overflow-x-hidden pt-20 lg:pt-20">

            {/* LIGHTBOX MODAL */}
            <AnimatePresence>
                {selectedCert && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setSelectedCert(null)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-100 flex items-center justify-center p-2"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 18 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="relative max-w-2xl w-full bg-white p-4 rounded-3xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button onClick={() => setSelectedCert(null)} className="absolute -top-4 -right-4 bg-white text-slate-900 p-2 rounded-full shadow-lg z-10"><X size={24} /></button>
                            <img src={selectedCert} alt="Full View" className="w-full h-auto rounded-2xl" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mx-auto max-w-7xl px-4 relative z-10">

                {/* HEADER - Margin top qo'shildi */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 mt-4 lg:mt-6">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-3xl lg:text-4xl font-black text-slate-900 mb-2 tracking-tight">Imtihon Markazi</h1>
                        <p className="text-slate-500 font-medium text-sm lg:text-lg">Rasmiy Multilevel (CEFR) standarti va tahlillar.</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 shadow-sm text-[#17776A] rounded-2xl font-bold text-sm">
                        <Trophy size={18} className="text-yellow-500" /> Maqsad: <span className="font-black">C1 Daraja</span>
                    </motion.div>
                </div>

                {/* STATS BANNER */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 backdrop-blur-md rounded-[32px] p-6 border border-slate-200 shadow-sm mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-around gap-6 text-sm"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Users size={24} /></div>
                        <div><p className="font-black text-slate-900 text-xl tracking-tight">1,250+</p><p className="text-slate-400 font-bold uppercase text-[10px]">O'quvchilar</p></div>
                    </div>
                    <div className="hidden md:block w-px h-12 bg-slate-100"></div>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl"><Flame size={24} /></div>
                        <div><p className="font-black text-slate-900 text-xl tracking-tight">450+</p><p className="text-slate-400 font-bold uppercase text-[10px]">Bugun</p></div>
                    </div>
                    <div className="hidden md:block w-px h-12 bg-slate-100"></div>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-50 text-[#17776A] rounded-2xl"><CheckCircle2 size={24} /></div>
                        <div><p className="font-black text-slate-900 text-xl tracking-tight">85%</p><p className="text-slate-400 font-bold uppercase text-[10px]">Muvaffaqiyat</p></div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* --- LEFT COL (8) --- */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* DAILY CHALLENGE */}
                        <motion.div whileHover={{ y: -5 }} className="bg-slate-900 rounded-[32px] p-8 relative overflow-hidden shadow-2xl border border-slate-700">
                            <div className="absolute inset-0 opacity-[3.15] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
                            <div className="relative z-10">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-4 bg-white/10 text-white rounded-2xl"><Target size={28} /></div>
                                        <div>
                                            <h3 className="text-xl font-black text-white">{DAILY_CHALLENGE.title}</h3>
                                            <p className="text-slate-400 text-sm flex items-center gap-2 mt-1"><Clock size={14} className="text-orange-400" /> {DAILY_CHALLENGE.timeLeft}</p>
                                        </div>
                                    </div>
                                    <span className="bg-[#17776A] text-white font-black px-4 py-1.5 rounded-xl text-xs uppercase tracking-widest">{DAILY_CHALLENGE.reward}</span>
                                </div>
                                <p className="text-slate-300 font-medium text-lg mb-8 leading-relaxed">{DAILY_CHALLENGE.task}</p>
                                <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all">Mashqni boshlash</button>
                            </div>
                        </motion.div>

                        {/* --- TEST STRUCTURE & FULL INFO --- */}
                        <div className="bg-white/80 backdrop-blur-md rounded-[40px] p-6 sm:p-10 border border-slate-200 shadow-sm">
                            <h2 className="text-2xl font-black text-slate-900 mb-8">Imtihon Tarkibi va Ma'lumotlar</h2>

                            {/* Bo'lim Tablari */}
                            <div className="flex overflow-x-auto no-scrollbar gap-2 mb-10 bg-slate-100/50 p-1.5 rounded-[22px]">
                                {[
                                    { id: 'listening', label: 'Listening', icon: Headphones, color: 'text-purple-600' },
                                    { id: 'reading', label: 'Reading', icon: BookOpen, color: 'text-blue-600' },
                                    { id: 'writing', label: 'Writing', icon: PenTool, color: 'text-orange-600' },
                                    { id: 'speaking', label: 'Speaking', icon: Mic, color: 'text-red-600' }
                                ].map((tab) => (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                                        className={`flex-1 min-w-[120px] flex items-center justify-center gap-3 px-5 py-4 rounded-2xl text-xs sm:text-sm font-black transition-all ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>
                                        <tab.icon size={18} className={activeTab === tab.id ? tab.color : ''} /> {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="relative">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeTab}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            className="space-y-6"
                                        >
                                            <h3 className="text-3xl font-black text-slate-900 capitalize italic">{activeTab}</h3>

                                            <div className="grid grid-cols-1 gap-3">
                                                {/* 🔵 LISTENING TO'LIQ MA'LUMOTLARI */}
                                                {activeTab === 'listening' && (
                                                    <>
                                                        <p className="text-slate-500 font-medium italic border-l-4 border-purple-500 pl-4 mb-4">"Audiolarni tushunish va asosiy g'oyalarni aniqlash."</p>
                                                        <InfoItem label="Vaqt" value="35-40 Daqiqa" />
                                                        <InfoItem label="Savollar" value="35 Ta" />
                                                        <InfoItem label="Qismlar" value="6 Ta Blok" />
                                                        <InfoItem label="Audio turi" value="Dialog/Monolog" />
                                                        <InfoItem label="Daraja" value="A2 dan C1 gacha" />
                                                    </>
                                                )}

                                                {/* 🔵 READING TO'LIQ MA'LUMOTLARI */}
                                                {activeTab === 'reading' && (
                                                    <>
                                                        <p className="text-slate-500 font-medium italic border-l-4 border-blue-500 pl-4 mb-4">"Matnlarni tahlil qilish va ma'lumot qidirish."</p>
                                                        <InfoItem label="Vaqt" value="60 Daqiqa" />
                                                        <InfoItem label="Savollar" value="35 Ta" />
                                                        <InfoItem label="Matnlar" value="5 Ta Akademik Matn" />
                                                        <InfoItem label="Format" value="Matching/Gap Fill" />
                                                        <InfoItem label="Murakkablik" value="O'sib boruvchi" />
                                                    </>
                                                )}

                                                {/* 🔵 WRITING TO'LIQ MA'LUMOTLARI */}
                                                {activeTab === 'writing' && (
                                                    <>
                                                        <p className="text-slate-500 font-medium italic border-l-4 border-orange-500 pl-4 mb-4">"Mantiqiy insho va xat yozish ko'nikmasi."</p>
                                                        <InfoItem label="Vaqt" value="60 Daqiqa" />
                                                        <InfoItem label="Vazifalar" value="3 Ta Task" />
                                                        <InfoItem label="Task 1" value="Xat/Email yozish" />
                                                        <InfoItem label="Task 2" value="Essay (250+ so'z)" />
                                                        <InfoItem label="Baholash" value="Grammatika/Leksika" />
                                                    </>
                                                )}

                                                {/* 🔵 SPEAKING TO'LIQ MA'LUMOTLARI */}
                                                {activeTab === 'speaking' && (
                                                    <>
                                                        <p className="text-slate-500 font-medium italic border-l-4 border-red-500 pl-4 mb-4">"Og'zaki nutqning ravonligi va talaffuzi."</p>
                                                        <InfoItem label="Vaqt" value="15 Daqiqa" />
                                                        <InfoItem label="Qismlar" value="3 Ta Part" />
                                                        <InfoItem label="Format" value="Kompyuterda yozib olish" />
                                                        <InfoItem label="Part 1" value="Shaxsiy savollar" />
                                                        <InfoItem label="Part 2 & 3" value="Rasm tahlili/Mavzu" />
                                                    </>
                                                )}
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                {/* O'NG TOMON: SIMULATOR KARTASI (Dinamik o'zgaruvchan) */}
                                <div className="relative group flex flex-col h-full max-h-[520px]">
                                    {/* Dinamik Glow Effect - blur biroz kamaytirildi masofa uchun */}
                                    <div className={`absolute inset-0 blur-[60px] opacity-20 rounded-full transition-colors duration-700 ${activeTab === 'listening' ? 'bg-purple-600' :
                                        activeTab === 'reading' ? 'bg-blue-600' :
                                            activeTab === 'writing' ? 'bg-orange-600' : 'bg-red-600'
                                        }`} />

                                    <div className="bg-slate-900 rounded-[32px] p-8 text-center relative z-10 border border-slate-800 shadow-2xl flex-1 flex flex-col justify-between overflow-hidden">

                                        {/* Noise Effect - Opacity me'yoriga keltirildi (1.2 juda baland edi, 0.15 optimal) */}
                                        <div
                                            className="absolute inset-0 opacity-[1.15] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"
                                            style={{ mixBlendMode: 'overlay' }}
                                        />

                                        <div className="relative z-10 flex-1 flex flex-col justify-center py-2">
                                            {/* Dinamik Zap Icon - Hajmi biroz kichraytirildi: w-20 */}
                                            <motion.div
                                                key={`icon-${activeTab}`}
                                                initial={{ scale: 0.8, rotate: -10 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                className={`w-20 h-20 rounded-[24px] flex items-center justify-center mx-auto mb-6 shadow-2xl transition-colors duration-500 ${activeTab === 'listening' ? 'bg-purple-500/20 text-purple-400' :
                                                    activeTab === 'reading' ? 'bg-blue-500/20 text-blue-400' :
                                                        activeTab === 'writing' ? 'bg-orange-500/20 text-orange-400' : 'bg-red-500/20 text-red-400'
                                                    }`}
                                            >
                                                <Zap size={40} fill="currentColor" />
                                            </motion.div>

                                            <h4 className="text-xl font-black text-white uppercase tracking-[0.2em] mb-3">
                                                {activeTab} <span className="text-slate-500">Simulator</span>
                                            </h4>

                                            <p className="text-slate-400 text-sm leading-relaxed mb-6 mx-auto max-w-[240px]">
                                                Haqiqiy imtihon algoritmi asosida o'z bilimingizni sinab ko'ring.
                                            </p>

                                            {/* Feature List (Glassmorphism) - Padding va Gap qisqartirildi */}
                                            <div className="flex flex-col gap-3 mb-6 text-left bg-white/5 p-5 rounded-[20px] border border-white/10 backdrop-blur-md">
                                                <div className="flex items-center gap-3 text-slate-300 text-xs font-medium">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                                                    Real-time taymer nazorati
                                                </div>
                                                <div className="flex items-center gap-3 text-slate-300 text-xs font-medium">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                                                    AI ball hisoblash tizimi
                                                </div>
                                                <div className="flex items-center gap-3 text-slate-300 text-xs font-medium">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                                                    To'liq xatolar tahlili
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Button - Padding py-4 ga tushirildi */}
                                        <button
                                            onClick={() => router.push(`/auth/login`)}
                                            className="group/btn relative w-full py-4 bg-[#17776A] text-white rounded-[20px] font-black text-xs uppercase tracking-[0.2em] hover:bg-[#136358] transition-all shadow-xl active:scale-95 overflow-hidden"
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                Sinovni boshlash <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </span>
                                            {/* Shimmer Effect (Yaltiroq nur o'tishi) */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT COL (4) --- */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* HALL OF FAME (RESPONSIVE FIX) */}
                        <div className="bg-white rounded-[40px] p-6 sm:p-8 border border-slate-200 shadow-sm">
                            <h3 className="font-black text-slate-900 flex items-center gap-3 mb-10"><Trophy size={22} className="text-yellow-500" /> Yetakchilar</h3>
                            <div className="flex justify-center items-end gap-2 mb-10 h-48 sm:h-56 relative z-10">
                                {HALL_OF_FAME.map((student) => (
                                    <div key={student.id} onClick={() => setSelectedCert(student.image)} className={`flex flex-col items-center group cursor-pointer transition-all ${student.rank === 1 ? 'scale-100 sm:scale-110' : 'scale-90 sm:scale-95'} ${student.position}`}>
                                        <div className="text-2xl mb-1">{student.medal}</div>
                                        <div className={`relative rounded-2xl overflow-hidden border-[4px] ${student.border} bg-white w-20 h-28 sm:w-28 sm:h-36 shadow-lg`}>
                                            <img src={student.image} alt={student.name} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-[#17776A]/80 flex flex-center opacity-0 group-hover:opacity-100 transition-opacity"><Eye className="text-white m-auto" size={24} /></div>
                                        </div>
                                        <p className="mt-3 text-[10px] sm:text-xs font-black text-slate-900 text-center line-clamp-1">{student.name}</p>
                                        <div className="bg-slate-100 px-2 py-0.5 rounded-lg text-[8px] font-black text-[#17776A] mt-1">{student.score} BALL</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RESOURCES */}
                        <div className="bg-[#17776A] rounded-[40px] p-8 text-white shadow-xl relative overflow-hidden group">
                            <div className="absolute inset-0 opacity-[0.2] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
                            <h3 className="font-black text-lg mb-6 flex items-center gap-3 relative z-10 italic uppercase tracking-tight"><Download size={20} className="text-emerald-300" /> Foydali bazalar</h3>
                            <ul className="space-y-4 relative z-10">
                                {[{ title: "Writing Task 2 Shablonlari", icon: BookOpen }, { title: "Speaking Part 2 Mavzulari", icon: Mic }, { title: "Listening uchun Vocabulary", icon: Headphones }].map((item, idx) => (
                                    <li key={idx} className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 transition-all cursor-pointer border border-white/10 group">
                                        <div className="flex items-center gap-3"><div className="p-2 bg-emerald-500/20 rounded-lg"><item.icon size={16} /></div><span className="text-sm font-bold tracking-tight">{item.title}</span></div>
                                        <Download size={18} className="text-emerald-300 group-hover:translate-y-0.5 transition-transform" />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {/* Scrollbar hide CSS */}
            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    )
}