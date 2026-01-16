"use client"

import React, { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import {
    Headphones, BookOpen, Pencil, Mic, ArrowRight,
    Sparkles, Zap, ShieldCheck, Globe2, Play,
    CheckCircle2, Star, Award, BarChart3, ChevronRight,
    Layers, Globe, Menu, X, ChevronDown
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

/**
 * ==========================================================
 * HERO EXAM TILE COMPONENT
 * ==========================================================
 */
const HeroExamTile = ({ icon: Icon, label, desc, color, className = "" }: any) => (
    <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        className={`bg-white p-6 md:p-8 rounded-[30px] md:rounded-[40px] border border-slate-100 flex flex-col items-center text-center group transition-all duration-500 shadow-sm hover:shadow-xl ${className}`}
    >
        <div
            className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-white mb-4 md:mb-6 shadow-xl group-hover:rotate-6 transition-transform duration-500"
            style={{ background: color }}
        >
            <Icon size={28} />
        </div>
        <h3 className="text-lg md:text-xl font-black text-slate-900 mb-1 md:mb-2">{label}</h3>
        <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
            {desc}
        </p>
    </motion.div>
);

/**
 * ==========================================================
 * MAIN LANDING PAGE
 * ==========================================================
 */
export default function UltimateIELTSLanding() {
    const router = useRouter();
    const heroRef = useRef(null);

    // Parallax effekti uchun scroll tahlili
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div className="min-h-screen bg-[#FDFDFF] text-slate-900 selection:bg-red-100 selection:text-red-600 font-sans overflow-x-hidden">
            <Navbar />

            {/* ================= 1. HERO SECTION ================= */}
            <section ref={heroRef} className="relative min-h-screen flex items-center pt-24 pb-12 md:pt-32 md:pb-20 overflow-hidden">
                {/* Orqa fon elementlari */}
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute top-[-10%] left-[-5%] w-[80%] md:w-[60%] h-[60%] bg-gradient-to-br from-red-400/20 to-orange-300/10 blur-[100px] md:blur-[130px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[5%] right-[-5%] w-[60%] md:w-[40%] h-[50%] bg-gradient-to-tr from-blue-400/15 to-indigo-300/10 blur-[100px] md:blur-[130px] rounded-full" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:30px_30px] md:bg-[size:40px_40px]" />
                </div>

                <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Matn qismi */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10 text-center lg:text-left"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-red-100 shadow-xl shadow-red-500/5 mb-6 md:mb-8">
                            <Sparkles className="w-4 h-4 text-red-600 fill-red-600" />
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-red-700">World-Class AI Assessment</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] md:leading-[0.9] tracking-tighter text-slate-900 mb-6 md:mb-8">
                            Unlock Your <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-600 to-red-600">
                                Global Potential.
                            </span>
                        </h1>

                        <p className="mx-auto lg:mx-0 max-w-xl text-lg md:text-xl text-slate-500 font-medium leading-relaxed mb-8 md:mb-10">
                            The only AI-integrated platform that predicts your CEFR band score with 99% accuracy.
                            Authentic materials, instant feedback, and total precision.
                        </p>

                        <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center justify-center lg:justify-start">
                            <button
                                onClick={() => router.push("/test")}
                                className="w-full sm:w-auto h-16 px-10 bg-red-600 text-white hover:bg-red-700 rounded-2xl text-lg font-black shadow-2xl shadow-red-200 transition-all active:scale-95 flex items-center justify-center gap-3"
                            >
                                Start Free Test <ArrowRight size={20} />
                            </button>
                            <button className="w-full sm:w-auto h-16 px-10 rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-md text-lg font-bold hover:bg-slate-50 transition-all">
                                View Samples
                            </button>
                        </div>

                        {/* Statistik ko'rsatkichlar */}
                        <div className="mt-12 md:mt-16 flex items-center justify-center lg:justify-start gap-6 md:gap-8 border-t border-slate-100 pt-8 md:pt-10">
                            <div className="flex flex-col text-left">
                                <span className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter leading-none italic">C1</span>
                                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">Band Score Goal</span>
                            </div>
                            <div className="h-10 w-px bg-slate-200" />
                            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                                <div className="flex text-yellow-500 gap-0.5 mb-1">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                                </div>
                                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-slate-400">Trusted by 500k+ Students</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Vizual qism (Skill Cards) */}
                    <motion.div style={{ y: y1 }} className="relative mt-12 lg:mt-0">
                        <div className="absolute -inset-4 md:-inset-10 bg-gradient-to-br from-red-500/10 via-blue-500/10 blur-[60px] md:blur-[100px] rounded-full animate-spin-slow" />

                        <div className="relative grid grid-cols-2 gap-4 md:gap-6">
                            <div className="space-y-4 md:space-y-6 translate-y-8 md:translate-y-12">
                                <HeroExamTile icon={Headphones} label="Listening" desc="Acoustic Linguistics" color="linear-gradient(135deg, #A855F7 0%, #7E22CE 100%)" />
                                <HeroExamTile icon={Pencil} label="Writing" desc="Neural Evaluation" color="linear-gradient(135deg, #F97316 0%, #EA580C 100%)" />
                            </div>
                            <div className="space-y-4 md:space-y-6">
                                <HeroExamTile icon={BookOpen} label="Reading" desc="Semantic Accuracy" color="linear-gradient(135deg, #22C55E 0%, #15803D 100%)" />
                                <HeroExamTile icon={Mic} label="Speaking" desc="Phonetic Precision" color="linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)" />
                            </div>

                            {/* Markaziy AI Badge */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-2xl p-4 md:p-8 rounded-[30px] md:rounded-[40px] border border-white shadow-2xl flex flex-col items-center z-20 min-w-[120px] md:min-w-[180px]"
                            >
                                <div className="w-10 h-10 md:w-16 md:h-16 bg-gradient-to-br from-red-600 to-pink-600 rounded-xl md:rounded-2xl flex items-center justify-center text-white mb-2 md:mb-4 shadow-xl shadow-red-200">
                                    <BarChart3 size={24} className="md:w-8 md:h-8" />
                                </div>
                                <span className="text-lg md:text-2xl font-black text-slate-900 tracking-tighter italic leading-none uppercase">AI HUB</span>
                                <span className="text-[8px] md:text-[10px] font-bold text-red-600 uppercase tracking-[0.3em] mt-1 md:mt-2">Active</span>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ================= 2. TRUST BAR ================= */}
            <div className="py-12 md:py-20 border-y border-slate-50 bg-white/50 backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-6">
                    <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 text-center mb-8 md:mb-12">Aligned with global assessment standards</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-24 opacity-30 grayscale contrast-125">
                        {["CEFR", "IELTS", "OXFORD", "CAMBRIDGE", "BRITISH COUNCIL"].map((brand) => (
                            <span key={brand} className="text-xl md:text-3xl font-black tracking-tighter italic">{brand}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ================= 3. BENTO FEATURES ================= */}
            <section className="py-20 md:py-32 bg-white relative">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end mb-12 md:mb-16 gap-8 text-center lg:text-left">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4 md:mb-6 leading-none text-slate-900">Master every <br className="hidden md:block" /> module.</h2>
                            <p className="text-base md:text-lg text-slate-500 font-medium">Engineered by linguists to ensure the same rigor as the actual IELTS exam.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {/* Asosiy katta karta */}
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="md:col-span-2 bg-gradient-to-br from-slate-900 to-indigo-950 p-8 md:p-12 lg:p-20 rounded-[40px] md:rounded-[60px] text-white relative overflow-hidden group shadow-2xl"
                        >
                            <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-red-600/20 blur-[80px] md:blur-[120px] rounded-full group-hover:bg-red-600/30 transition-all duration-700" />
                            <div className="relative z-10 flex flex-col justify-between h-full">
                                <div>
                                    <Award className="text-red-500 mb-6 md:mb-8" size={56} />
                                    <h3 className="text-3xl md:text-5xl font-black mb-6 md:mb-8 tracking-tighter leading-tight md:leading-none">Diagnostic Result <br /> Technology</h3>
                                    <p className="max-w-md text-slate-400 text-base md:text-lg leading-relaxed">
                                        Receive a 24-page performance report that breaks down your grammar,
                                        vocabulary, and coherence levels across all bands.
                                    </p>
                                </div>
                                <button className="w-full sm:w-fit mt-10 md:mt-12 bg-white text-slate-950 hover:bg-red-600 hover:text-white rounded-2xl px-10 py-5 font-bold uppercase tracking-widest text-xs transition-all">
                                    See Sample Report
                                </button>
                            </div>
                        </motion.div>

                        {/* Kichik karta 1 */}
                        <motion.div whileHover={{ y: -10 }} className="bg-blue-50 p-8 md:p-12 rounded-[40px] md:rounded-[60px] border border-blue-100 flex flex-col items-center text-center justify-center shadow-sm">
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-[32px] shadow-xl flex items-center justify-center text-blue-600 mb-6 md:mb-8 group-hover:scale-110 transition-transform">
                                <Globe2 size={40} />
                            </div>
                            <h3 className="text-xl md:text-2xl font-black mb-4 uppercase tracking-tighter">Global Reach</h3>
                            <p className="text-slate-500 text-sm font-medium">Accepted by 120+ institutions worldwide for diagnostic placement.</p>
                        </motion.div>

                        {/* Kichik karta 2 */}
                        <motion.div whileHover={{ y: -10 }} className="bg-red-50 p-8 md:p-12 rounded-[40px] md:rounded-[60px] border border-red-100 flex flex-col items-center text-center justify-center shadow-sm">
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-[32px] shadow-xl flex items-center justify-center text-red-600 mb-6 md:mb-8 group-hover:scale-110 transition-transform">
                                <Zap size={40} />
                            </div>
                            <h3 className="text-xl md:text-2xl font-black mb-4 uppercase tracking-tighter">Instant Scoring</h3>
                            <p className="text-slate-500 text-sm font-medium">Get your band score 60 seconds after completing the test.</p>
                        </motion.div>

                        {/* O'rta karta */}
                        <motion.div whileHover={{ y: -10 }} className="md:col-span-2 bg-slate-50 border border-slate-200 p-8 md:p-12 lg:p-16 rounded-[40px] md:rounded-[60px] flex flex-col md:flex-row items-center gap-10 md:gap-16 overflow-hidden">
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-3xl md:text-4xl font-black mb-4 md:mb-6 tracking-tighter uppercase leading-none">Authentic Library</h3>
                                <p className="text-slate-500 mb-8 md:mb-10 text-base md:text-lg font-medium">Practice with official CEFR-style prompts and actual past papers.</p>
                                <ul className="space-y-4 inline-block text-left">
                                    {['Reading Passages', 'Task 1 Data Visuals', 'Speaking Simulations'].map(item => (
                                        <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-800">
                                            <CheckCircle2 size={20} className="text-blue-600" /> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex-1 text-[80px] md:text-[120px] font-black text-slate-200/50 uppercase -rotate-12 select-none tracking-tighter hidden sm:block">
                                ENWIS
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ================= 4. EVALUATION SECTION ================= */}
            <section className="py-20 md:py-32 bg-[#F8F9FA] border-y border-slate-100">
                <div className="mx-auto max-w-7xl px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Progress Bars Vizualizatsiyasi */}
                    <div className="relative order-2 lg:order-1">
                        <div className="absolute -inset-10 bg-gradient-to-br from-red-600/10 to-transparent blur-[80px]" />
                        <div className="relative bg-white p-8 md:p-12 rounded-[40px] md:rounded-[60px] shadow-2xl border border-slate-100">
                            <div className="space-y-6 md:space-y-8">
                                {[
                                    { label: "Vocabulary", score: "C1", width: "85%" },
                                    { label: "Grammar", score: "C1", width: "90%" },
                                    { label: "Fluency", score: "B2+", width: "75%" },
                                    { label: "Cohesion", score: "C1", width: "88%" },
                                    { label: "Accuracy", score: "C2", width: "94%" },
                                ].map((item, i) => (
                                    <div key={i} className="space-y-3">
                                        <div className="flex justify-between font-black uppercase text-[9px] md:text-[10px] tracking-widest text-slate-400">
                                            <span>{item.label}</span>
                                            <span className="text-red-600 italic font-black text-sm">{item.score}</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: item.width }}
                                                transition={{ duration: 1.5, ease: "easeOut" }}
                                                className="h-full bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.3)]"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Matn qismi */}
                    <div className="order-1 lg:order-2 text-center lg:text-left">
                        <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter uppercase mb-6 md:mb-10 leading-[0.95] md:leading-[0.85] text-slate-900">
                            How we <br /> <span className="text-red-600">evaluate</span> you.
                        </h2>
                        <p className="text-slate-500 text-lg md:text-xl mb-10 md:mb-12 font-medium italic">Our AI analyzes phonetic pitch, syntactic density, and logical flow with extreme precision.</p>
                        <div className="space-y-8 md:space-y-10">
                            {[
                                { icon: Layers, title: "Neural Phonetic Engine", desc: "Measures accent, intonation and pronunciation against native standards." },
                                { icon: Globe, title: "Lexical Analysis", desc: "Scans vocabulary range, academic synonym usage, and collocation accuracy." }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col sm:flex-row items-center lg:items-start gap-4 md:gap-8 group">
                                    <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg text-slate-900 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 border border-slate-50">
                                        <item.icon size={28} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl md:text-2xl font-black mb-2 tracking-tight">{item.title}</h4>
                                        <p className="text-slate-500 font-medium text-sm md:text-base">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= 5. FAQ SECTION ================= */}
            <section className="py-20 md:py-32 bg-white">
                <div className="mx-auto max-w-4xl px-6">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-12 md:mb-16 text-center text-slate-900">Expert Guidance</h2>
                    <div className="space-y-4">
                        {[
                            { q: "Is the AI score accurate?", a: "Our scoring engine is calibrated against thousands of human-graded CEFR exams, reaching 99.2% agreement with expert British Council examiners." },
                            { q: "How long until I get results?", a: "Reading and Listening results are instant. Writing and Speaking analysis, including full feedback, takes less than 60 seconds." },
                            { q: "Can I use this for institutional placement?", a: "Absolutely. Our diagnostic reports are used by language schools across Central Asia for student level assessment." },
                            { q: "Do you offer official certificates?", a: "While we provide a comprehensive ENWIS AI Achievement Report, for official migration you will still need an official IELTS/CEFR certificate." }
                        ].map((item, i) => (
                            <details key={i} className="group border border-slate-100 rounded-[24px] md:rounded-[32px] p-6 md:p-8 hover:bg-slate-50 transition-all cursor-pointer">
                                <summary className="flex justify-between items-center font-black text-slate-900 uppercase text-xs md:text-sm tracking-widest list-none">
                                    {item.q}
                                    <ChevronRight size={18} className="group-open:rotate-90 transition-transform text-red-600 shrink-0 ml-4" />
                                </summary>
                                <p className="mt-6 text-slate-500 font-medium leading-relaxed italic border-t border-slate-100 pt-6 text-sm md:text-base">
                                    {item.a}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= 6. FINAL CTA ================= */}
            <section className="py-20 md:py-32 px-6">
                <motion.div
                    whileHover={{ scale: 0.995 }}
                    className="mx-auto max-w-7xl bg-white border border-slate-200 p-10 md:p-20 lg:p-32 rounded-[50px] md:rounded-[80px] text-center relative overflow-hidden shadow-2xl group"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,#fecaca30,transparent_50%)]" />
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-7xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.9] md:leading-[0.85] mb-8 md:mb-12 text-slate-900">
                            Meet your <br /> <span className="text-red-600 italic underline decoration-red-100">destiny</span> today.
                        </h2>
                        <p className="max-w-xl mx-auto text-lg md:text-xl text-slate-500 mb-10 md:mb-16 font-medium italic">
                            Thousands of students have secured their target scores.
                            Join them today and get your first diagnostic test for free.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
                            <button
                                onClick={() => router.push("/test")}
                                className="h-16 md:h-20 px-10 md:px-16 bg-red-600 text-white hover:bg-red-700 rounded-[24px] md:rounded-[30px] text-xl md:text-2xl font-black shadow-2xl shadow-red-200 transition-all active:scale-95"
                            >
                                Launch Test Now
                            </button>
                            <button className="h-16 md:h-20 px-10 md:px-16 rounded-[24px] md:rounded-[30px] border border-slate-200 bg-white text-lg md:text-2xl font-bold hover:bg-slate-50 text-slate-900">
                                Institutional Login
                            </button>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* LIVE RESULT POPUP (Faqat Desktop uchun) */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="hidden xl:flex fixed bottom-10 left-10 z-[50] bg-white p-5 rounded-[24px] border border-slate-100 shadow-2xl items-center gap-5 max-w-[320px]"
            >
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 shrink-0">
                    <CheckCircle2 size={24} />
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Live Result</p>
                    <p className="text-sm font-bold text-slate-900 leading-tight">Student #UZ-492 just achieved <span className="text-red-600 italic">C1 Advanced</span></p>
                </div>
            </motion.div>

            <Footer />
        </div>
    )
}