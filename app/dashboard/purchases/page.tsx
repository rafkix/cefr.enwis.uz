"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
    ShoppingBag, Calendar, CheckCircle2, Clock, XCircle, 
    ArrowUpRight, Download, Search, Wallet, 
    ChevronLeft, CreditCard, TrendingUp, Filter, Receipt,
    MoreVertical, ArrowDownLeft, FileText, Zap, Sparkles
} from "lucide-react"

// --- TYPES ---
type PaymentStatus = "paid" | "pending" | "failed"

interface Purchase {
    id: string
    title: string
    date: string
    amount: number
    paymentMethod: string 
    status: PaymentStatus
    type: "exam" | "course" | "subscription"
}

// --- MOCK DATA ---
const PURCHASES_DATA: Purchase[] = [
    {
        id: "INV-8832",
        title: "IELTS Full Mock: Academic",
        date: "Bugun, 14:30",
        amount: 45000,
        paymentMethod: "Click Up",
        status: "paid",
        type: "exam"
    },
    {
        id: "INV-8831",
        title: "General English: B2 Level",
        date: "Kecha, 10:15",
        amount: 15000,
        paymentMethod: "Payme",
        status: "paid",
        type: "course"
    },
    {
        id: "INV-8830",
        title: "Speaking AI Practice (Pro)",
        date: "22 Jan, 09:00",
        amount: 30000,
        paymentMethod: "Visa •••• 4242",
        status: "failed",
        type: "subscription"
    },
    {
        id: "INV-8829",
        title: "Multi-level Simulation",
        date: "20 Jan, 18:45",
        amount: 40000,
        paymentMethod: "Uzcard •••• 8888",
        status: "pending",
        type: "exam"
    }
]

