"use client"

import { useState, Suspense } from "react"
import { motion } from "framer-motion"
import {
    User, Lock, Loader2, Eye, EyeOff, Globe, Target,
    AtSign, Phone, Mail, ArrowRight, UserPlus, Award, Book, GraduationCap,
    ShieldCheck,
    Sparkles,
    ArrowLeft
} from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/AuthContext"
import { authService } from "@/lib/api/auth"
import { SocialAuthButtons } from "@/components/auth-buttons"

function RegisterForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [loading, setLoading] = useState(false)
    const [agreed, setAgreed] = useState(true)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const [formData, setFormData] = useState({
        full_name: "",
        username: "",
        phone: "+998",
        email: "",
        password: "",
        confirm_password: ""
    })

    const clientId = searchParams.get("client_id")
    const redirectUri = searchParams.get("redirect_uri")
    const state = searchParams.get("state")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value
        if (!val.startsWith("+998")) val = "+998"
        val = val.replace(/[^0-9+]/g, "")
        if (val.length > 13) return
        setFormData(prev => ({ ...prev, phone: val }))
    }

    const getSocialQuery = () => clientId ? `?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}` : ""

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.password !== formData.confirm_password) {
            alert("Xato: Parollar bir-biriga mos kelmadi!")
            return
        }
        setLoading(true)
        try {
            const payload = {
                full_name: formData.full_name.trim(),
                username: formData.username.trim().toLowerCase(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone.trim(),
                password: formData.password
            }

            // Ro'yxatdan o'tish so'rovi
            await authService.register(payload)

            // Muvaffaqiyatli bo'lsa, xabar ko'rsatmasdan darhol login sahifasiga o'tkazish
            // getSocialQuery() orqali barcha auth parametrlarini (client_id va h.k.) saqlab qolamiz
            router.push(`/auth/login${getSocialQuery()}`)

        } catch (error: any) {
            // Faqat xatolik bo'lgandagina xabar chiqaramiz
            const errorDetail = error.response?.data?.detail
            alert(Array.isArray(errorDetail) ? errorDetail[0].msg : (errorDetail || "Xatolik yuz berdi"))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 w-full h-full flex flex-col lg:flex-row bg-white overflow-hidden font-sans m-0 p-0 border-none">
            {/* CHAP TOMON: REGISTER FORMA */}
            <div className="w-full lg:w-[45%] h-full flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-24 z-20 bg-white overflow-y-auto lg:overflow-hidden py-6 lg:py-0">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-[440px] mx-auto"
                >
                    {/* Logo */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-[#17776A] rounded-xl flex items-center justify-center text-white shadow-lg">
                            <Globe size={22} />
                        </div>
                        <span className="text-[#17776A] text-xl font-black tracking-tighter uppercase">ENWIS HUB</span>
                    </div>

                    <header className="mb-6">
                        <h1 className="text-3xl font-black text-slate-800 leading-tight">Yangi hisob</h1>
                        <p className="text-slate-400 font-medium text-sm">Ma'lumotlaringizni kiriting</p>
                    </header>

                    <form onSubmit={handleRegister} className="space-y-3">
                        <div className="group relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#17776A] transition-colors"><User size={18} /></div>
                            <input name="full_name" onChange={handleChange} value={formData.full_name} className="w-full h-12 pl-12 pr-4 rounded-[18px] bg-slate-50 border-b-2 border-transparent focus:border-[#17776A] focus:bg-white outline-none transition-all font-semibold text-slate-700 text-sm" placeholder="To'liq ismingiz" required />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="group relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#17776A] transition-colors"><AtSign size={16} /></div>
                                <input name="username" onChange={handleChange} value={formData.username} className="w-full h-12 pl-10 pr-4 rounded-[18px] bg-slate-50 border-b-2 border-transparent focus:border-[#17776A] focus:bg-white outline-none transition-all font-semibold text-slate-700 text-sm" placeholder="Username" required />
                            </div>
                            <div className="group relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#17776A] transition-colors"><Phone size={16} /></div>
                                <input name="phone" onChange={handlePhoneChange} value={formData.phone} className="w-full h-12 pl-10 pr-4 rounded-[18px] bg-slate-50 border-b-2 border-transparent focus:border-[#17776A] focus:bg-white outline-none transition-all font-semibold text-slate-700 text-sm" placeholder="Telefon" required />
                            </div>
                        </div>

                        <div className="group relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#17776A] transition-colors"><Mail size={18} /></div>
                            <input name="email" type="email" onChange={handleChange} value={formData.email} className="w-full h-12 pl-12 pr-4 rounded-[18px] bg-slate-50 border-b-2 border-transparent focus:border-[#17776A] focus:bg-white outline-none transition-all font-semibold text-slate-700 text-sm" placeholder="Email manzili" required />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="group relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#17776A] transition-colors"><Lock size={16} /></div>
                                <input name="password" type={showPassword ? "text" : "password"} onChange={handleChange} className="w-full h-12 pl-10 pr-10 rounded-[18px] bg-slate-50 border-b-2 border-transparent focus:border-[#17776A] focus:bg-white outline-none transition-all font-semibold text-slate-700 text-sm" placeholder="Parol" required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                            </div>
                            <div className="group relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#17776A] transition-colors"><Lock size={16} /></div>
                                <input name="confirm_password" type={showConfirmPassword ? "text" : "password"} onChange={handleChange} className="w-full h-12 pl-10 pr-10 rounded-[18px] bg-slate-50 border-b-2 border-transparent focus:border-[#17776A] focus:bg-white outline-none transition-all font-semibold text-slate-700 text-sm" placeholder="Tasdiqlash" required />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300">{showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 px-1">
                            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 w-4 h-4 accent-[#17776A]" />
                            <span className="text-[10px] text-slate-400 font-medium">
                                Men <Link href="/terms" className="text-[#17776A] font-bold underline">Shartlar</Link>ga roziman.
                            </span>
                        </div>

                        <button disabled={loading || !agreed} className="w-full h-14 bg-[#17776A] text-white rounded-2xl font-bold shadow-lg shadow-[#17776A]/20 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Ro'yxatdan o'tish <ArrowRight size={18} /></>}
                        </button>
                    </form>

                    {/* TEZKOR KIRISH (GOOGLE & TELEGRAM) */}
                    <div className="mt-6 w-full">
                        {/* Divider - "Yoki bu orqali" */}
                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-100"></div>
                            </div>
                            <span className="relative px-4 bg-white text-[10px] font-black text-slate-300 uppercase tracking-widest block w-max mx-auto">
                                Yoki bu orqali
                            </span>
                        </div>

                        {/* Ijtimoiy tarmoqlar va Kirish bloki */}
                        <div className="mt-6 flex flex-col gap-3">

                            {/* Google va Telegram Gridi */}
                            <div className="grid grid-cols-2 gap-3">
                                <SocialAuthButtons />
                            </div>

                            {/* Kirish tugmasi (Gridning tagida, to'liq kenglikda) */}
                            <Link
                                href={`/auth/login${getSocialQuery()}`}
                                className="group relative w-full h-12 bg-slate-50 rounded-xl border border-slate-100 transition-all duration-500 overflow-hidden flex items-center justify-center"
                            >
                                {/* 1. Asosiy savol (Doimiy holatda) */}
                                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] transition-all duration-500 group-hover:-translate-y-full group-hover:opacity-0">
                                    Allaqachon hisobingiz bormi?
                                </span>

                                {/* 2. Kirish matni (Hover holatda) */}
                                <span className="absolute inset-0 flex items-center justify-center gap-2 text-[10px] font-black text-[#17776A] uppercase tracking-[0.2em] transition-all duration-500 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                                    <ArrowLeft size={16} /> Kirish
                                </span>
                            </Link>
                        </div>


                    </div>
                </motion.div>
            </div>

            {/* O'NG TOMON: MODERN ACADEMIC REGISTER DESIGN */}
            <div className="hidden lg:flex w-[55%] h-full relative items-center justify-center bg-[#0F172A] overflow-hidden">

                {/* 1. Asosiy Kavisli Fon (O'tish qismi) */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-[150px] bg-white z-0"
                    style={{ clipPath: 'ellipse(100% 100% at 0% 50%)' }}
                />

                {/* 2. Dinamik yorug'lik effektlari (Mesh) */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-r from-[#17776A] to-[#5CB9AD] rounded-full blur-[150px] opacity-20"
                />

                <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] bg-[#3E9287] rounded-full blur-[100px] opacity-10" />

                <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative z-10 w-[480px] p-10 rounded-[48px] bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]"
                >
                    {/* Floating Award Icon */}
                    <motion.div
                        animate={{ y: [0, -15, 0], rotate: [12, 5, 12] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-10 -right-6 w-24 h-24 bg-gradient-to-br from-[#5CB9AD] to-[#17776A] rounded-[32px] flex items-center justify-center shadow-[0_20px_40px_rgba(23,119,106,0.4)]"
                    >
                        <Award className="text-white" size={40} />
                    </motion.div>

                    <div className="space-y-10">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                            <div className="w-2 h-2 bg-[#5CB9AD] rounded-full animate-ping" />
                            <span className="text-[10px] font-bold text-[#5CB9AD] uppercase tracking-[0.2em]">Ro'yxatdan O'tish Ochiq</span>
                        </div>

                        <div className="space-y-6">
                            <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
                                Sizning <span className="text-[#5CB9AD]">C1 darajangiz</span> <br />
                                shu yerdan boshlanadi.
                            </h2>
                            <p className="text-slate-400 text-xl leading-relaxed font-medium">
                                IELTS 7.5+, CEFR va Multilevel imtihonlari uchun akademik muhitga qo'shiling.
                            </p>
                        </div>

                        {/* Akademik Targetlar */}
                        <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                            <div className="space-y-2">
                                <div className="text-4xl font-black text-white tracking-tighter">7.5+</div>
                                <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">IELTS Goal</div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-4xl font-black text-white tracking-tighter">B2 / C1</div>
                                <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">Multilevel</div>
                            </div>
                        </div>

                        {/* Pastki Qism: Ishonch belgisi */}
                        <div className="flex items-center gap-4 p-5 rounded-[24px] bg-gradient-to-r from-white/5 to-transparent border border-white/5">
                            <div className="w-12 h-12 rounded-xl bg-[#5CB9AD]/20 flex items-center justify-center">
                                <ShieldCheck className="text-[#5CB9AD]" size={24} />
                            </div>
                            <div>
                                <div className="text-white font-bold text-sm text-left">Professional Ta'lim</div>
                                <div className="text-slate-500 text-xs text-left">Xalqaro standartlar asosida darslar</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 4. Background Grid Pattern */}
                <div className="absolute inset-0 z-[-1] opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid-dark" width="40" height="40" patternUnits="userSpaceOnUse">
                                <circle cx="2" cy="2" r="1" fill="white" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid-dark)" />
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default function RegisterPage() {
    return (
        <Suspense fallback={null}>
            <RegisterForm />
        </Suspense>
    )
}