"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    ArrowRight, Phone, Loader2, MessageCircle, ArrowLeft,
    Globe, Lock, ExternalLink
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { authService } from "@/lib/api/auth"
import { useAuth } from "@/lib/AuthContext"

const TELEGRAM_BOT_TOKEN = "8542032478:AAH8CiqFMrRLxTZ6k6bbRKHtl5P9X8Yc98s";
const TELEGRAM_CHANNEL_ID = "@enwis_uz";

function PhoneLoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { refreshUser } = useAuth()

    const clientId = searchParams.get("client_id")
    const redirectUri = searchParams.get("redirect_uri")
    const scope = searchParams.get("scope")
    const state = searchParams.get("state")

    const [step, setStep] = useState<"PHONE" | "CODE">("PHONE")
    const [phone, setPhone] = useState("+998")
    const [loading, setLoading] = useState(false)
    const [otp, setOtp] = useState<string[]>(new Array(4).fill(""))
    const [subscriberCount, setSubscriberCount] = useState<string>("5K+")

    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        const fetchTelegramSubs = async () => {
            try {
                const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getChatMemberCount?chat_id=${TELEGRAM_CHANNEL_ID}`);
                const data = await response.json();
                if (data.ok) {
                    const count = data.result;
                    setSubscriberCount(count >= 1000 ? `${(count / 1000).toFixed(1)}K+` : count.toString());
                }
            } catch (error) { console.error(error); }
        };
        fetchTelegramSubs();
    }, []);

    useEffect(() => {
        const fullOtp = otp.join("")
        if (fullOtp.length === 4 && step === "CODE") handleVerify(fullOtp)
    }, [otp, step])

    const handleRequestCode = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        if (phone.replace(/\s/g, "").length < 13) return
        setLoading(true)
        try {
            await authService.sendCode(phone.replace(/\s/g, ""), "login")
            setStep("CODE")
        } catch (error: any) { alert("Xatolik!") } finally { setLoading(false) }
    }

    const handleVerify = async (finalCode: string) => {
        setLoading(true)
        try {
            const res = await authService.loginPhone({ phone: phone.replace(/\s/g, ""), code: finalCode })
            if (res.status === "need_registration") {
                router.push(`/auth/register-complete?phone=${phone}&code=${finalCode}`)
                return
            }
            await refreshUser()
            router.push("/dashboard")
        } catch (error: any) {
            setOtp(new Array(4).fill(""))
            inputRefs.current[0]?.focus()
        } finally { setLoading(false) }
    }

    return (
        <div className="fixed inset-0 w-full h-full flex flex-col lg:flex-row bg-white overflow-hidden font-sans">

            {/* CHAP TOMON: FORM */}
            <div className="w-full lg:w-[45%] h-full flex flex-col justify-center px-8 lg:px-16 bg-white z-20 relative">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[380px] mx-auto">

                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-10 h-10 bg-[#17776A] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#17776A]/20">
                            <Globe size={22} />
                        </div>
                        <span className="text-[#17776A] text-xl font-black tracking-tighter uppercase">ENWIS HUB</span>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === "PHONE" ? (
                            <motion.div key="phone" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-6">
                                <header>
                                    <h1 className="text-4xl font-black text-slate-800 leading-tight mb-2 tracking-tight">Kirish</h1>
                                    <p className="text-slate-400 font-medium">Davom etish uchun raqamingizni kiriting</p>
                                </header>
                                <form onSubmit={handleRequestCode} className="space-y-4">
                                    <div className="group relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#17776A] transition-colors">
                                            <Phone size={18} />
                                        </div>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full h-15 py-4 pl-12 pr-4 rounded-[18px] bg-slate-50 border-2 border-transparent focus:border-[#17776A]/10 focus:bg-white outline-none transition-all font-bold text-slate-700 text-lg"
                                            placeholder="+998"
                                            required
                                        />
                                    </div>
                                    <button disabled={loading} className="w-full h-15 bg-[#17776A] text-white rounded-2xl font-bold shadow-xl shadow-[#17776A]/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2">
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : <>Kodni olish <ArrowRight size={18} /></>}
                                    </button>
                                    <div className="mt-10 pt-8 border-t border-slate-50 flex justify-center">
                                        <Link href={`/auth/login`} className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-[#17776A] uppercase tracking-widest transition-all">
                                            <ArrowLeft size={14} /> Login va parol orqali kirish
                                        </Link>
                                    </div>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div key="code" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                                <button onClick={() => setStep("PHONE")} className="flex items-center gap-2 text-slate-400 hover:text-[#17776A] group transition-colors">
                                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">Orqaga</span>
                                </button>
                                <header>
                                    <h1 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">Tasdiqlash</h1>
                                    <p className="text-slate-400 font-medium text-sm">Kod <span className="text-[#17776A] font-bold">{phone}</span> raqamiga yuborildi</p>
                                </header>
                                <div className="flex justify-between gap-3">
                                    {otp.map((data, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            maxLength={1}
                                            ref={(el) => { inputRefs.current[index] = el }}
                                            value={data}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, "");
                                                if (!val) return;
                                                const newOtp = [...otp];
                                                newOtp[index] = val;
                                                setOtp(newOtp);
                                                if (index < 3) inputRefs.current[index + 1]?.focus();
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Backspace" && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
                                                else if (e.key === "Backspace") { const newOtp = [...otp]; newOtp[index] = ""; setOtp(newOtp); }
                                            }}
                                            className="w-full h-16 text-center text-2xl font-black rounded-2xl border-2 border-slate-50 bg-slate-50 focus:border-[#17776A] focus:bg-white focus:ring-4 focus:ring-[#17776A]/5 outline-none transition-all shadow-sm"
                                        />
                                    ))}
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4 group cursor-pointer hover:bg-[#F0F9F8] transition-colors">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#229ED9] shadow-sm shrink-0 group-hover:scale-110 transition-transform">
                                        <MessageCircle size={24} fill="currentColor" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Telegram bot</p>
                                        <a href="https://t.me/EnwisAuthBot" target="_blank" className="text-xs text-[#229ED9] font-black uppercase flex items-center gap-1">
                                            Kodni olish <ExternalLink size={10} />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* O'NG TOMON: TUZATILGAN PREMIUM ELEMENTLAR */}
            <div className="hidden lg:flex w-[55%] h-full bg-[#0a0a0a] relative items-center justify-center overflow-hidden">

                {/* 1. Asosiy Kavisli Fon (Oq yarim oy) */}
                <div
                    className="absolute left-0 top-0 bottom-0 w-[120px] bg-white z-10"
                    style={{ clipPath: 'ellipse(100% 100% at 0% 50%)' }}
                />

                {/* 2. Dinamik Neon Effektlar (Faqat o'ng tomonda chegaralangan) */}
                <div className="absolute inset-0 z-0">
                    {/* Yuqori o'ng burchakdagi yashil nur */}
                    <div className="absolute -top-20 -right-20 w-[450px] h-[450px] bg-[#17776A] opacity-[0.15] rounded-full blur-[100px]" />

                    {/* O'rta qismdagi havo rang nur */}
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1] }}
                        transition={{ duration: 8, repeat: Infinity }}
                        className="absolute top-1/2 right-10 -translate-y-1/2 w-[350px] h-[350px] bg-[#229ED9] rounded-full blur-[120px]"
                    />

                    {/* Siz aytgan o'sha xato joylashgan doiralarni TUZATILGAN holati: */}
                    {/* O'ng tepa kichik doira */}
                    <div className="absolute top-[15%] right-[10%] w-48 h-48 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md" />

                    {/* Pastki o'rta kichik doira (Chapga o'tib ketmasligi uchun right-40 qilingan) */}
                    <div className="absolute bottom-[10%] right-[35%] w-24 h-24 rounded-full bg-[#17776A]/10 border border-white/5 backdrop-blur-sm" />
                </div>

                {/* 3. Markaziy Premium Karta */}
                <div className="relative z-20 w-full max-w-[440px] px-8">
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
                        <div className="bg-white/[0.02] border border-white/10 rounded-[3.5rem] p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden group">

                            {/* Card ichidagi dekoratsiya */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#229ED9]/10 rounded-full blur-2xl group-hover:bg-[#229ED9]/20 transition-colors" />

                            <div className="flex flex-col items-center text-center space-y-8 relative z-10">
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-20 h-20 bg-gradient-to-tr from-[#229ED9] to-[#4fc3f7] rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-[#229ED9]/30 border border-white/20"
                                >
                                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .33z" />
                                    </svg>
                                </motion.div>

                                <div className="space-y-3">
                                    <h3 className="text-3xl font-black text-white tracking-tight leading-tight">
                                        English with <br />
                                        <span className="text-[#229ED9]">Enwis Premium</span>
                                    </h3>
                                    <p className="text-slate-400 text-sm font-medium opacity-70">
                                        Darslar, testlar va yopiq hamjamiyat.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 w-full">
                                    <div className="bg-white/[0.04] border border-white/5 rounded-2xl py-5 hover:bg-white/10 transition-colors">
                                        <div className="text-2xl font-black text-white leading-none">{subscriberCount}</div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Students</div>
                                    </div>
                                    <div className="bg-white/[0.04] border border-white/5 rounded-2xl py-5 hover:bg-white/10 transition-colors">
                                        <div className="text-2xl font-black text-white leading-none">500+</div>
                                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-2">Darsliklar</div>
                                    </div>
                                </div>

                                <a href="https://t.me/enwis_uz" target="_blank" className="w-full h-14 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-[#229ED9] hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
                                    Telegram Kanal <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* 4. Subtle Dots Grid (O'ng tomonda orqa fonda) */}
                <div className="absolute inset-0 z-[-1] opacity-10 [mask-image:radial-gradient(ellipse_at_center,black,transparent)]">
                    <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                </div>
            </div>
        </div>
    )
}

export default function PhoneLoginPage() {
    return (
        <Suspense fallback={<div className="w-full h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#17776A]" size={40} /></div>}>
            <PhoneLoginForm />
        </Suspense>
    )
}