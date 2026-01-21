"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Phone, Loader2, RefreshCw, ShieldCheck, BrainCircuit, ExternalLink, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// --- API FUNKSIYALARI ---
import { requestPhoneCodeAPI, verifyPhoneCodeAPI } from "@/lib/api/auth"

export default function LoginPage() {
    const router = useRouter()

    // --- State ---
    const [step, setStep] = useState<"PHONE" | "CODE">("PHONE")
    const [phone, setPhone] = useState("")
    const [loading, setLoading] = useState(false)
    const [telegramLink, setTelegramLink] = useState("")
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""))

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // --- OTP Logikasi ---
    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;
        const newOtp = [...otp];
        newOtp[index] = element.value;
        setOtp(newOtp);
        if (element.value && index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            if (!otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
            else {
                const newOtp = [...otp];
                newOtp[index] = "";
                setOtp(newOtp);
            }
        }
    };

    // --- FORM SUBMIT (BACKEND BILAN INTEGRATSIYA) ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Raqamni backend kutadigan formatga keltirish (faqat raqamlar)
        const cleanPhone = phone.replace(/\D/g, "");

        try {
            if (step === "PHONE") {
                // 1. Kod so'rash
                const response = await requestPhoneCodeAPI(cleanPhone);
                const url = response.data?.telegram_url;

                if (url) {
                    setTelegramLink(url);
                    setStep("CODE");
                    window.open(url, "_blank");
                }
            } else {
                // 2. Kodni tasdiqlash
                const finalCode = otp.join("");
                if (finalCode.length !== 6) throw new Error("Kodni to'liq kiriting.");

                const response = await verifyPhoneCodeAPI(cleanPhone, finalCode);

                // Backend TokenResponse sxemasidan ma'lumotlarni olish
                const { access_token, user } = response.data;

                if (access_token) {
                    localStorage.setItem("token", access_token);
                    if (user) {
                        localStorage.setItem("user_full_name", user.full_name);
                        localStorage.setItem("user_phone", user.phone);
                        localStorage.setItem("user_role", user.role);
                        localStorage.setItem("user_id", String(user.id));
                    }
                    router.push("/dashboard/test");
                }
            }
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.detail || error.message || "Xatolik yuz berdi";
            alert("Xatolik: " + (typeof msg === 'string' ? msg : "Kod noto'g'ri yoki foydalanuvchi topilmadi"));
        } finally {
            setLoading(false)
        }
    }

    const handleBackToPhone = () => {
        setStep("PHONE");
        setOtp(new Array(6).fill(""));
        setTelegramLink("");
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-[#17776A] selection:text-white">

            {/* Orqa fondagi dekorativ elementlar */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#17776A]/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Markaziy Logo */}
                <div className="flex flex-col items-center mb-10">
                    <Link href="/" className="group flex flex-col items-center gap-4">
                        <div className="w-14 h-14 bg-[#17776A] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#17776A]/20 transition-all group-hover:scale-110 group-hover:rotate-3">
                            <BrainCircuit size={32} />
                        </div>
                        <span className="text-3xl font-black tracking-tighter text-slate-900">ENWIS</span>
                    </Link>
                </div>

                {/* Oq Card (Forma konteyneri) */}
                <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/60 border border-slate-100 p-8 sm:p-10 relative overflow-hidden">

                    {/* Yuqori dekorativ chiziq */}
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#17776A] via-teal-400 to-[#17776A]" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
                                    {step === 'PHONE' ? "Xush kelibsiz" : "Kodni tasdiqlash"}
                                </h1>
                                <p className="text-slate-500 font-medium text-sm">
                                    {step === 'PHONE'
                                        ? "Tizimga kirish uchun telefon raqamingizni kiriting"
                                        : "Telegram orqali yuborilgan 6 xonali kodni kiriting"}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {step === "PHONE" ? (
                                    <div className="space-y-4">
                                        <div className="relative group">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#17776A] transition-colors">
                                                <Phone size={20} />
                                            </div>
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="+998 90 123 45 67"
                                                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#17776A] focus:bg-white focus:ring-4 focus:ring-[#17776A]/5 outline-none transition-all font-bold text-slate-900"
                                                required
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                                            <span className="font-bold text-slate-700">{phone}</span>
                                            <button type="button" onClick={handleBackToPhone} className="text-xs font-bold text-[#17776A] flex items-center gap-1 hover:underline">
                                                <RefreshCw size={12} /> O'zgartirish
                                            </button>
                                        </div>

                                        <div className="flex justify-between gap-2">
                                            {otp.map((data, index) => (
                                                <input
                                                    key={index}
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={1}
                                                    ref={(el) => { inputRefs.current[index] = el }}
                                                    value={data}
                                                    onChange={(e) => handleChange(e.target, index)}
                                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                                    className="w-12 h-14 text-center text-xl font-black rounded-xl border-2 border-slate-100 bg-slate-50 focus:border-[#17776A] focus:bg-white focus:ring-4 focus:ring-[#17776A]/5 outline-none transition-all"
                                                />
                                            ))}
                                        </div>

                                        {telegramLink && (
                                            <a href={telegramLink} target="_blank" className="flex items-center justify-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700">
                                                <ExternalLink size={14} /> Botdan kodni olish
                                            </a>
                                        )}
                                    </div>
                                )}

                                <button
                                    disabled={loading}
                                    className="w-full h-14 bg-[#17776A] hover:bg-[#136358] text-white rounded-2xl font-bold shadow-lg shadow-[#17776A]/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" />
                                    ) : (
                                        <>
                                            {step === "PHONE" ? "Kodni olish" : "Tasdiqlash"}
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Pastki qism */}
                <div className="mt-8 text-center space-y-4">
                    <p className="text-sm font-medium text-slate-400">
                        Hisobingiz yo'qmi? <Link href="/auth/signup" className="text-[#17776A] font-bold hover:underline">Ro'yxatdan o'ting</Link>
                    </p>

                    <div className="flex items-center justify-center gap-6 pt-4 border-t border-slate-200/60">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <ShieldCheck size={14} className="text-teal-500" /> Secure Login
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <Sparkles size={14} className="text-teal-500" /> AI Powered
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}