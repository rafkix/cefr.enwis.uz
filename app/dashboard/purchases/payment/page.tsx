"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    Smartphone, ChevronLeft, ShieldCheck, CheckCircle2,
    Loader2, Receipt, ArrowRight, Wallet,
    ShoppingBag, UserCog, Copy, Send, Sparkles, ExternalLink
} from "lucide-react"

// --- CONFIG & DATA ---
const PRODUCT = {
    id: "73295702", // Order ID (Siz bergan namunadagi ID)
    title: "IELTS Full Mock: Academic Module",
    category: "EXAM",
    price: 45000, // Mahsulot narxi
    adminTelegram: "@enwis_support"
}

// To'lov tizimlari sozlamalari (Siz bergan linklardan olindi)
const PAYMENT_CONFIG = {
    click: {
        serviceId: "32372",
        merchantId: "18400",
        baseUrl: "https://my.click.uz/services/pay"
    },
    uzum: {
        serviceId: "498614683",
        baseUrl: "https://apelsin.uz/open-service"
    }
}

function PaymentPageLogic() {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    // Payme olib tashlandi. Faqat: click, uzum, admin
    const [selectedMethod, setSelectedMethod] = useState<"click" | "uzum" | "admin">("click")
    const [isProcessing, setIsProcessing] = useState(false)

    const handlePayment = () => {
        setIsProcessing(true)

        // 1. ADMIN (Telegram)
        if (selectedMethod === 'admin') {
            setTimeout(() => {
                setIsProcessing(false)
                window.open(`https://t.me/${PRODUCT.adminTelegram.replace('@', '')}`, '_blank')
            }, 1000)
            return
        }

        // 2. CLICK
        if (selectedMethod === 'click') {
            // Return URL - To'lovdan keyin qaytish manzili
            const returnUrl = encodeURIComponent(window.location.origin + "/dashboard/purchases")
            
            const url = `${PAYMENT_CONFIG.click.baseUrl}?service_id=${PAYMENT_CONFIG.click.serviceId}&merchant_id=${PAYMENT_CONFIG.click.merchantId}&amount=${PRODUCT.price}&transaction_param=${PRODUCT.id}&return_url=${returnUrl}`
            
            // Redirect
            window.location.href = url
            return
        }

        // 3. UZUM (Apelsin)
        if (selectedMethod === 'uzum') {
            // Uzum uchun so'm tiyinlarda bo'lishi mumkin yoki to'g'ridan to'g'ri (API hujjatiga qarab). 
            // Sizning namunangizda: amount=4893618
            
            const url = `${PAYMENT_CONFIG.uzum.baseUrl}?serviceId=${PAYMENT_CONFIG.uzum.serviceId}&orderId=${PRODUCT.id}&amount=${PRODUCT.price * 100}` // Odatda tiyinlarda so'raladi (*100)
            
            // Redirect
            window.location.href = url
            return
        }
    }

    return (
        <div className="min-h-screen pb-10 font-sans text-slate-800 pt-6">
            
            <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8">
                
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">To'lov Sahifasi</h1>
                        <p className="text-sm text-slate-500 font-medium">To'lov usulini tanlang va tasdiqlang</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                    {/* --- LEFT: PAYMENT METHODS (8 cols) --- */}
                    <div className="xl:col-span-8 space-y-6">
                        
                        {/* Grid endi 3 ta ustun bo'lishi mumkin, chunki Payme yo'q */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            
                            {/* 1. CLICK */}
                            <div
                                onClick={() => setSelectedMethod("click")}
                                className={`relative cursor-pointer p-6 rounded-[24px] border-2 transition-all duration-300 flex flex-col justify-between h-40 group
                                    ${selectedMethod === "click"
                                        ? "border-blue-600 bg-blue-50/50 shadow-xl shadow-blue-100"
                                        : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-lg"}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className={`p-3 rounded-2xl transition-colors ${selectedMethod === 'click' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                        <Smartphone size={24} />
                                    </div>
                                    {selectedMethod === "click" && <motion.div initial={{scale:0}} animate={{scale:1}} className="text-blue-600"><CheckCircle2 size={24} /></motion.div>}
                                </div>
                                <div>
                                    <span className="block font-black text-lg text-slate-900 tracking-tight">Click Up</span>
                                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Tezkor to'lov</span>
                                </div>
                            </div>

                            {/* 2. UZUM (Purple Theme) */}
                            <div
                                onClick={() => setSelectedMethod("uzum")}
                                className={`relative cursor-pointer p-6 rounded-[24px] border-2 transition-all duration-300 flex flex-col justify-between h-40 group
                                    ${selectedMethod === "uzum"
                                        ? "border-[#7000FF] bg-purple-50/50 shadow-xl shadow-purple-100"
                                        : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-lg"}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className={`p-3 rounded-2xl transition-colors ${selectedMethod === 'uzum' ? 'bg-[#7000FF] text-white' : 'bg-slate-100 text-slate-500'}`}>
                                        <ShoppingBag size={24} />
                                    </div>
                                    {selectedMethod === "uzum" && <motion.div initial={{scale:0}} animate={{scale:1}} className="text-[#7000FF]"><CheckCircle2 size={24} /></motion.div>}
                                </div>
                                <div>
                                    <span className="block font-black text-lg text-slate-900 tracking-tight">Uzum Bank</span>
                                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Nasiya / Pay</span>
                                </div>
                            </div>

                            {/* 3. ADMIN (Manual) */}
                            <div
                                onClick={() => setSelectedMethod("admin")}
                                className={`relative cursor-pointer p-6 rounded-[24px] border-2 transition-all duration-300 flex flex-col justify-between h-40 group
                                    ${selectedMethod === "admin"
                                        ? "border-slate-800 bg-slate-50 shadow-xl"
                                        : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-lg"}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className={`p-3 rounded-2xl transition-colors ${selectedMethod === 'admin' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                        <UserCog size={24} />
                                    </div>
                                    {selectedMethod === "admin" && <motion.div initial={{scale:0}} animate={{scale:1}} className="text-slate-800"><CheckCircle2 size={24} /></motion.div>}
                                </div>
                                <div>
                                    <span className="block font-black text-lg text-slate-900 tracking-tight">Admin Orqali</span>
                                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Qo'lda faollashtirish</span>
                                </div>
                            </div>

                        </div>

                        {/* --- ADMIN INSTRUCTIONS --- */}
                        <AnimatePresence>
                            {selectedMethod === "admin" && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="bg-blue-800 rounded-[32px] p-8 text-white border border-blue-500 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                                        <div className="absolute -right-20 -top-20 w-64 h-64 bg-slate-700 rounded-full blur-[80px] opacity-30"></div>

                                        <div className="relative z-10">
                                            <h3 className="text-lg font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <UserCog size={20} className="text-slate-400"/> Admin orqali to'lov
                                            </h3>
                                            <p className="text-slate-400 text-sm font-medium mb-6 leading-relaxed max-w-2xl">
                                                Quyidagi karta raqamiga to'lov qiling va chekni Adminga yuboring.
                                            </p>

                                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-200 uppercase tracking-widest mb-1">Karta Raqami (Humo/Uzcard)</p>
                                                    <p className="text-xl font-mono font-bold tracking-wider">6262 5700 0051 9183</p>
                                                    <p className="text-xs text-slate-200 mt-1">Diyorbek Abdumutalibov</p>
                                                </div>
                                                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95">
                                                    <Copy size={14} /> Nusxalash
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>

                    {/* --- RIGHT: ORDER SUMMARY (4 cols) --- */}
                    <div className="xl:col-span-4">
                        <div className="sticky top-8">

                            <div className="bg-white rounded-[32px] border border-slate-200 p-6 md:p-8 shadow-xl shadow-slate-200/50 relative overflow-hidden">
                                {/* Decor Line */}
                                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r 
                                    ${selectedMethod === 'click' ? 'from-blue-500 to-indigo-500' : 
                                      selectedMethod === 'uzum' ? 'from-purple-500 to-pink-500' :
                                      'from-slate-700 to-slate-900'}`}>
                                </div>

                                <h3 className="flex items-center gap-2 text-lg font-black text-slate-900 mb-8">
                                    <Receipt size={22} className="text-slate-400" /> To'lov Cheki
                                </h3>

                                {/* Product */}
                                <div className="flex gap-5 mb-8 pb-8 border-b border-slate-100 border-dashed">
                                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0 border border-slate-200">
                                        <ShoppingBag size={28} className="text-slate-400" />
                                    </div>
                                    <div>
                                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-wider mb-1.5">
                                            #{PRODUCT.id}
                                        </span>
                                        <h4 className="font-bold text-slate-900 text-sm leading-snug">{PRODUCT.title}</h4>
                                    </div>
                                </div>

                                {/* Price Breakdown */}
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-wide">
                                        <span>Mahsulot narxi</span>
                                        <span className="text-slate-900">{PRODUCT.price.toLocaleString()}</span>
                                    </div>
                                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                        <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Jami</span>
                                        <span className={`text-3xl font-black tracking-tighter 
                                            ${selectedMethod === 'click' ? 'text-blue-600' : 
                                              selectedMethod === 'uzum' ? 'text-[#7000FF]' :
                                              'text-slate-900'}`}>
                                            {PRODUCT.price.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <button
                                    onClick={handlePayment}
                                    disabled={isProcessing}
                                    className={`w-full py-4 rounded-2xl text-white font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3
                                        ${selectedMethod === 'click' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 
                                          selectedMethod === 'uzum' ? 'bg-[#7000FF] hover:bg-[#6000dd] shadow-purple-200' :
                                          'bg-slate-900 hover:bg-slate-800 shadow-slate-300'}`}
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} /> Yo'naltirilmoqda...
                                        </>
                                    ) : (
                                        selectedMethod === 'admin' ? (
                                            <>
                                                Adminga yozish <Send size={18} />
                                            </>
                                        ) : (
                                            <>
                                                To'lash <ExternalLink size={18} />
                                            </>
                                        )
                                    )}
                                </button>

                                <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest opacity-70">
                                    <ShieldCheck size={14} /> Xavfsiz to'lov tizimi
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center bg-[#F8FAFC]"><Loader2 className="animate-spin text-blue-600 w-10 h-10" /></div>}>
            <PaymentPageLogic />
        </Suspense>
    )
}