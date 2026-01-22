"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Phone, Loader2, RefreshCw, ShieldCheck, ExternalLink, Sparkles, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// API FUNKSIYALARI
import { requestPhoneCodeAPI, verifyPhoneCodeAPI } from "@/lib/api/auth"

export default function LoginPage() {
    const router = useRouter()

    const [step, setStep] = useState<"PHONE" | "CODE">("PHONE")
    const [phone, setPhone] = useState("")
    const [loading, setLoading] = useState(false)
    const [telegramLink, setTelegramLink] = useState("")
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""))
    const [agreed, setAgreed] = useState(true); // Default true qilib qo'ydik UX uchun

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // OTP Avtomatik yuborish mantiqi
    useEffect(() => {
        if (otp.join("").length === 6 && step === "CODE") {
            handleVerify(otp.join(""));
        }
    }, [otp]);

    const handleChange = (element: HTMLInputElement, index: number) => {
        const value = element.value.replace(/\D/g, ""); // Faqat raqam
        if (!value) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        if (index < 5) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            if (!otp[index] && index > 0) {
                inputRefs.current[index - 1]?.focus();
            } else {
                const newOtp = [...otp];
                newOtp[index] = "";
                setOtp(newOtp);
            }
        }
    };

    const handleRequestCode = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!agreed) return alert("Ommaviy oferta shartlariga rozi bo'ling");
        
        setLoading(true);
        const cleanPhone = phone.replace(/\D/g, "");

        try {
            const response = await requestPhoneCodeAPI(cleanPhone);
            const url = response.data?.telegram_url;
            if (url) {
                setTelegramLink(url);
                setStep("CODE");
                // Mobil qurilmada window.open ba'zan bloklanadi, shuning uchun havola ham ko'rsatiladi
                window.open(url, "_blank");
            }
        } catch (error: any) {
            alert(error.response?.data?.detail || "Raqam noto'g'ri");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (finalCode: string) => {
        setLoading(true);
        const cleanPhone = phone.replace(/\D/g, "");

        try {
            const response = await verifyPhoneCodeAPI(cleanPhone, finalCode);
            const { access_token, user } = response.data;

            if (access_token) {
                // 2 kun saqlash uchun vaqtni belgilaymiz
                localStorage.setItem("token", access_token);
                localStorage.setItem("login_at", new Date().getTime().toString());
                
                if (user) {
                    localStorage.setItem("user_full_name", user.full_name);
                    localStorage.setItem("user_phone", user.phone);
                }
                router.push("/dashboard/test");
            }
        } catch (error: any) {
            setOtp(new Array(6).fill(""));
            inputRefs.current[0]?.focus();
            alert("Kod noto'g'ri kiritildi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-[#17776A] selection:text-white">
            
            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-[10%] -right-[10%] w-72 h-72 sm:w-[500px] sm:h-[500px] bg-[#17776A]/5 rounded-full blur-[80px] sm:blur-[120px]" />
                <div className="absolute -bottom-[10%] -left-[10%] w-72 h-72 sm:w-[500px] sm:h-[500px] bg-blue-500/5 rounded-full blur-[80px] sm:blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[400px] relative z-10"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-4 p-2">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-slate-900">ENWIS</span>
                </div>

                <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#17776A] to-teal-400" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="text-center">
                                <h1 className="text-2xl font-black text-slate-900 mb-2">
                                    {step === 'PHONE' ? "Xush kelibsiz!" : "Kodni kiriting"}
                                </h1>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    {step === 'PHONE'
                                        ? "Tizimga kirish uchun telefon raqamingizni kiriting"
                                        : "Telegram botimiz orqali yuborilgan 6 xonali kodni kiriting"}
                                </p>
                            </div>

                            {step === "PHONE" ? (
                                <form onSubmit={handleRequestCode} className="space-y-4">
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                            <Phone size={18} />
                                        </div>
                                        <input
                                            type="tel"
                                            inputMode="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            placeholder="+998 (__) ___-__-__"
                                            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-[#17776A] focus:bg-white focus:ring-4 focus:ring-[#17776A]/5 outline-none transition-all font-bold text-slate-900"
                                            required
                                        />
                                    </div>
                                    
                                    <div className="flex items-start space-x-2 px-1">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            checked={agreed}
                                            onChange={(e) => setAgreed(e.target.checked)}
                                            className="mt-1 w-4 h-4 text-[#17776A] rounded border-gray-300 focus:ring-[#17776A]"
                                        />
                                        <label htmlFor="terms" className="text-[11px] leading-tight text-slate-500">
                                            Men <Link href="/terms" className="text-blue-600 underline">Ommaviy oferta</Link> shartlariga roziman va ma'lumotlarim qayta ishlanishiga ruxsat beraman.
                                        </label>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || !agreed}
                                        className="w-full h-14 bg-[#17776A] text-white rounded-2xl font-bold shadow-lg shadow-[#17776A]/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : <>Kodni olish <ArrowRight size={18}/></>}
                                    </button>
                                </form>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                        <span className="font-bold text-sm text-slate-700">{phone}</span>
                                        <button onClick={() => setStep("PHONE")} className="text-[10px] font-black uppercase text-[#17776A] tracking-wider hover:underline flex items-center gap-1">
                                            <RefreshCw size={10} /> O'zgartirish
                                        </button>
                                    </div>

                                    <div className="flex justify-between gap-1.5 sm:gap-2">
                                        {otp.map((data, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                maxLength={1}
                                                ref={(el) => { inputRefs.current[index] = el }}
                                                value={data}
                                                onChange={(e) => handleChange(e.target, index)}
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                                className="w-full h-14 text-center text-xl font-black rounded-xl border-2 border-slate-100 bg-slate-50 focus:border-[#17776A] focus:bg-white focus:ring-4 focus:ring-[#17776A]/5 outline-none transition-all"
                                            />
                                        ))}
                                    </div>

                                    {telegramLink && (
                                        <a 
                                            href={telegramLink} 
                                            target="_blank" 
                                            className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-wider hover:bg-blue-100 transition-colors"
                                        >
                                            <MessageCircle size={18} /> Botga o'tish va kodni olish
                                        </a>
                                    )}

                                    <button
                                        onClick={() => handleVerify(otp.join(""))}
                                        disabled={loading || otp.join("").length !== 6}
                                        className="w-full h-14 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-30"
                                    >
                                        {loading ? <Loader2 className="animate-spin" /> : "Tasdiqlash"}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="mt-8 flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <ShieldCheck size={14} className="text-teal-600" /> Secure
                    </div>
                    <div className="w-1 h-1 bg-slate-300 rounded-full" />
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <Sparkles size={14} className="text-amber-500" /> Premium AI
                    </div>
                </div>
            </motion.div>
        </div>
    )
}