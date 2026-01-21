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

// --- MOCK DATA ---
const HALL_OF_FAME = [
    {
        id: 2, rank: 2, name: "Malika K.", score: "75",
        image: "https://cdn.dribbble.com/users/6028956/screenshots/15742439/media/1d241a735f20bc74407eb343a3338911.jpg?resize=400x300&vertical=center",
        border: "border-slate-300", shadow: "shadow-slate-400/40", medal: "🥈", scale: "scale-95", position: "mt-8 z-0"
    },
    {
        id: 1, rank: 1, name: "Jasur Bek", score: "78",
        image: "https://cdn.dribbble.com/users/6028956/screenshots/15742439/media/1d241a735f20bc74407eb343a3338911.jpg?resize=400x300&vertical=center",
        border: "border-yellow-400", shadow: "shadow-yellow-500/50", medal: "🥇", scale: "scale-110", position: "mt-0 z-10"
    },
    {
        id: 3, rank: 3, name: "Sardor R.", score: "71",
        image: "https://cdn.dribbble.com/users/6028956/screenshots/15742439/media/1d241a735f20bc74407eb343a3338911.jpg?resize=400x300&vertical=center",
        border: "border-orange-400", shadow: "shadow-orange-500/40", medal: "🥉", scale: "scale-95", position: "mt-8 z-0"
    },
]

const DAILY_CHALLENGE = {
    title: "Bugungi Challenj: Lug'at boyligi",
    task: "Writing Task 1 uchun 10 ta akademik so'zni yodlang va mashq qiling.",
    reward: "+50 tanga",
    timeLeft: "4 soat qoldi"
}

// --- YORDAMCHI KOMPONENT (INFO ITEM) ---
function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:bg-white hover:shadow-md transition-all">
            <span className="text-slate-500 font-bold text-sm tracking-tight">{label}</span>
            <span className="font-black text-slate-900 text-sm">{value}</span>
        </div>
    );
}

