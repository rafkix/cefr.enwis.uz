"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import {
    ArrowRight, Zap,Mic, PenTool, Headphones, BookOpen, ShieldCheck,
    CheckCircle2, AlertTriangle, Sparkles, Heart, HandHeart, GraduationCap // ❤️ Kerakli iconlar
} from "lucide-react"

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

    // Navbar scroll logikasi
    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50)
    })

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 selection:bg-[#17776A] selection:text-white overflow-x-hidden">

            {/* ================= 2. HERO SECTION (AI FOCUSED) ================= */}
            <section className="relative pt-40 pb-24 px-6 md:px-12 lg:px-20 overflow-hidden">
                {/* Background Tech Mesh */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#17776A 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#17776A]/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>

                <div className="mx-auto max-w-[1536px] grid lg:grid-cols-2 gap-16 items-center">

                    {/* Content */}
                    <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-100 rounded-lg mb-8">
                            <Sparkles size={14} className="text-[#17776A]" />
                            <span className="text-xs font-bold text-[#17776A] uppercase tracking-wide">Yangi: Speaking & Writing AI</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-[1.05] mb-6 tracking-tight">
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
                        className="relative h-[550px] hidden lg:block origin-right scale-110"
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
                        <div className="absolute top-20 right-20 bg-white p-6 rounded-[30px] shadow-xl border border-slate-100 w-80 transform rotate-6 z-10 opacity-80 hover:rotate-0 transition-transform duration-500">
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

                        {/* Listening Card */}
                        <div className="absolute top-40 left-10 bg-white p-7 rounded-[30px] shadow-xl border border-slate-100 w-80 transform -rotate-3 z-10 opacity-80 hover:rotate-0 transition-transform duration-500">
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
                        <div className="absolute top-60 right-20 bg-white/90 backdrop-blur-xl p-8 rounded-[36px] shadow-2xl border border-white/60 w-96 z-20 transform rotate-6 hover:rotate-0 transition-transform duration-500">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Speaking AI</p>
                                    <h3 className="text-2xl font-black text-slate-900">Pronunciation</h3>
                                </div>
                                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500">
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
                                        className="w-1.5 bg-gradient-to-t from-red-500 to-red-400 rounded-full"
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

            {/* ================= ❤️ 3. CHARITY SECTION (YANGI QO'SHILDI) ================= */}
            <section className="py-24 px-6 md:px-12 lg:px-20 bg-white relative overflow-hidden">
                {/* Dekorativ fon */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-rose-50/50 via-white to-white pointer-events-none"></div>
                
                <div className="mx-auto max-w-[1536px] relative z-10">
                    <div className="bg-[#FFF0F5]/40 border border-rose-100 rounded-[3rem] p-8 md:p-16 lg:p-20 relative overflow-hidden">
                        {/* Orqa fon effektlari */}
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-100/40 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
                        
                        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative z-10">
                            
                            {/* Chap tomon: Matn */}
                            <div className="flex-1 space-y-8 text-center lg:text-left">
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-white text-rose-600 rounded-full text-xs font-black uppercase tracking-widest shadow-sm border border-rose-100"
                                >
                                    <HandHeart size={14} /> Ijtimoiy Mas'uliyat
                                </motion.div>
                                
                                <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight">
                                    Har bir test — <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-red-600">yangi imkoniyat.</span>
                                </h2>
                                
                                <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                    Biz foydamizning <span className="font-bold text-slate-900 border-b-2 border-rose-200">5% qismini</span> imkoniyati cheklangan va ota-ona qaramog'idan mahrum bo'lgan iqtidorli bolalarning ta'lim olishiga (grantlar) yo'naltiramiz. 
                                </p>
                                
                                {/* Stats Cards */}
                                <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-2">
                                    <motion.div 
                                        whileHover={{ y: -5 }}
                                        className="flex items-center gap-4 bg-white px-6 py-5 rounded-2xl border border-rose-100 shadow-lg shadow-rose-100/30"
                                    >
                                        <div className="p-3 bg-rose-50 text-rose-500 rounded-xl">
                                            <GraduationCap size={28} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-2xl font-[900] text-slate-900 leading-none">120+</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-wider">Ta'lim Grantlari</p>
                                        </div>
                                    </motion.div>
                                    
                                    <motion.div 
                                        whileHover={{ y: -5 }}
                                        className="flex items-center gap-4 bg-white px-6 py-5 rounded-2xl border border-rose-100 shadow-lg shadow-rose-100/30"
                                    >
                                        <div className="p-3 bg-rose-50 text-rose-500 rounded-xl">
                                            <Heart size={28} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-2xl font-[900] text-slate-900 leading-none">50m</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-wider">Xayriya Summasi</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                            
                            {/* O'ng tomon: Visual */}
                            <div className="flex-1 flex justify-center w-full">
                                <div className="relative w-full max-w-md aspect-square bg-white rounded-full flex items-center justify-center shadow-2xl shadow-rose-200/50 border border-rose-50">
                                    <div className="absolute inset-0 bg-rose-100 rounded-full animate-ping opacity-20" />
                                    <div className="relative z-10 flex flex-col items-center text-center p-10">
                                        <Heart size={140} className="text-rose-500 fill-rose-500 drop-shadow-2xl animate-pulse mb-6" />
                                        <span className="text-sm font-black text-rose-400 uppercase tracking-[0.3em] mb-2">Enwis Charity</span>
                                        <span className="text-3xl font-bold text-slate-900">Yaxshilik ulashing</span>
                                    </div>
                                    
                                    {/* Orbiting Badges */}
                                    <motion.div 
                                        animate={{ y: [0, -15, 0] }} 
                                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                        className="absolute top-12 right-0 bg-white px-6 py-3 rounded-2xl shadow-xl border border-rose-100 flex items-center gap-3"
                                    >
                                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />
                                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Mehr</span>
                                    </motion.div>
                                    <motion.div 
                                        animate={{ y: [0, 15, 0] }} 
                                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                                        className="absolute bottom-16 left-0 bg-white px-6 py-3 rounded-2xl shadow-xl border border-rose-100 flex items-center gap-3"
                                    >
                                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Umid</span>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= 6. PRICING SECTION ================= */}
            <section id="pricing" className="py-32 px-6 md:px-12 lg:px-20 bg-[#FDFDFF] relative overflow-hidden">
                
                {/* Background Decor */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1536px] -z-10 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#17776A]/10 blur-[120px] rounded-full" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100 blur-[120px] rounded-full" />
                    <div className="absolute inset-0 opacity-[0.2] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" style={{ filter: 'contrast(130%) brightness(110%)' }} />
                </div>

                <div className="mx-auto max-w-[1536px] relative z-10">
                    {/* HEADER */}
                    <div className="text-center mb-24">
                        <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-slate-100 shadow-xl shadow-slate-200/50 text-[#17776A] text-[10px] font-black uppercase tracking-[0.3em] mb-8">
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
                        <PricingCard 
                            title="Standard" price="0" currency="UZS" description="Boshlang'ich darajani aniqlash uchun"
                            features={["Barcha Listening testlar", "Barcha Reading testlar", "Avtomatik natija hisoblash", "Cheksiz urinishlar"]}
                            buttonText="Bepul boshlash" type="standard"
                        />
                        <PricingCard 
                            title="Writing AI" price="14,900" currency="UZS" description="Insho va grammatika tahlili"
                            features={["AI orqali inshoni tekshirish", "Band Score (C1/B2) aniqlash", "Grammatik xatolar ro'yxati", "Lug'at boyligini yaxshilash"]}
                            buttonText="Essay yozish" type="premium-teal" badge="Ommabop" icon={<PenTool size={16} />}
                        />
                        <PricingCard 
                            title="Speaking AI" price="25,000" currency="UZS" description="Jonli suhbat simulyatsiyasi"
                            features={["AI Examiner bilan suhbat", "Talaffuz (Pronunciation) tahlili", "Ravonlik (Fluency) monitoringi", "To'liq feedback report (PDF)"]}
                            buttonText="Suhbatni boshlash" type="dark" icon={<Mic size={16} />}
                        />
                    </div>

                    {/* TRUST FOOTER */}
                    <div className="mt-20 flex flex-col items-center gap-8 text-center">
                        <div className="flex items-center gap-3 font-black text-slate-300 uppercase tracking-[0.2em] text-[10px]">
                            <div className="h-px w-12 bg-slate-200" />
                            <ShieldCheck size={16} /> Xavfsiz to'lov tizimlari
                            <div className="h-px w-12 bg-slate-200" />
                        </div>
                        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 cursor-pointer">
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
            <div className={`absolute inset-0 opacity-[0.1] pointer-events-none z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] ${isDark ? 'opacity-[1.2] mix-blend-overlay' : ''}`} />

            {badge && (
                <div className="absolute top-8 right-8 z-20">
                    <span className="bg-[#17776A] text-white text-[9px] font-black uppercase px-4 py-2 rounded-full tracking-widest shadow-lg shadow-[#17776A]/30">{badge}</span>
                </div>
            )}

            <div className="mb-12 relative z-10">
                <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] mb-5 
                    ${isDark ? 'text-emerald-400' : isTeal ? 'text-[#17776A]' : 'text-slate-400'}`}>{icon} {title}</div>
                <div className="flex items-baseline gap-1">
                    <h3 className={`text-5xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-[#0F172A]'}`}>{price}</h3>
                    <span className="text-xs font-bold text-slate-400 ml-2 uppercase tracking-widest">{currency}</span>
                </div>
                <p className="text-slate-400 text-sm mt-4 font-medium leading-relaxed">{description}</p>
            </div>

            <ul className="space-y-5 mb-12 relative z-10 flex-1">
                {features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start gap-4 text-[13px] font-bold tracking-tight text-slate-600">
                        <div className={`p-1 rounded-full shrink-0 mt-0.5 ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#17776A]/10 text-[#17776A]'}`}><CheckCircle2 size={14} /></div>
                        <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{feature}</span>
                    </li>
                ))}
            </ul>

            <div className="relative z-10">
                <button className={`group/btn w-full py-5 rounded-[22px] font-black text-[11px] uppercase tracking-[0.2em] transition-all overflow-hidden relative active:scale-95 shadow-lg
                    ${isDark ? 'bg-[#17776A] text-white hover:bg-[#136358]' : isTeal ? 'bg-[#0F172A] text-white hover:bg-slate-800' : 'bg-slate-50 text-slate-500 border border-slate-100 hover:bg-slate-100'}`}>
                    <span className="relative z-10 flex items-center justify-center gap-2">{buttonText} <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" /></span>
                    {(isDark || isTeal) && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_2s_infinite] transition-transform duration-1000" />}
                </button>
            </div>
        </motion.div>
    )
}