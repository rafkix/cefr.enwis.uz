"use client"

import { useState, useEffect, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    User, Lock, Loader2, Eye, EyeOff, Globe,
    UserPlus, Phone, MessageCircle, ArrowRight,
    Star, Zap, ExternalLink, ArrowUpRight
} from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/AuthContext"
import { GoogleSignInButton, TelegramSignInWidget } from "@/components/auth-buttons"

// Reklamalar ma'lumotlari: Har biriga alohida rang va URL biriktirildi
const ADS = [
    {
        id: 1,
        color: "#229ED9", // Blue
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
        color: "#17776A", // Green
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
        color: "#FF5733", // Red/Orange
        image: "https://images.unsplash.com/photo-1551288049-bbbda546697a?q=80&w=1000&auto=format&fit=crop",
        icon: <Star size={28} />,
        title: <>Natijalarni <br /> <span style={{ color: "#FF5733" }}>kuzatib boring.</span></>,
        description: "Intellektual tahlillar orqali o'z ko'rsatkichlaringizni muntazam ravishda tahlil qiling.",
        stats: "12K+",
        label: "Talabalar",
        tag: "ANALYTICS",
        url: "/dashboard/result"
    },
    {
        id: 4,
        color: "#F59E0B", // Orange/Gold
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop",
        icon: <ExternalLink size={28} />,
        title: <>Xalqaro hamkorlik <br /> <span style={{ color: "#F59E0B" }}>va imkoniyat.</span></>,
        description: "Dunyo bo'ylab talabalar bilan muloqot qiling va tajriba almashish imkoniga ega bo'ling.",
        stats: "40+",
        label: "Hamkorlar",
        tag: "GLOBAL",
        url: "/global"
    }
]

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { login } = useAuth()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({ login: "", password: "" })
    const [adIndex, setAdIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setAdIndex((prev) => (prev + 1) % ADS.length)
        }, 6000)
        return () => clearInterval(timer)
    }, [])

    const clientId = searchParams.get("client_id")
    const redirectUri = searchParams.get("redirect_uri")
    const state = searchParams.get("state")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const getSocialQuery = () => clientId ? `?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}` : ""

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            await login(formData)
            if (clientId) {
                const query = new URLSearchParams({
                    client_id: clientId,
                    redirect_uri: redirectUri || "",
                    state: state || ""
                }).toString()
                window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/oauth/authorize?${query}`
            } else {
                router.push("/dashboard")
            }
        } catch (error: any) {
            alert(error.response?.data?.detail || "Login yoki parol xato!")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 w-full h-full flex flex-col lg:flex-row bg-white overflow-hidden font-sans">

            {/* CHAP TOMON: LOGIN FORMA */}
            <div className="w-full lg:w-[45%] h-full flex flex-col justify-center px-8 lg:px-16 bg-white z-20 relative overflow-y-auto">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[400px] mx-auto py-10">

                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-[#17776A] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#17776A]/20">
                            <Globe size={22} />
                        </div>
                        <span className="text-[#17776A] text-xl font-black tracking-tighter uppercase">ENWIS HUB</span>
                    </div>

                    <header className="mb-8">
                        <h1 className="text-4xl font-black text-slate-800 leading-tight mb-2 tracking-tight">Kirish</h1>
                        <p className="text-slate-400 font-medium">Davom etish uchun ma'lumotlaringizni kiriting</p>
                    </header>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="group relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#17776A] transition-colors">
                                <User size={18} />
                            </div>
                            <input
                                name="login"
                                onChange={handleChange}
                                className="w-full h-15 py-4 pl-12 pr-4 rounded-[20px] bg-slate-50 border-2 border-transparent focus:border-[#17776A]/10 focus:bg-white outline-none transition-all font-bold text-slate-700 shadow-sm"
                                placeholder="Email yoki login"
                                required
                            />
                        </div>

                        <div className="group relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#17776A] transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                onChange={handleChange}
                                className="w-full h-15 py-4 pl-12 pr-12 rounded-[20px] bg-slate-50 border-2 border-transparent focus:border-[#17776A]/10 focus:bg-white outline-none transition-all font-bold text-slate-700 shadow-sm"
                                placeholder="Parol"
                                required
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors">
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <div className="flex justify-end mt-1">
                            <Link
                                href="/auth/forgot"
                                className="text-xs font-medium text-blue-600 hover:underline"
                            >
                                Parolni unutdingizmi?
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button disabled={loading} className="h-15 bg-[#17776A] text-white rounded-2xl font-bold shadow-xl shadow-[#17776A]/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center">
                                {loading ? <Loader2 className="animate-spin" size={22} /> : "Kirish"}
                            </button>
                            <Link href={`/auth/register${getSocialQuery()}`} className="h-15 bg-white border-2 border-slate-50 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-2">
                                <UserPlus size={18} className="text-[#17776A]" />
                                Ro'yxatdan o'tish
                            </Link>
                        </div>
                    </form>

                    {/* SOCIAL LOGIN SECTION */}
                    <div className="mt-10">
                        <div className="relative mb-8">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                            <span className="relative px-4 bg-white text-[10px] font-black text-slate-300 uppercase tracking-widest block w-max mx-auto">Tezkor kirish</span>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => router.push(`/auth/login/phone${getSocialQuery()}`)}
                                className="w-full h-15 rounded-2xl border-2 border-[#17776A]/10 bg-white flex items-center justify-center gap-3 hover:bg-slate-50 active:scale-[0.98] transition-all font-bold text-slate-700 shadow-sm"
                            >
                                <div className="w-8 h-8 bg-[#17776A]/10 rounded-lg flex items-center justify-center text-[#17776A]">
                                    <Phone size={18} />
                                </div>
                                <span>Telefon raqam orqali</span>
                            </button>

                            {/* Google va Telegram Gridi - Responsive holatda */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                                <GoogleSignInButton />
                                <TelegramSignInWidget />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* O'NG TOMON: PREMIUM DARK KARUSEL */}
            <div className="hidden lg:flex w-[55%] h-full bg-[#0a0a0a] relative items-center justify-center overflow-hidden">

                {/* 1. Kavisli O'tish */}
                <div className="absolute left-0 top-0 bottom-0 w-[120px] bg-white z-10" style={{ clipPath: 'ellipse(100% 100% at 0% 50%)' }} />

                {/* 2. Dinamik Rangli Glow (ADS rangiga qarab o'zgaradi) */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 8, repeat: Infinity }}
                    className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full blur-[120px] transition-colors duration-1000"
                    style={{ backgroundColor: ADS[adIndex].color }}
                />

                {/* 3. Markaziy Karta */}
                <div className="relative z-20 w-full max-w-[480px] px-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={adIndex}
                            initial={{ opacity: 0, scale: 0.95, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 1.05, x: -20 }}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                            className="bg-white/[0.03] border border-white/10 rounded-[3.5rem] overflow-hidden backdrop-blur-xl shadow-2xl relative"
                        >
                            {/* Rasm qismi */}
                            <div className="w-full h-48 overflow-hidden relative">
                                <img
                                    src={ADS[adIndex].image}
                                    alt="Promo"
                                    className="w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

                                <div className="absolute top-6 left-6 inline-flex px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-md">
                                    <span className="text-[9px] font-black text-white uppercase tracking-[0.2em]">
                                        {ADS[adIndex].tag}
                                    </span>
                                </div>
                            </div>

                            <div className="p-10 pt-4 flex flex-col">
                                <div
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 mb-6 transition-colors duration-500"
                                    style={{ backgroundColor: `${ADS[adIndex].color}20`, color: ADS[adIndex].color }}
                                >
                                    {ADS[adIndex].icon}
                                </div>

                                <h2 className="text-3xl font-black text-white leading-tight tracking-tight mb-4">
                                    {ADS[adIndex].title}
                                </h2>

                                <p className="text-slate-400 text-sm leading-relaxed mb-8 opacity-80">
                                    {ADS[adIndex].description}
                                </p>

                                <div className="flex items-center justify-between pt-8 border-t border-white/5">
                                    <div>
                                        <div className="text-2xl font-black text-white">{ADS[adIndex].stats}</div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                            {ADS[adIndex].label}
                                        </div>
                                    </div>

                                    <a
                                        href={ADS[adIndex].url}
                                        target="_blank"
                                        className="h-12 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg shadow-black/20"
                                        style={{ backgroundColor: ADS[adIndex].color, color: 'white' }}
                                    >
                                        Batafsil <ArrowUpRight size={14} />
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Dots Navigation */}
                    <div className="flex gap-2.5 mt-8 justify-center">
                        {ADS.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setAdIndex(i)}
                                className={`h-1 rounded-full transition-all duration-500 ${adIndex === i ? "w-12" : "w-3 bg-white/10"}`}
                                style={{ backgroundColor: adIndex === i ? ADS[adIndex].color : undefined }}
                            />
                        ))}
                    </div>
                </div>

                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 z-[-1] opacity-5">
                    <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
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