export default function PurchasesPage() {
    const router = useRouter()
    const [filter, setFilter] = useState<"all" | PaymentStatus>("all")

    // Statistika
    const totalSpent = PURCHASES_DATA
        .filter(p => p.status === "paid")
        .reduce((acc, curr) => acc + curr.amount, 0)
    
    const filteredData = PURCHASES_DATA.filter(item => 
        filter === "all" ? true : item.status === filter
    )

    // Helper Functions
    const getStatusInfo = (status: PaymentStatus) => {
        switch(status) {
            case "paid": return { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", label: "To'landi", icon: CheckCircle2 }
            case "pending": return { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", label: "Kutilmoqda", icon: Clock }
            case "failed": return { color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200", label: "Bekor", icon: XCircle }
        }
    }

    const getTypeIcon = (type: string) => {
        switch(type) {
            case "exam": return <FileText size={20} />
            case "subscription": return <Zap size={20} />
            default: return <ShoppingBag size={20} />
        }
    }

    // --- NAVIGATION HANDLERS ---
    const handleTopUp = () => {
        // Balansni to'ldirish uchun 'balance' type bilan o'tadi
        router.push("/dashboard/purchases/payment?type=balance")
    }

    const handlePayInvoice = (id: string) => {
        // Aniq bir invoice (chek) uchun to'lov sahifasiga o'tish
        router.push(`/dashboard/purchases/payment?id=${id}`)
    }

    const handleBack = () => {
        router.back()
    }

    return (
        <div className="min-h-screen pb-10 font-sans text-slate-800 pt-6">
            
            <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">

                    {/* --- LEFT COLUMN: HISTORY LIST (3/4 qism) --- */}
                    <div className="xl:col-span-3 space-y-6">
                        
                        {/* Header & Tabs */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <button onClick={handleBack} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm">
                                    <ChevronLeft size={20} />
                                </button>
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Xaridlar Tarixi</h2>
                                    <p className="text-sm text-slate-500 font-medium">Barcha to'lovlar va cheklar</p>
                                </div>
                            </div>
                            <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                                {["all", "paid", "pending"].map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f as any)}
                                        className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all
                                            ${filter === f 
                                                ? "bg-slate-900 text-white shadow-md" 
                                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
                                    >
                                        {f === "all" ? "Barchasi" : f === "paid" ? "Kirim" : "Kutilmoqda"}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Transactions List */}
                        <div className="space-y-3">
                            <AnimatePresence mode="popLayout">
                                {filteredData.map((item, index) => {
                                    const statusInfo = getStatusInfo(item.status)
                                    return (
                                        <motion.div
                                            layout
                                            key={item.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.98 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group bg-white rounded-[20px] p-5 border border-slate-100 hover:border-slate-300 shadow-sm hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
                                        >
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                                                
                                                {/* Left: Icon & Info */}
                                                <div className="flex items-center gap-5 flex-1 min-w-0 w-full">
                                                    
                                                    {/* Icon Box */}
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border transition-colors
                                                        ${item.status === 'paid' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                                                        {getTypeIcon(item.type)}
                                                    </div>

                                                    {/* Text Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                                                                #{item.id}
                                                            </span>
                                                            <span className="text-xs font-medium text-slate-400 flex items-center gap-1 whitespace-nowrap">
                                                                <Calendar size={12} /> {item.date}
                                                            </span>
                                                        </div>
                                                        
                                                        <h3 className="text-base font-bold text-slate-900 truncate pr-2">
                                                            {item.title}
                                                        </h3>
                                                        
                                                        {/* Mobile Status Line */}
                                                        <div className="md:hidden mt-1 flex items-center gap-2 text-xs">
                                                            <span className="text-slate-500 font-medium">{item.paymentMethod}</span>
                                                            <span className={`flex items-center gap-1 font-bold ${statusInfo.color}`}>
                                                                <statusInfo.icon size={10} /> {statusInfo.label}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Middle: Payment Method (Desktop) */}
                                                <div className="hidden md:flex flex-col items-center px-6 border-l border-slate-100 shrink-0">
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">To'lov turi</span>
                                                    <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                                                        <CreditCard size={16} className="text-blue-500" /> 
                                                        {item.paymentMethod}
                                                    </span>
                                                </div>

                                                {/* Right: Amount & Status & Action */}
                                                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-slate-100 pt-4 sm:pt-0 shrink-0">
                                                    
                                                    {/* Amount */}
                                                    <div className="text-right min-w-[80px]">
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Summa</p>
                                                        <p className="text-xl font-black text-slate-900">
                                                            {item.amount.toLocaleString()} <span className="text-xs text-slate-400 font-bold">sum</span>
                                                        </p>
                                                    </div>

                                                    {/* Status Badge (Desktop) */}
                                                    <div className={`hidden sm:flex flex-col items-center justify-center w-28 h-10 rounded-xl border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}>
                                                        <span className="text-xs font-bold flex items-center gap-1.5">
                                                            <statusInfo.icon size={14} /> {statusInfo.label}
                                                        </span>
                                                    </div>

                                                    {/* Action Button */}
                                                    {item.status === 'paid' ? (
                                                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all shrink-0">
                                                            <Download size={18} />
                                                        </button>
                                                    ) : item.status === 'pending' ? (
                                                        <button 
                                                            onClick={() => handlePayInvoice(item.id)}
                                                            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 text-white hover:bg-blue-600 transition-all shrink-0 shadow-md active:scale-95"
                                                            title="To'lov qilish"
                                                        >
                                                            <ArrowUpRight size={18} />
                                                        </button>
                                                    ) : (
                                                        <div className="w-10 h-10"></div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>

                            {filteredData.length === 0 && (
                                <div className="text-center py-20 bg-white rounded-[24px] border border-dashed border-slate-300">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                        <Filter size={24} />
                                    </div>
                                    <p className="text-slate-500 font-medium text-sm">Ma'lumot topilmadi</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: WALLET & STATS (1/4 qism - SIDEBAR) --- */}
                    <div className="xl:col-span-1 space-y-6">
                        <div className="sticky top-8 space-y-6">
                            
                            {/* WALLET CARD (Dark Gradient) */}
                            <div className="bg-slate-900 rounded-[24px] p-6 text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                                {/* Blue Gradients */}
                                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600 rounded-full blur-[80px] opacity-40 group-hover:opacity-50 transition-opacity"></div>
                                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600 rounded-full blur-[80px] opacity-30"></div>

                                <div className="relative z-10 flex justify-between items-start mb-8">
                                    <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                                        <Wallet className="text-white" size={20} />
                                    </div>
                                    <span className="text-white/60 font-bold text-[10px] uppercase tracking-widest bg-white/5 px-2 py-1 rounded-lg">Enwis Balance</span>
                                </div>

                                <div className="relative z-10 mb-6">
                                    <p className="text-slate-400 text-xs font-bold mb-1 uppercase tracking-wider">Jami Xarajatlar</p>
                                    <h2 className="text-4xl font-black text-white tracking-tight">
                                        {totalSpent.toLocaleString()} <span className="text-lg text-slate-500 font-bold">uzs</span>
                                    </h2>
                                </div>

                                <div className="relative z-10 flex gap-3">
                                    <button 
                                        onClick={handleTopUp}
                                        className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <ArrowDownLeft size={16} /> To'ldirish
                                    </button>
                                    <button className="w-12 flex items-center justify-center py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors backdrop-blur-md border border-white/10 active:scale-95">
                                        <MoreVertical size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* MINI STATS */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm flex flex-col items-center text-center">
                                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-3">
                                        <Receipt size={20} />
                                    </div>
                                    <p className="text-xl font-black text-slate-900">{PURCHASES_DATA.length}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Cheklar</p>
                                </div>
                                <div className="bg-white p-5 rounded-[24px] border border-slate-200 shadow-sm flex flex-col items-center text-center">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3">
                                        <TrendingUp size={20} />
                                    </div>
                                    <p className="text-xl font-black text-slate-900">100%</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Muvaffaqiyat</p>
                                </div>
                            </div>

                            {/* PROMO BANNER */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-[24px] border border-blue-100 relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h4 className="font-black text-slate-900 text-sm mb-2 flex items-center gap-2">
                                        <Zap size={16} className="text-yellow-500 fill-yellow-500"/> Premiumga o'ting!
                                    </h4>
                                    <p className="text-xs text-slate-600 mb-4 font-medium leading-relaxed">Barcha imtihonlarni cheksiz yechish imkoniyati.</p>
                                    <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md active:scale-95">
                                        Batafsil
                                    </button>
                                </div>
                                <Sparkles className="absolute -bottom-2 -right-2 text-blue-200/50 group-hover:text-blue-200 transition-colors" size={80} />
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}