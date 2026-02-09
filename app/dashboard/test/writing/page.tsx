"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    Pencil,
    ArrowLeft,
    Settings,
    Wrench,
    Timer,
    Sparkles,
    Construction
} from "lucide-react"

import { Button } from "@/components/ui/button"

export default function WritingPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans pb-10 md:pb-20 overflow-x-hidden">
            {/* ================= HEADER ================= */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
                <div className="container mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-6">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push("/test")}
                            className="text-slate-500 font-black uppercase tracking-widest text-[9px] md:text-[10px] hover:text-orange-600 px-2"
                        >
                            <ArrowLeft className="mr-1 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                            Back
                        </Button>

                        <div className="h-6 md:h-8 w-px bg-slate-100 hidden xs:block" />

                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-lg">
                                <Pencil size={16} className="md:w-5 md:h-5" />
                            </div>
                            <div className="hidden xxs:block">
                                <h1 className="text-sm md:text-lg font-black tracking-tighter uppercase leading-none">
                                    Writing <span className="text-orange-600 italic">Lab</span>
                                </h1>
                                <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">In Progress</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ================= CONTENT ================= */}
            <main className="container mx-auto px-4 md:px-6 py-12 md:py-24 max-w-5xl flex flex-col items-center justify-center text-center">
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative mb-8"
                >
                    {/* Animated Icons Background */}
                    <div className="absolute inset-0 flex items-center justify-center blur-2xl opacity-20">
                        <Settings className="w-32 h-32 text-orange-600 animate-spin-slow" />
                    </div>
                    
                    <div className="relative bg-white p-8 rounded-[40px] shadow-2xl shadow-orange-100 border border-orange-50">
                        <Construction size={64} className="text-orange-600 mb-2 mx-auto" />
                        <Wrench size={24} className="text-orange-400 absolute top-6 right-6 animate-bounce" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                >
                    <div className="flex items-center justify-center gap-2 text-orange-600 mb-2">
                        <Sparkles size={16} fill="currentColor" />
                        <span className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.3em]">Tez kunda ishga tushadi</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-tight">
                        Writing bo'limi <br /> 
                        <span className="text-orange-600 italic">ta'mirlash jarayonida</span>
                    </h2>

                    <p className="text-slate-500 text-sm md:text-base max-w-md mx-auto font-medium leading-relaxed">
                        Hozirda biz ushbu bo'lim uchun yangi Writing topshiriqlari va AI tekshirish tizimini tayyorlayapmiz. Noqulaylik uchun uzr so'raymiz!
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12 flex flex-col sm:flex-row items-center gap-4"
                >
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                        <Timer size={14} />
                        Kutilayotgan vaqt: Fevral oxiri
                    </div>
                    
                    <Button 
                        onClick={() => router.push("/test")}
                        className="h-12 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-[10px]"
                    >
                        Boshqa testlarni ko'rish
                    </Button>
                </motion.div>

                {/* Background Decoration */}
                <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-20" />
            </main>
        </div>
    )
}