export default function TestInfoPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'listening' | 'reading' | 'writing' | 'speaking'>('listening')
    const [selectedCert, setSelectedCert] = useState<string | null>(null)

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-28 pb-20 font-sans text-slate-800 relative ">
            {/* LIGHTBOX MODAL */}
            <AnimatePresence>
                {selectedCert && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setSelectedCert(null)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4 md:p-8"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="relative max-w-4xl w-full bg-white p-2 rounded-3xl shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button onClick={() => setSelectedCert(null)} className="absolute -top-4 -right-4 bg-white text-slate-900 p-2 rounded-full shadow-lg hover:bg-slate-100 transition-colors z-10"><X size={24} /></button>
                            <img src={selectedCert} alt="Certificate Full View" className="w-full h-auto rounded-2xl" />
                            <div className="text-center mt-4 mb-2">
                                <button className="inline-flex items-center gap-2 bg-[#17776A] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-[#136358] transition-colors"><Download size={18} /> Asl nusxani yuklab olish</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mx-auto max-w-7xl px-4 relative z-10">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                        <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Imtihon Markazi</h1>
                        <p className="text-slate-500 font-medium text-lg">Rasmiy Multilevel (CEFR) standarti asosida tahlil va mashqlar.</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 shadow-sm text-[#17776A] rounded-2xl font-bold text-sm">
                        <Trophy size={18} className="text-yellow-500" /> Maqsad: <span className="font-black">C1 Daraja</span>
                    </motion.div>
                </div>

                {/* STATS BANNER */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 backdrop-blur-md rounded-[32px] p-6 border border-slate-200 shadow-sm mb-8 flex flex-wrap items-center justify-around gap-6 text-sm "
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Users size={24} /></div>
                        <div><p className="font-black text-slate-900 text-xl tracking-tight">1,250+</p><p className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Faol o'quvchilar</p></div>
                    </div>
                    <div className="w-px h-12 bg-slate-100 hidden md:block"></div>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl"><Flame size={24} /></div>
                        <div><p className="font-black text-slate-900 text-xl tracking-tight">450+</p><p className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Bugun topshirilgan</p></div>
                    </div>
                    <div className="w-px h-12 bg-slate-100 hidden md:block"></div>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-50 text-[#17776A] rounded-2xl"><CheckCircle2 size={24} /></div>
                        <div><p className="font-black text-slate-900 text-xl tracking-tight">85%</p><p className="text-slate-400 font-bold uppercase text-[10px] tracking-wider">Muvaffaqiyat</p></div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-12 gap-8">

                    {/* --- LEFT COL (8) --- */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* DAILY CHALLENGE */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[32px] p-8 relative overflow-hidden shadow-2xl group cursor-pointer border border-slate-700"
                        >
                            {/* 1. Shovqin qatlami (Gradient ustida turadi, lekin rangni buzmaydi) */}
                            <div
                                className="absolute inset-0 opacity-[1.15] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"
                                style={{ mixBlendMode: 'overlay' }}
                            />

                            {/* 2. Chiroyli nur (Zangori effekt) */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#17776A]/20 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-[#17776A]/30 transition-colors z-0" />

                            {/* 3. Kontent (z-10 bo'lishi shart) */}
                            <div className="relative z-10">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-4 bg-white/10 backdrop-blur-xl text-white rounded-2xl group-hover:scale-110 transition-transform">
                                            <Target size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-white tracking-tight">{DAILY_CHALLENGE.title}</h3>
                                            <p className="text-slate-400 text-sm flex items-center gap-2 mt-1">
                                                <Clock size={14} className="text-orange-400" /> {DAILY_CHALLENGE.timeLeft}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="bg-[#17776A] text-white font-black px-4 py-1.5 rounded-xl text-xs flex items-center gap-2 border border-[#17776A] shadow-lg">
                                        <Zap size={14} fill="currentColor" /> {DAILY_CHALLENGE.reward}
                                    </span>
                                </div>
                                <p className="text-slate-300 font-medium text-lg mb-8 leading-relaxed">
                                    {DAILY_CHALLENGE.task}
                                </p>
                                <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-3">
                                    Bajarishni boshlash <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>

                        {/* --- TEST STRUCTURE & INFO (TABS) --- */}
                        <div className="bg-white/80 backdrop-blur-md rounded-[40px] p-10 border border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3.5 bg-[#17776A] rounded-2xl text-white shadow-lg shadow-[#17776A]/20"><Info size={24} /></div>
                                <div><h2 className="text-2xl font-black text-slate-900 tracking-tight">Imtihon nimalardan iborat?</h2><p className="text-slate-400 font-medium">To'rtta asosiy bo'limni o'rganing.</p></div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-10 bg-slate-100/50 p-1.5 rounded-[22px] border border-slate-100">
                                {[
                                    { id: 'listening', label: 'Listening', icon: Headphones, color: 'text-purple-600' },
                                    { id: 'reading', label: 'Reading', icon: BookOpen, color: 'text-blue-600' },
                                    { id: 'writing', label: 'Writing', icon: PenTool, color: 'text-orange-600' },
                                    { id: 'speaking', label: 'Speaking', icon: Mic, color: 'text-red-600' }
                                ].map((tab) => (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 flex items-center justify-center gap-3 px-5 py-4 rounded-2xl text-sm font-black transition-all ${activeTab === tab.id ? 'bg-white text-slate-900 shadow-xl shadow-slate-200/50 border border-slate-100' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'}`}>
                                        <tab.icon size={18} className={activeTab === tab.id ? tab.color : ''} /> {tab.label}
                                    </button>
                                ))}
                            </div>

                            <div className="grid md:grid-cols-2 gap-12 items-stretch">
                                {/* CHAP TOMON: MA'LUMOTLAR BLOKI */}
                                <div className="relative">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeTab}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-6"
                                        >
                                            {activeTab === 'listening' && (
                                                <div className="space-y-6">
                                                    <h3 className="text-3xl font-black text-slate-900">Listening</h3>
                                                    <p className="text-slate-500 font-medium leading-relaxed italic border-l-4 border-purple-500 pl-4">
                                                        "Kundalik va akademik vaziyatlardagi audiolarni tushunish ko'nikmasi."
                                                    </p>
                                                    <div className="grid grid-cols-1 gap-3">
                                                        <InfoItem label="Davomiyligi" value="35 Daqiqa" />
                                                        <InfoItem label="Savollar soni" value="35 Ta" />
                                                        <InfoItem label="Qismlar soni" value="6 Ta Blok" />
                                                        <InfoItem label="Audio turi" value="Dialog/Monolog" />
                                                        <InfoItem label="Daraja" value="A2 dan C1 gacha" />
                                                        <InfoItem label="Maqsad" value="Asosiy g'oya va tahlil" />
                                                    </div>
                                                </div>
                                            )}

                                            {activeTab === 'reading' && (
                                                <div className="space-y-6">
                                                    <h3 className="text-3xl font-black text-slate-900">Reading</h3>
                                                    <p className="text-slate-500 font-medium leading-relaxed italic border-l-4 border-blue-500 pl-4">
                                                        "Akademik va publitsistik matnlarni chuqur tahlil qilish ko'nikmasi."
                                                    </p>
                                                    <div className="grid grid-cols-1 gap-3">
                                                        <InfoItem label="Davomiyligi" value="60 Daqiqa" />
                                                        <InfoItem label="Savollar soni" value="35 Ta" />
                                                        <InfoItem label="Matnlar soni" value="5 Ta Matn" />
                                                        <InfoItem label="Task turlari" value="Matching/Gap Fill" />
                                                        <InfoItem label="Matn turi" value="Ilmiy/Ijtimoiy" />
                                                        <InfoItem label="Maqsad" value="Tez o'qish va tushunish" />
                                                    </div>
                                                </div>
                                            )}

                                            {activeTab === 'writing' && (
                                                <div className="space-y-6">
                                                    <h3 className="text-3xl font-black text-slate-900">Writing</h3>
                                                    <p className="text-slate-500 font-medium leading-relaxed italic border-l-4 border-orange-500 pl-4">
                                                        "Mantiqiy va grammatik to'g'ri insho yozish qobiliyati."
                                                    </p>
                                                    <div className="grid grid-cols-1 gap-3">
                                                        <InfoItem label="Davomiyligi" value="60 Daqiqa" />
                                                        <InfoItem label="Vazifalar" value="3 Ta Task" />
                                                        <InfoItem label="Task 1.1" value="Norasmiy Xat (50 so'z)" />
                                                        <InfoItem label="Task 1.2" value="Rasmiy Xat (120 so'z)" />
                                                        <InfoItem label="Task 2" value="Essay/Post (250 so'z)" />
                                                        <InfoItem label="Baholash" value="AI + Mutaxassis" />
                                                    </div>
                                                </div>
                                            )}

                                            {activeTab === 'speaking' && (
                                                <div className="space-y-6">
                                                    <h3 className="text-3xl font-black text-slate-900">Speaking</h3>
                                                    <p className="text-slate-500 font-medium leading-relaxed italic border-l-4 border-red-500 pl-4">
                                                        "Og'zaki nutqning ravonligi va talaffuzini aniqlash."
                                                    </p>
                                                    <div className="grid grid-cols-1 gap-3">
                                                        <InfoItem label="Davomiyligi" value="15 Daqiqa" />
                                                        <InfoItem label="Qismlar soni" value="3 Ta Part" />
                                                        <InfoItem label="Part 1.1/1.2" value="Intervyu va Rasm Tahlili" />
                                                        <InfoItem label="Part 2" value="Rasm tahlili" />
                                                        <InfoItem label="Part 3" value="Munozara" />
                                                        <InfoItem label="Format" value="Kompyuter orqali" />
                                                    </div>
                                                </div>
                                            )}
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
                                            onClick={() => router.push(`/auth/phone`)}
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

                        {/* HALL OF FAME */}
                        <div className="bg-white rounded-[40px] p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="flex items-center justify-between mb-10 relative z-10">
                                <h3 className="font-black text-slate-900 flex items-center gap-3"><Trophy size={22} className="text-yellow-500" /> Hafta Yetakchilari</h3>
                            </div>

                            {/* PODIUM */}
                            <div className="flex justify-center items-end gap-2 mb-10 h-56 relative z-10">
                                {HALL_OF_FAME.map((student) => (
                                    <div key={student.id} onClick={() => setSelectedCert(student.image)} className={`flex flex-col items-center group cursor-pointer transition-all duration-300 ${student.scale} ${student.position} relative`}>
                                        <div className="text-3xl mb-2 drop-shadow-lg z-20" style={{ animation: student.id === 1 ? 'bounce 3s infinite' : 'none' }}>{student.medal}</div>
                                        <div className={`relative rounded-2xl overflow-hidden border-[4px] ${student.border} ${student.shadow} bg-white w-28 h-36 transition-all group-hover:-translate-y-3 shadow-xl`}>
                                            <img src={student.image} alt={student.name} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-[#17776A]/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <Eye className="text-white mb-2" size={24} />
                                                <span className="text-white text-[10px] font-black uppercase tracking-widest">Ko'rish</span>
                                            </div>
                                        </div>
                                        <div className="mt-4 text-center">
                                            <p className="text-xs font-black text-slate-900 tracking-tight">{student.name}</p>
                                            <div className="inline-flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-lg text-[10px] font-black text-[#17776A] mt-1.5 border border-slate-200 shadow-sm">{student.score} BALL</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-slate-50/80 rounded-[28px] p-6 space-y-3 border border-slate-100 relative z-10 text-slate-600">
                                {HALL_OF_FAME.sort((a, b) => a.rank - b.rank).map((student) => (
                                    <div key={student.id} onClick={() => setSelectedCert(student.image)} className="flex items-center justify-between text-xs p-3 hover:bg-white rounded-2xl transition-all group cursor-pointer border border-transparent hover:border-slate-100 hover:shadow-lg shadow-slate-200/50">
                                        <div className="flex items-center gap-4">
                                            <span className={`font-black w-6 h-6 flex items-center justify-center rounded-lg ${student.rank === 1 ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-200 text-slate-500'}`}>{student.rank}</span>
                                            <span className="font-bold text-slate-800 tracking-tight">{student.name}</span>
                                        </div>
                                        <FileText size={16} className="text-slate-300 group-hover:text-[#17776A] transition-colors" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RESOURCES */}
                        <div className="bg-[#17776A] rounded-[40px] p-8 text-white shadow-2xl shadow-[#17776A]/30 relative overflow-hidden group">

                            {/* 1. Grainy/Noise Effect Overlay */}
                            <div
                                className="absolute inset-0 opacity-[0.5] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"
                                style={{ mixBlendMode: 'overlay' }}
                            />

                            {/* 2. Decorative Glows */}
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl group-hover:bg-white/30 transition-colors z-0" />
                            <div className="absolute -top-10 -left-10 w-24 h-24 bg-emerald-400/20 rounded-full blur-2xl z-0" />

                            {/* 3. Header qismi */}
                            <h3 className="font-black text-xl mb-6 flex items-center gap-3 relative z-10">
                                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                                    <Download size={22} className="text-emerald-300" />
                                </div>
                                Foydali bazalar
                            </h3>

                            {/* 4. List items */}
                            <ul className="space-y-4 relative z-10">
                                {[
                                    { title: "Writing Task 2 Shablonlari", icon: BookOpen },
                                    { title: "Speaking Part 2 Mavzulari", icon: Mic },
                                    { title: "Listening uchun Vocabulary", icon: Headphones }
                                ].map((item, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-md rounded-2xl hover:bg-white/20 transition-all cursor-pointer border border-white/10 group/item overflow-hidden relative"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-emerald-500/20 rounded-lg">
                                                <item.icon size={16} />
                                            </div>
                                            <span className="text-sm font-bold tracking-tight">{item.title}</span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <Download size={18} className="text-emerald-300 group-hover/item:translate-y-0.5 transition-transform" />
                                        </div>

                                        {/* Shimmer Effect on Hover */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/item:animate-shimmer transition-transform duration-1000" />
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}