"use client"

import { useState, useEffect, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
    Globe, Loader2, Phone, MessageCircle, 
    ArrowRight, Star, Zap, ExternalLink, ArrowUpRight 
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { GoogleSignInButton, TelegramSignInWidget } from "@/components/auth/social-auth/auth-buttons"

// Reklamalar ma'lumotlari (O'zgarishsiz qoldi)
const ADS = [
    {
        id: 1,
        color: "#229ED9",
        image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000&auto=format&fit=crop",
        icon: <MessageCircle size={28} />,
        title: <>Telegramda bizga <br /> <span style={{ color: "#229ED9" }}>qo'shiling!</span></>,
        description: "Eng so'nggi yangiliklar, foydali materiallar va yopiq guruhlarga kirish imkoniyatini boy bermang.",
        stats: "25K+",
        label: "Obunachilar",
        tag: "COMMUNITY",
        url: "https://t.me/enwis_uz"
    },
    {
        id: 2,
        color: "#17776A",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1000&auto=format&fit=crop",
        icon: <Zap size={28} />,
        title: <>Premium darslar <br /> <span style={{ color: "#17776A" }}>endi ochiq!</span></>,
        description: "Barcha darajadagi darslar, interaktiv topshiriqlar va shaxsiy natijalar bitta tizimda.",
        stats: "500+",
        label: "Darsliklar",
        tag: "PREMIUM",
        url: "/courses"
    },
    {
        id: 3,
        color: "#FF5733",
        image: "https://images.unsplash.com/photo-1551288049-bbbda546697a?q=80&w=1000&auto=format&fit=crop",
        icon: <Star size={28} />,
        title: <>Natijalarni <br /> <span style={{ color: "#FF5733" }}>kuzatib boring.</span></>,
        description: "Intellektual tahlillar orqali o'z ko'rsatkichlaringizni muntazam ravishda tahlil qiling.",
        stats: "12K+",
        label: "Talabalar",
        tag: "ANALYTICS",
        url: "/dashboard/result"
    }
]

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [adIndex, setAdIndex] = useState(0)

    // Karusel taymeri
    useEffect(() => {
        const timer = setInterval(() => {
            setAdIndex((prev) => (prev + 1) % ADS.length)
        }, 6000)
        return () => clearInterval(timer)
    }, [])

    const clientId = searchParams.get("client_id")
    const redirectUri = searchParams.get("redirect_uri")
    const state = searchParams.get("state")

    // Query stringni saqlab qolish (OAuth uchun)
    const getAuthQuery = () => {
        if (!clientId) return ""
        return `?client_id=${clientId}&redirect_uri=${redirectUri || ""}&state=${state || ""}`
    }

    return (
        <div className="fixed inset-0 w-full h-full flex flex-col lg:flex-row bg-white overflow-hidden font-sans">

            {/* CHAP TOMON: FAQAT TEZKOR KIRISH */}
            <div className="w-full lg:w-[45%] h-full flex flex-col justify-center px-8 lg:px-16 bg-white z-20 relative overflow-y-auto">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="w-full max-w-[420px] mx-auto py-10"
                >

                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-12 h-12 bg-[#17776A] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#17776A]/20">
                            <Globe size={26} />
                        </div>
                        <span className="text-[#17776A] text-2xl font-black tracking-tighter uppercase">ENWIS HUB</span>
                    </div>

                    {/* Sarlavha */}
                    <header className="mb-12">
                        <h1 className="text-5xl font-black text-slate-800 leading-tight mb-4 tracking-tight">Xush kelibsiz</h1>
                        <p className="text-slate-400 text-lg font-medium">Davom etish uchun kirish usulini tanlang.</p>
                    </header>

                    {/* KIRISH TUGMALARI */}
                    <div className="space-y-4">
                        
                        {/* 1. Telefon raqam (Asosiy usul) */}
                        <button
                            onClick={() => router.push(`/auth/login/phone${getAuthQuery()}`)}
                            className="w-full h-20 rounded-[28px] bg-[#17776A] text-white flex items-center justify-between px-8 hover:brightness-110 active:scale-[0.98] transition-all shadow-2xl shadow-[#17776A]/30 group"
                        >
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                    <Phone size={24} />
                                </div>
                                <div className="text-left">
                                    <span className="block font-black text-xl">Telefon raqam</span>
                                    <span className="text-white/60 text-xs font-bold uppercase tracking-widest">SMS tasdiqlash</span>
                                </div>
                            </div>
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={24} />
                        </button>

                        {/* Ajratuvchi chiziq */}
                        <div className="relative py-8">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-100"></div>
                            </div>
                            <span className="relative px-6 bg-white text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] block w-max mx-auto">
                                Yoki ijtimoiy tarmoqlar
                            </span>
                        </div>

                        {/* 2. Google va Telegram (Grid) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="h-16">
                                <GoogleSignInButton />
                            </div>
                            <div className="h-16">
                                <TelegramSignInWidget />
                            </div>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <p className="mt-16 text-center text-slate-400 text-xs leading-relaxed max-w-[300px] mx-auto">
                        Tizimga kirish orqali siz bizning <br /> 
                        <span className="text-slate-900 font-bold underline cursor-pointer">Foydalanish shartlari</span>ga rozilik bildirasiz.
                    </p>
                </motion.div>
            </div>

            {/* O'NG TOMON: REKLAMA KARUSELI (O'zgarmadi, lekin UI biroz jilolandi) */}
            <div className="hidden lg:flex w-[55%] h-full bg-[#0a0a0a] relative items-center justify-center overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-[150px] bg-white z-10" style={{ clipPath: 'ellipse(100% 100% at 0% 50%)' }} />
                
                {/* Dinamik fon nuri */}
                <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.3, 0.15] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-1/2 right-0 w-[600px] h-[600px] rounded-full blur-[140px] transition-colors duration-1000"
                    style={{ backgroundColor: ADS[adIndex].color }}
                />

                <div className="relative z-20 w-full max-w-[500px] px-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={adIndex}
                            initial={{ opacity: 0, scale: 0.9, x: 30 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 1.1, x: -30 }}
                            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                            className="bg-white/[0.03] border border-white/10 rounded-[4rem] overflow-hidden backdrop-blur-2xl shadow-3xl"
                        >
                            <div className="w-full h-56 relative">
                                <img src={ADS[adIndex].image} className="w-full h-full object-cover opacity-40" alt="Promo" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                            </div>

                            <div className="p-12 pt-0 flex flex-col">
                                <div 
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10 mb-8 -mt-8 bg-[#0a0a0a] shadow-2xl transition-colors duration-500"
                                    style={{ color: ADS[adIndex].color }}
                                >
                                    {ADS[adIndex].icon}
                                </div>
                                <h2 className="text-4xl font-black text-white leading-tight mb-6">{ADS[adIndex].title}</h2>
                                <p className="text-slate-400 text-lg leading-relaxed mb-10 opacity-70">{ADS[adIndex].description}</p>
                                
                                <div className="flex items-center justify-between pt-10 border-t border-white/5">
                                    <div>
                                        <div className="text-3xl font-black text-white">{ADS[adIndex].stats}</div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{ADS[adIndex].label}</div>
                                    </div>
                                    <a href={ADS[adIndex].url} className="h-14 px-8 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-3 shadow-2xl shadow-black/40" style={{ backgroundColor: ADS[adIndex].color, color: 'white' }}>
                                        Batafsil <ArrowUpRight size={18} />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Dots Navigation */}
                    <div className="flex gap-3 mt-10 justify-center">
                        {ADS.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setAdIndex(i)}
                                className={`h-1.5 rounded-full transition-all duration-500 ${adIndex === i ? "w-14" : "w-4 bg-white/10"}`}
                                style={{ backgroundColor: adIndex === i ? ADS[adIndex].color : undefined }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-white"><Loader2 className="animate-spin text-[#17776A]" size={40} /></div>}>
            <LoginForm />
        </Suspense>
    )
}