"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import {
    LayoutGrid, ArrowRight, Zap, Search,
    Calendar, Mic, PenTool, BrainCircuit,
    Headphones, BookOpen, ShieldCheck, Users,
    CheckCircle2, AlertTriangle, Sparkles,
    BarChart3, Clock, Info, ExternalLink,
    ChevronRight
} from "lucide-react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

// --- ANIMATIONS ---
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
}

const stagger = {
    visible: { transition: { staggerChildren: 0.2 } }
}

export default function UltimateAIHome() {
    const router = useRouter()

    // --- STATE MANAGEMENT ---
    const { scrollY } = useScroll()
    const [isScrolled, setIsScrolled] = useState(false)
    const [hoveredCard, setHoveredCard] = useState<number | null>(null) // Hover effekti uchun

    // Navbar scroll logikasi
    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50)
    })

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 selection:bg-[#17776A] selection:text-white overflow-x-hidden">
            {/* ================= 2. HERO SECTION (AI FOCUSED) ================= */}
            <section className="relative pt-40 pb-24 px-4 overflow-hidden">
                {/* Background Tech Mesh */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#17776A 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#17776A]/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>

                <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center">

                    {/* Content */}
                    <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-100 rounded-lg mb-8">
                            <Sparkles size={14} className="text-[#17776A]" />
                            <span className="text-xs font-bold text-[#17776A] uppercase tracking-wide">Yangi: Speaking & Writing AI</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.05] mb-6 tracking-tight">
                            AI yordamida <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#17776A] to-teal-400">
                                Mukammal Natija.
                            </span>
                        </h1>

                        <p className="text-lg text-slate-500 font-medium mb-10 max-w-xl leading-relaxed">
                            Markaziy Osiyodagi birinchi sun'iy intellekt platformasi.
                            Biz nafaqat test olamiz, balki <span className="text-slate-900 font-bold">Speaking</span> va <span className="text-slate-900 font-bold">Writing</span> ko'nikmalaringizni soniyalarda tekshiramiz.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => router.push("/test")}
                                className="h-16 px-10 bg-[#17776A] hover:bg-[#125d53] text-white rounded-2xl font-bold text-lg shadow-xl shadow-[#17776A]/25 transition-all active:scale-95 flex items-center gap-3"
                            >
                                <Zap size={20} />
                                Testni Boshlash
                            </button>
                            <button className="h-16 px-10 bg-white border border-slate-200 text-slate-700 hover:border-[#17776A] hover:text-[#17776A] rounded-2xl font-bold text-lg transition-all flex items-center gap-3">
                                Namuna Ko'rish
                            </button>
                        </div>

                        <p className="mt-6 text-xs text-slate-400 font-medium flex items-center gap-2">
                            <AlertTriangle size={12} className="text-orange-500" />
                            Eslatma: Natijalar faqat diagnostika xarakteriga ega.
                        </p>
                    </motion.div>

                    {/* Interactive AI Visuals */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        className="relative h-[500px] hidden lg:block"
                    >
                        {/* Reading Card (Back) */}
                        <div className="absolute top-0 left-10 bg-white p-6 rounded-[30px] shadow-xl border border-slate-100 w-80 transform -rotate-3 z-10 opacity-80 hover:rotate-0 transition-transform duration-500">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-[#17776A]/30 rounded-lg text-[#17776A]"><BookOpen size={20} /></div>
                                <h4 className="font-bold text-slate-800">Full Reading</h4>
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 w-full bg-slate-100 rounded-full"></div>
                                <div className="h-2 w-[90%] bg-slate-100 rounded-full"></div>
                                <div className="h-2 w-[40%] bg-green-100 rounded-full relative">
                                    <div className="absolute -top-1 -right-2 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs font-mono text-slate-500">
                                Fast: "Reading Result: C1"
                            </div>
                        </div>

                        {/* Writing Card (Back) */}
                        <div className="absolute top-20 right-10 bg-white p-6 rounded-[30px] shadow-xl border border-slate-100 w-80 transform rotate-6 z-10 opacity-80 hover:rotate-0 transition-transform duration-500">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><PenTool size={20} /></div>
                                <h4 className="font-bold text-slate-800">Writing Task 2</h4>
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 w-full bg-slate-100 rounded-full"></div>
                                <div className="h-2 w-[90%] bg-slate-100 rounded-full"></div>
                                <div className="h-2 w-[40%] bg-blue-100 rounded-full relative">
                                    <div className="absolute -top-1 -right-2 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs font-mono text-slate-500">
                                AI: "Grammar accuracy: C1"
                            </div>
                        </div>

                        <div className="absolute top-40 top-20 left-10 bg-white p-7 rounded-[30px] shadow-xl border border-slate-100 w-80 transform -rotate-3 z-10 opacity-80 hover:rotate-0 transition-transform duration-500">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Headphones size={20} /></div>
                                <h4 className="font-bold text-slate-800">Full Listening</h4>
                            </div>
                            <div className="space-y-2">
                                <div className="h-2 w-full bg-slate-100 rounded-full"></div>
                                <div className="h-2 w-[90%] bg-slate-100 rounded-full"></div>
                                <div className="h-2 w-[40%] bg-orange-100 rounded-full relative">
                                    <div className="absolute -top-1 -right-2 w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs font-mono text-slate-500">
                                Fast: "Listening Result: C1"
                            </div>
                        </div>
                        {/* Speaking Card (Front) */}
                        <div className="absolute top-60 right-15 bg-white/90 backdrop-blur-xl p-8 rounded-[36px] shadow-2xl border border-white/60 w-96 z-20 transform rotate-6 hover:rotate-0 transition-transform duration-500">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Speaking AI</p>
                                    <h3 className="text-2xl font-black text-slate-900">Pronunciation</h3>
                                </div>
                                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500 ">
                                    <Mic size={24} />
                                </div>
                            </div>

                            {/* Audio Wave Simulation */}
                            <div className="flex items-center justify-center gap-1 h-12 mb-6">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: [10, 30, 10] }}
                                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                                        className="w-1.5 bg-gradient-to-t from-red-500 to-reed-400 rounded-full"
                                    />
                                ))}
                            </div>

                            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <span className="text-sm font-bold text-slate-600">Band Score</span>
                                <span className="text-3xl font-black text-red-500">C1</span>
                            </div>
                        </div>

                    </motion.div>
                </div>
            </section>
            {/* ================= 3. SERVICE (Xizmatlar) ================= */}
            <section className="py-10 px-4">
                <div className="mx-auto max-w-7xl">
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {/* Katta Karta (Dark Mode) */}
                        <motion.div
                            variants={fadeInUp}
                            className="md:col-span-2 bg-[#17776A] rounded-[32px] p-10 text-white relative overflow-hidden group shadow-xl shadow-[#17776A]/20 cursor-pointer"
                        >
                            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 transition-all duration-700 group-hover:scale-150"></div>
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div>
                                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                                        <Zap size={32} className="text-white" />
                                    </div>
                                    <h3 className="text-3xl font-black mb-3">AI Diagnostik Test</h3>
                                    <p className="text-emerald-100 text-lg max-w-md leading-relaxed">
                                        Sun'iy intellekt yordamida speaking va writing ko'nikmalaringizni chuqur tahlil qiling.
                                    </p>
                                </div>
                                <div className="mt-10 flex items-center gap-2 font-bold text-emerald-200 group-hover:text-white transition-colors">
                                    Sinab ko'rish <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Kichik Karta 1 */}
                        <motion.div
                            variants={fadeInUp}
                            className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group"
                        >
                            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform">
                                <AlertTriangle size={28} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">Disclaimer</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                Ushbu test natijalari rasmiy hujjat hisoblanmaydi. Faqat o'z-o'zini tekshirish uchun.
                            </p>
                        </motion.div>

                        {/* Kichik Karta 2 */}
                        <motion.div
                            variants={fadeInUp}
                            className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all group"
                        >
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                                <BarChart3 size={28} />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">Statistika</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                Har bir bo'lim bo'yicha batafsil grafiklar va o'sish dinamikasi.
                            </p>
                        </motion.div>

                        {/* O'rta Karta (Horizontal) */}
                        <motion.div
                            variants={fadeInUp}
                            className="md:col-span-2 bg-slate-900 rounded-[32px] p-10 text-white relative overflow-hidden shadow-xl"
                        >
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                                <div className="flex-1">
                                    <div className="inline-block px-3 py-1 bg-white/10 rounded-lg text-xs font-bold mb-4">NEW</div>
                                    <h3 className="text-2xl font-black mb-2">Speaking Simulator</h3>
                                    <p className="text-slate-400">Haqiqiy imtihondagi kabi examiner bilan jonli suhbat simulyatsiyasi.</p>
                                </div>
                                <div className="w-full md:w-auto bg-slate-800 p-4 rounded-2xl border border-slate-700 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                                        <div className="w-4 h-4 bg-white rounded-sm"></div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-mono">REC</p>
                                        <p className="text-lg font-mono font-bold">00:04:12</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* ================= 6. PRICING SECTION (YANGI) ================= */}
            <section id="pricing" className="py-32 px-4 bg-[#FDFDFF] relative overflow-hidden">

                {/* 1. BACKGROUND DECOR (Dinamik nurlar) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-6xl -z-10 pointer-events-none">
                    {/* Zumrad nur */}
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#17776A]/10 blur-[120px] rounded-full" />
                    {/* Binafsha nur */}
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100 blur-[120px] rounded-full" />

                    {/* Global Grainy Overlay */}
                    <div
                        className="absolute inset-0 opacity-[0.2] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"
                        style={{ filter: 'contrast(130%) brightness(110%)' }}
                    />
                </div>

                <div className="mx-auto max-w-7xl relative z-10">

                    {/* HEADER */}
                    <div className="text-center mb-24">
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-slate-100 shadow-xl shadow-slate-200/50 text-[#17776A] text-[10px] font-black uppercase tracking-[0.3em] mb-8"
                        >
                            <Zap size={14} className="fill-[#17776A]" /> Imtihon tariflari
                        </motion.div>
                        <h2 className="text-4xl md:text-6xl font-black text-[#0F172A] mb-6 tracking-tighter leading-tight">
                            O'z maqsadingizga <br /> <span className="text-[#17776A]">to'g'ri sarmoya</span> qiling.
                        </h2>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                            Bepul testlardan boshlang yoki sun'iy intellekt yordamida chuqur tahlilga ega bo'ling.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">

                        {/* --- 1. STANDARD (Och kulrang/Oq) --- */}
                        <PricingCard
                            title="Standard"
                            price="0"
                            currency="UZS"
                            description="Boshlang'ich darajani aniqlash uchun"
                            features={[
                                "Barcha Listening testlar",
                                "Barcha Reading testlar",
                                "Avtomatik natija hisoblash",
                                "Cheksiz urinishlar"
                            ]}
                            buttonText="Bepul boshlash"
                            type="standard"
                        />

                        {/* --- 2. WRITING AI (Zangori/Emerald) --- */}
                        <PricingCard
                            title="Writing AI"
                            price="14,900"
                            currency="UZS"
                            description="Insho va grammatika tahlili"
                            features={[
                                "AI orqali inshoni tekshirish",
                                "Band Score (C1/B2) aniqlash",
                                "Grammatik xatolar ro'yxati",
                                "Lug'at boyligini yaxshilash"
                            ]}
                            buttonText="Essay yozish"
                            type="premium-teal"
                            badge="Ommabop"
                            icon={<PenTool size={16} />}
                        />

                        {/* --- 3. SPEAKING AI (Deep Dark/Midnight) --- */}
                        <PricingCard
                            title="Speaking AI"
                            price="25,000"
                            currency="UZS"
                            description="Jonli suhbat simulyatsiyasi"
                            features={[
                                "AI Examiner bilan suhbat",
                                "Talaffuz (Pronunciation) tahlili",
                                "Ravonlik (Fluency) monitoringi",
                                "To'liq feedback report (PDF)"
                            ]}
                            buttonText="Suhbatni boshlash"
                            type="dark"
                            icon={<Mic size={16} />}
                        />

                    </div>

                    {/* TRUST FOOTER */}
                    <div className="mt-20 flex flex-col items-center gap-8">
                        <div className="flex items-center gap-3 font-black text-slate-300 uppercase tracking-[0.2em] text-[10px]">
                            <div className="h-px w-12 bg-slate-200" />
                            <ShieldCheck size={16} /> Xavfsiz to'lov tizimlari
                            <div className="h-px w-12 bg-slate-200" />
                        </div>
                        <div className="flex items-center gap-12 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 cursor-pointer">
                            <img src="banner-payme.png" alt="Payme" className="h-8" />
                            <img src="banner-uzumbank.png" alt="Uzum" className="h-8" />
                            <img src="banner-click.png" alt="Clik" className="h-8"/>
                            <img src="banner-humo.png" alt="Humo" className="h-8"/>
                            <img src="banner-uzcard.gif" alt="Uzcard" className="h-8"/>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

// --- SUB-COMPONENT: PRICING CARD ---
function PricingCard({ title, price, currency, description, features, buttonText, type, badge, icon }: any) {
    const isDark = type === 'dark';
    const isTeal = type === 'premium-teal';

    return (
        <motion.div
            whileHover={{ y: -15, scale: 1.02 }}
            className={`p-10 rounded-[40px] border relative overflow-hidden flex flex-col transition-all duration-500
                ${isDark ? 'bg-[#0F172A] border-slate-800 shadow-[0_30px_60px_-15px_rgba(15,23,42,0.3)] text-white' :
                    isTeal ? 'bg-white border-[#17776A]/20 shadow-[0_30px_60px_-15px_rgba(23,119,106,0.15)] shadow-[#17776A]/10' :
                        'bg-white border-slate-100 shadow-xl shadow-slate-200/50'}`}
        >
            {/* Grainy Texture Layer */}
            <div className={`absolute inset-0 opacity-[0.1] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] ${isDark ? 'opacity-[1.2] mix-blend-overlay' : ''}`} />

            {badge && (
                <div className="absolute top-8 right-8 z-20">
                    <span className="bg-[#17776A] text-white text-[9px] font-black uppercase px-4 py-2 rounded-full tracking-widest shadow-lg shadow-[#17776A]/30">
                        {badge}
                    </span>
                </div>
            )}

            <div className="mb-12 relative z-10">
                <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] mb-5 
                    ${isDark ? 'text-emerald-400' : isTeal ? 'text-[#17776A]' : 'text-slate-400'}`}>
                    {icon} {title}
                </div>
                <div className="flex items-baseline gap-1">
                    <h3 className={`text-5xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>
                        {price}
                    </h3>
                    <span className="text-xs font-bold text-slate-400 ml-2 uppercase tracking-widest">{currency}</span>
                </div>
                <p className="text-slate-400 text-sm mt-4 font-medium leading-relaxed">{description}</p>
            </div>

            <ul className="space-y-5 mb-12 relative z-10 flex-1">
                {features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-4 text-[13px] font-bold tracking-tight text-slate-600">
                        <div className={`p-1 rounded-full shrink-0 mt-0.5 ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#17776A]/10 text-[#17776A]'}`}>
                            <CheckCircle2 size={14} />
                        </div>
                        <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{feature}</span>
                    </li>
                ))}
            </ul>

            <div className="relative z-10">
                <button className={`group/btn w-full py-5 rounded-[22px] font-black text-[11px] uppercase tracking-[0.2em] transition-all overflow-hidden relative active:scale-95 shadow-lg
                    ${isDark ? 'bg-[#17776A] text-white hover:bg-[#136358]' :
                        isTeal ? 'bg-[#0F172A] text-white hover:bg-slate-800 shadow-slate-200' :
                            'bg-slate-50 text-slate-500 border border-slate-100 hover:bg-slate-100'}`}>

                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {buttonText} <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </span>

                    {/* Shimmer Effect */}
                    {(isDark || isTeal) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_2s_infinite] transition-transform duration-1000" />
                    )}
                </button>
            </div>
        </motion.div>
    )
}