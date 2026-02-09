"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    Clock, FileText, ChevronLeft, Loader2, PlayCircle, 
    Globe, Users, ShoppingCart, ShieldCheck, Award, CheckCircle2, AlertCircle, Sparkles
} from "lucide-react"

import { getMockExamByIdAPI, startMockExamAPI, buyMockExamAPI } from "@/lib/api/mock"
import type { ApiMockExam } from "@/lib/types/mock"
import { toast } from "sonner"

function ExamViewLogic() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const examId = searchParams.get('id')

    const [exam, setExam] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("overview")

    useEffect(() => {
        if (!examId) return;

        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await getMockExamByIdAPI(examId);
                const rawData = response.data || response;
                
                // Mantiqiy xatolikni oldini olish: Narxi 0 bo'lsa yoki is_purchased bo'lsa "Sotib olingan" deb hisoblaymiz
                setExam({
                    ...rawData,
                    isPurchased: rawData.is_purchased || rawData.price === 0
                })
            } catch (err) {
                console.error("Exam load error:", err)
                toast.error("Ma'lumotlarni yuklashda xatolik yuz berdi")
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [examId])

    const handleAction = async () => {
        if (!exam) return;

        setActionLoading(true);
        try {
            if (exam.isPurchased) {
                // 1. IMTIHONNI BOSHLASH
                const startRes = await startMockExamAPI(exam.id);
                const attemptId = startRes.data.attempt_id;
                
                toast.success("Imtihon tayyorlanmoqda...")
                router.push(`/dashboard/exams/process/${attemptId}?examId=${exam.id}`);
            } else {
                // 2. SOTIB OLISH SO'ROVINI YUBORISH
                await buyMockExamAPI(exam.id);
                toast.success("Sotib olish so'rovi yuborildi!", {
                    description: "Admin tasdiqlashini kuting. Tasdiqlangach Telegram orqali xabar boradi.",
                });
            }
        } catch (err: any) {
            console.error("Action error:", err)
            toast.error(err.response?.data?.detail || "Amalni bajarishda xatolik yuz berdi")
        } finally {
            setActionLoading(false)
        }
    }

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#1E3A8A] w-10 h-10" /></div>
    if (!exam) return <div className="h-screen flex items-center justify-center font-bold">Imtihon topilmadi</div>

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6 animate-in fade-in duration-500 text-slate-900">
            {/* Orqaga tugmasi */}
            <button onClick={() => router.push('/dashboard/exams')} className="flex items-center gap-2 text-slate-500 hover:text-[#1E3A8A] transition-colors group">
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
                <span className="text-xs font-bold uppercase tracking-widest">Orqaga qaytish</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <div className="lg:col-span-2 space-y-6">
                    <div className="p-8 rounded-[32px] bg-gradient-to-br from-[#1E3A8A] to-[#1e4ca8] text-white shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10">
                                    {exam.cefr_level} Level
                                </span>
                                {exam.isPurchased ? (
                                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/30 flex items-center gap-1">
                                        <CheckCircle2 size={12} /> Sotib olingan
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-500/30 flex items-center gap-1">
                                        <ShoppingCart size={12} /> Sotuvda
                                    </span>
                                )}
                            </div>
                            
                            <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight tracking-tight italic uppercase">{exam.title}</h1>
                            <p className="opacity-80 text-sm max-w-xl font-medium leading-relaxed mb-6">{exam.description || "Ushbu imtihon barcha CEFR standartlari asosida tayyorlangan."}</p>

                            <div className="flex flex-wrap gap-6 border-t border-white/10 pt-6">
                                <div className="flex items-center gap-2">
                                    <Clock className="text-blue-300" size={20}/>
                                    <div>
                                        <p className="text-[10px] font-bold text-blue-200 uppercase leading-none mb-1">Vaqt</p>
                                        <p className="text-sm font-black">{exam.duration_minutes || 180} daqiqa</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FileText className="text-blue-300" size={20}/>
                                    <div>
                                        <p className="text-[10px] font-bold text-blue-200 uppercase leading-none mb-1">Format</p>
                                        <p className="text-sm font-black uppercase">4 ta bo'lim</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Award className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5 rotate-12" />
                    </div>

                    {/* Tablar */}
                    <div className="flex gap-1 bg-slate-100 p-1.5 rounded-2xl w-fit">
                        {['overview', 'skills', 'rules'].map(tab => (
                            <button 
                                key={tab} 
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                                    ${activeTab === tab ? 'bg-white text-[#1E3A8A] shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {tab === 'overview' ? 'Ma\'lumot' : tab === 'skills' ? 'Tarkibi' : 'Qoidalar'}
                            </button>
                        ))}
                    </div>

                    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm min-h-[200px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'overview' && (
                                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                                    <h3 className="text-xl font-black uppercase tracking-tight text-[#1E3A8A] flex items-center gap-2">
                                        Baholash tizimi <Sparkles className="text-blue-500" size={18} />
                                    </h3>
                                    <p className="text-slate-500 leading-relaxed font-medium">
                                        Imtihon natijalari rasmiy <b>Rasch metodi</b> asosida hisoblanadi[cite: 3]. Tinglab tushunish va o'qish bo'limlari uchun ballar 100 ballik shkalaga keltirilib [cite: 8], yakuniy natija 75 ballik standart DTM shkalasida e'lon qilinadi[cite: 24, 30].
                                    </p>
                                </motion.div>
                            )}
                            {activeTab === 'skills' && (
                                <motion.div key="skills" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        {name: "Listening", time: "35 daq", detail: "35 ta savol "},
                                        {name: "Reading", time: "60 daq", detail: "35 ta savol "},
                                        {name: "Writing", time: "45 daq", detail: "2 ta topshiriq [cite: 28]"},
                                        {name: "Speaking", time: "15 daq", detail: "3 ta qism [cite: 29]"}
                                    ].map((s, i) => (
                                        <div key={i} className="p-5 bg-slate-50 rounded-2xl flex items-center gap-4 border border-slate-100">
                                            <div className="w-2 h-2 rounded-full bg-[#1E3A8A]" />
                                            <div>
                                                <p className="font-black text-sm text-slate-700 uppercase tracking-tight">{s.name} ({s.time})</p>
                                                <p className="text-[10px] text-slate-400 font-bold">{s.detail}</p>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                            {activeTab === 'rules' && (
                                <motion.div key="rules" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
                                    <div className="flex gap-3 items-start p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 shadow-sm">
                                        <AlertCircle size={20} className="shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-black uppercase text-xs mb-1">Vaqt chegarasi</h4>
                                            <p className="text-[11px] font-bold leading-relaxed">Imtihonni boshlaganingizdan so'ng to'xtatib bo'lmaydi. Sahifani yangilash natijalaringizni yo'qotishiga olib kelishi mumkin.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="p-8 bg-white border border-slate-100 rounded-[40px] shadow-2xl shadow-slate-200/60 sticky top-10 border-t-4 border-t-blue-600">
                        <div className="text-center mb-8">
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">Imtihon narxi</p>
                            <h3 className="text-4xl font-black text-[#1E3A8A] tracking-tighter">
                                {exam.price === 0 ? <span className="text-emerald-500">BEPUL</span> : `${exam.price.toLocaleString()} UZS`}
                            </h3>
                        </div>

                        <button 
                            onClick={handleAction} 
                            disabled={actionLoading}
                            className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-3 disabled:opacity-70 shadow-xl active:scale-95
                                ${exam.isPurchased 
                                    ? 'bg-[#1E3A8A] text-white hover:bg-[#1e4ca8]' 
                                    : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-100'}`}
                        >
                            {actionLoading ? <Loader2 className="animate-spin" /> : (
                                <>
                                    {exam.isPurchased ? "Imtihonni boshlash" : "Sotib olish uchun so'rov yuborish"} 
                                    {exam.isPurchased ? <PlayCircle size={20} /> : <ShoppingCart size={20} />}
                                </>
                            )}
                        </button>

                        <div className="mt-8 space-y-4 pt-8 border-t border-slate-100">
                            {[
                                { icon: ShieldCheck, text: "Xavfsiz to'lov tizimi" },
                                { icon: Award, text: "75 ballik standart shkala [cite: 30]" },
                                { icon: Globe, text: "CEFR standartlari asosida [cite: 16]" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-tight">
                                    <item.icon size={16} className="text-blue-500" /> 
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default function ExamViewPage() {
    return (
        <Suspense fallback={
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-[#1E3A8A] w-10 h-10" />
            </div>
        }>
            <ExamViewLogic />
        </Suspense>
    )
}