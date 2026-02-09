"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    ArrowRight, Phone, Loader2, MessageCircle, ArrowLeft,
    Globe, ExternalLink, ShieldCheck, CheckCircle2
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { authService } from "@/lib/api/auth"
import { useAuth } from "@/lib/AuthContext"

const TELEGRAM_BOT_TOKEN = "8542032478:AAH8CiqFMrRLxTZ6k6bbRKHtl5P9X8Yc98s";
const TELEGRAM_CHANNEL_ID = "@enwis_uz";
const BOT_USERNAME = "EnwisAuthBot";

function PhoneLoginForm() {
    const router = useRouter()
    const { refreshUser } = useAuth()

    const [step, setStep] = useState<"PHONE" | "CODE">("PHONE")
    const [phone, setPhone] = useState("+998")
    const [loading, setLoading] = useState(false)
    const [subscriberCount, setSubscriberCount] = useState<string>("5K+")
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""))
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
            } catch (error) { console.error("Telegram count error:", error); }
        };
        fetchTelegramSubs();
    }, []);

    const handleRequestCode = async (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        const cleanPhone = phone.replace(/[^\d+]/g, "") // Faqat raqam va + ni qoldiradi

        if (cleanPhone.length < 13) {
            alert("Iltimos, telefon raqamingizni to'liq kiriting!")
            return
        }

        setLoading(true)
        try {
            await authService.sendCode(cleanPhone, "login")
            window.open(`https://t.me/${BOT_USERNAME}?start=${cleanPhone}`, "_blank")
            setStep("CODE")
        } catch (error: any) {
            alert(error.response?.data?.message || "Xatolik yuz berdi.")
        } finally {
            setLoading(false)
        }
    }

    const handleVerify = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const finalCode = otp.join("");
        if (finalCode.length < 6) return;

        setLoading(true)
        try {
            const cleanPhone = phone.replace(/[^\d+]/g, "")
            const res = await authService.loginPhone({
                phone: cleanPhone,
                code: finalCode
            })

            if (res.status === "need_registration") {
                router.push(`/auth/register-complete?phone=${cleanPhone}&code=${finalCode}`)
                return
            }

            if (res.token) {
                localStorage.setItem('access_token', res.token.access_token);
                localStorage.setItem('refresh_token', res.token.refresh_token);
                await refreshUser()
                router.push("/dashboard")
            }
        } catch (error: any) {
            alert("Kod noto'g'ri yoki muddati o'tgan")
            setOtp(new Array(6).fill(""))
            inputRefs.current[0]?.focus()
        } finally {
            setLoading(false)
        }
    }

    // --- OTP FUNKSIYALARI ---
    const handleOtpChange = (index: number, value: string) => {
        const val = value.replace(/\D/g, "").slice(-1);
        const newOtp = [...otp];
        newOtp[index] = val;
        setOtp(newOtp);

        if (val && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // NUSXA KO'CHIRIB O'TKAZISH (PASTE) IMKONIYATI
    const handlePaste = (e: React.ClipboardEvent) => {
        const data = e.clipboardData.getData("text").trim();
        if (!/^\d{6}$/.test(data)) return; // Agar 6ta raqam bo'lmasa qaytadi

        const digits = data.split("");
        setOtp(digits);
        inputRefs.current[5]?.focus(); // Oxirgi katakka fokus
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
        if (e.key === "Enter" && otp.join("").length === 6) {
            handleVerify();
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full flex flex-col lg:flex-row bg-white overflow-hidden font-sans text-slate-900">

            <div className="w-full lg:w-[45%] h-full flex flex-col justify-center px-8 lg:px-16 bg-white z-20 relative">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[400px] mx-auto">

                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#17776A] to-[#249788] rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <Globe size={24} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[#17776A] text-xl font-black tracking-tighter leading-none">ENWIS HUB</span>
                            <span className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase mt-1">Global Education</span>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === "PHONE" ? (
                            <motion.div key="phone" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                                <header>
                                    <h1 className="text-4xl font-black leading-tight mb-3 tracking-tight">Kirish</h1>
                                    <p className="text-slate-400 font-medium">Telefon raqamingizni kiriting</p>
                                </header>

                                <form onSubmit={handleRequestCode} className="space-y-5">
                                    <div className="group relative">
                                        <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#17776A] transition-colors">
                                            <Phone size={20} />
                                        </div>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full h-16 py-4 pl-14 pr-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-[#17776A]/20 focus:bg-white outline-none transition-all font-bold text-xl"
                                            placeholder="+998"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full h-16 bg-[#17776A] text-white rounded-2xl font-bold shadow-xl shadow-[#17776A]/20 hover:bg-[#136359] active:scale-[0.98] disabled:opacity-70 transition-all flex items-center justify-center gap-3 text-lg"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={24} /> : <>Kodni olish <ArrowRight size={20} /></>}
                                    </button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div key="code" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                <button onClick={() => setStep("PHONE")} className="flex items-center gap-2 text-slate-400 hover:text-[#17776A] group transition-colors">
                                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                                    <span className="text-[11px] font-bold uppercase tracking-widest">Raqamni o'zgartirish</span>
                                </button>

                                <header>
                                    <h1 className="text-4xl font-black mb-3 tracking-tight">Tasdiqlash</h1>
                                    <p className="text-slate-400 font-medium text-sm">
                                        Kod <span className="text-[#17776A] font-bold">{phone}</span> raqamiga yuborildi
                                    </p>
                                </header>

                                <div className="flex justify-between gap-2" onPaste={handlePaste}>
                                    {otp.map((data, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            ref={(el) => { inputRefs.current[index] = el }}
                                            value={data}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            className={`w-full h-14 text-center text-2xl font-black rounded-xl border-2 outline-none transition-all shadow-sm
                                                ${otp[index] ? 'border-[#17776A] bg-white text-[#17776A]' : 'border-slate-100 bg-slate-50'}
                                                focus:border-[#17776A] focus:bg-white`}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={handleVerify}
                                    disabled={loading || otp.join("").length < 6}
                                    className="w-full h-16 bg-[#17776A] text-white rounded-2xl font-bold shadow-xl hover:bg-[#136359] disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none transition-all flex items-center justify-center gap-3 text-lg"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={24} /> : <>Tasdiqlash va Kirish <CheckCircle2 size={20} /></>}
                                </button>

                                <div
                                    className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center gap-4 group cursor-pointer hover:bg-[#F0F9F8] transition-all"
                                    onClick={() => !loading && handleRequestCode()}
                                >
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#229ED9] shadow-sm shrink-0">
                                        <MessageCircle size={26} fill="currentColor" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Telegram Bot</p>
                                        <span className="text-xs text-[#229ED9] font-black uppercase flex items-center gap-1 mt-0.5">
                                            Kodni qayta yuborish <ExternalLink size={12} />
                                        </span>
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
        <Suspense fallback={<div className="w-full h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-[#17776A]" size={48} /></div>}>
            <PhoneLoginForm />
        </Suspense>
    )
}