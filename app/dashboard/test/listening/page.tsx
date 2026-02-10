"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    Headphones,
    Clock,
    FileText,
    Lock,
    ChevronRight,
    ChevronLeft,
    Loader2,
    Zap,
    Inbox,
    Filter,
    Activity,
    Award // Mock uchun yangi ikonka
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { UnlockModal } from "@/components/UnlockModal"
import { getListeningExamsAPI } from "@/lib/api/listening"

// 1. Interface Yangilandi
export interface ListeningExam {
    id: string
    title: string
    isDemo: boolean
    isFree: boolean
    isMock: boolean      // Yangi
    isActive: boolean    // Yangi
    level: string
    duration: number
    totalQuestions: number
    parts: any[]
}

export default function ListeningPage() {
    const router = useRouter()
    const [exams, setExams] = useState<ListeningExam[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'all' | 'free' | 'premium'>('all')
    const [showUnlockModal, setShowUnlockModal] = useState(false)
    const [selectedTestId, setSelectedTestId] = useState<string | null>(null)

    useEffect(() => {
        const fetchExams = async () => {
            try {
                setLoading(true)
                const response: any = await getListeningExamsAPI()
                const dataArray = Array.isArray(response) ? response : (response?.items || response?.data || [])

                // 2. Mapping Logic (API dan kelayotgan ma'lumotlarni to'g'irlash)
                const formattedData: ListeningExam[] = dataArray.map((item: any) => ({
                    id: String(item.id),
                    title: item.title || "Nomsiz Test",
                    isDemo: item.is_demo ?? false,
                    isFree: item.is_free ?? false,
                    isMock: item.is_mock ?? false,           // API: is_mock
                    isActive: item.is_active ?? true,        // API: is_active
                    level: item.cefr_level || "B2",          // API: cefr_level
                    duration: item.duration_minutes || 35,   // API: duration_minutes
                    totalQuestions: item.total_questions || 30,
                    parts: item.parts || []
                }))
                setExams(formattedData)
            } catch (err) {
                console.error("API Error:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchExams()
    }, [])

    const filteredTests = useMemo(() => {
        return exams.filter((test) => {
            // 1. Agar test Mock bo'lsa, uni har qanday holatda o'tkazib yuboramiz
            // (Chunki Mock testlar alohida sahifada yoki tabda bo'lishi kerak)
            if (test.isMock) return false;

            // 2. Tablar bo'yicha filtrlash
            if (activeTab === 'free') return test.isFree;
            if (activeTab === 'premium') return !test.isFree;

            // 'all' tanlanganda (va u isMock bo'lmasa) true qaytaradi
            return true;
        })
    }, [exams, activeTab])


    const handleTestAction = (testId: string, isFree: boolean, isActive: boolean) => {
        if (!testId) return;

        // Agar xohlasangiz, nofaol testlarni bosishni taqiqlashingiz mumkin
        // if (!isActive) return;

        if (isFree) {
            router.push(`/dashboard/test/listening/start?id=${testId}`)
        } else {
            setSelectedTestId(testId)
            setShowUnlockModal(true)
        }
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-10 px-2 sm:px-0">

            {/* --- BACK BUTTON --- */}
            <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => router.back()}
                className="group flex items-center gap-3 text-slate-400 hover:text-purple-600 transition-all"
            >
                <div className="w-9 h-9 rounded-2xl bg-white border border-slate-100 flex items-center justify-center group-hover:bg-purple-50 group-hover:border-purple-200 shadow-sm transition-all">
                    <ChevronLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Orqaga qaytish</span>
            </motion.button>

            {/* 1. TOP INFO & STATS BLOCK */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="md:col-span-2 p-8 rounded-[32px] bg-gradient-to-br from-purple-600 to-indigo-700 text-white relative overflow-hidden shadow-2xl shadow-purple-200"
                >
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-md">
                            <Zap size={16} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Listening Mastery</span>
                        </div>
                        <h2 className="text-3xl font-black mb-4 tracking-tight leading-tight">Eshiting va tushunishni <br />yangi bosqichga olib chiqing.</h2>
                        <p className="text-purple-100 text-sm font-medium max-w-md opacity-90 leading-relaxed italic">
                            Xalqaro standartlar asosida tayyorlangan audio materiallar orqali CEFR darajangizni oshiring.
                        </p>
                    </div>
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                    <Headphones size={180} className="absolute -right-10 -bottom-10 text-white opacity-10 rotate-12" />
                </motion.div>

                <div className="p-8 rounded-[32px] bg-white border border-slate-100 flex flex-col justify-center shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-inner">
                            <Filter size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Saralash</p>
                            <p className="text-lg font-black text-slate-900 tracking-tight">Filtrlash</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        {/* Faqat 3 ta tab qoladi: All, Free, Premium */}
                        {(['all', 'free', 'premium'] as const).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-left ${activeTab === tab
                                        ? "bg-purple-600 text-white shadow-lg shadow-purple-100"
                                        : "text-slate-400 hover:bg-slate-50 border border-transparent hover:border-slate-100"
                                    }`}
                            >
                                {tab === 'all' ? 'Barcha Testlar' : tab === 'free' ? 'Bepul Mashqlar' : 'Premium Mashqlar'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. TESTS LIST */}
            <div className="space-y-5">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                        <Activity size={18} className="text-purple-500 animate-pulse" />
                        <h3 className="font-black text-slate-800 text-xs tracking-[0.2em] uppercase">Mavjud Modullar</h3>
                    </div>
                    <Badge variant="secondary" className="bg-purple-50 text-purple-600 rounded-full px-4 py-1 border-none font-black text-[10px]">
                        {filteredTests.length} TA MODULE
                    </Badge>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-28 w-full bg-white rounded-[32px] border border-slate-50 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 pb-10">
                        <AnimatePresence mode="popLayout">
                            {filteredTests.map((test, index) => {
                                const isLocked = !test.isFree
                                return (
                                    <motion.div
                                        key={test.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.05 }}
                                        // isActive ni ham jo'natamiz
                                        onClick={() => handleTestAction(test.id, test.isFree, test.isActive)}
                                        className={`group flex flex-col sm:flex-row items-center justify-between p-6 rounded-[32px] bg-white border border-slate-100 hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-500/[0.06] transition-all cursor-pointer relative overflow-hidden
                                            ${!test.isActive ? 'opacity-75 grayscale-[0.5]' : ''}`} // Nofaol bo'lsa xira
                                    >
                                        <div className="flex items-center gap-6 z-10 w-full sm:w-auto">
                                            <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all duration-500 shadow-inner shrink-0 ${isLocked ? 'bg-slate-50 text-slate-300' : 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white'}`}>
                                                {/* Icon Logikasi: Qulflangan -> Lock, Mock -> Award, Standart -> Headphones */}
                                                {isLocked ? <Lock size={26} /> : test.isMock ? <Award size={28} /> : <Headphones size={28} />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                                    <h3 className="font-black text-slate-900 text-lg tracking-tight group-hover:text-purple-600 transition-colors uppercase">
                                                        {test.title}
                                                    </h3>

                                                    {/* BADGES: COMING SOON, DEMO, MOCK, FREE/PREMIUM */}
                                                    {!test.isActive && (
                                                        <span className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-black uppercase border border-slate-200">YAQINDA</span>
                                                    )}
                                                    {test.isDemo && (
                                                        <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-600 text-[10px] font-black uppercase border border-amber-100">Demo</span>
                                                    )}
                                                    {test.isMock && (
                                                        <span className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-600 text-[10px] font-black uppercase border border-rose-100">Mock Exam</span>
                                                    )}
                                                    {test.isFree ? (
                                                        <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[10px] font-black">OPEN</Badge>
                                                    ) : (
                                                        <Badge className="bg-purple-50 text-purple-600 border-purple-100 text-[10px] font-black tracking-widest">PREMIUM</Badge>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                                                        <Clock size={12} className="text-purple-500" />
                                                        <span>{test.duration} MIN</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md">
                                                        <FileText size={12} className="text-blue-500" />
                                                        <span>{test.totalQuestions} SAVOL</span>
                                                    </div>
                                                    <Badge className="h-4 bg-indigo-500 text-white border-none text-[8px] px-2">{test.level}</Badge>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`mt-4 sm:mt-0 shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${isLocked ? 'text-slate-200' : 'bg-slate-50 text-slate-400 group-hover:bg-purple-600 group-hover:text-white group-hover:shadow-lg'}`}>
                                            <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>
                )}

                {!loading && filteredTests.length === 0 && (
                    <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
                        <Inbox className="mx-auto text-slate-200 mb-6" size={40} />
                        <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Hozircha testlar mavjud emas</p>
                    </div>
                )}
            </div>

            {selectedTestId && (
                <UnlockModal
                    open={showUnlockModal}
                    onClose={() => setShowUnlockModal(false)}
                    testId={selectedTestId}
                    testType="listening"
                />
            )}
        </div>
    )
}