"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Headphones, Clock, FileText, Lock, ChevronRight, Loader2, Zap, Inbox, Filter } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { UnlockModal } from "@/components/unlock-modal"
import { getListeningExamsAPI } from "@/lib/api/listening"
import type { ListeningExam } from "@/lib/types/listening"

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
                
                const formattedData: ListeningExam[] = dataArray.map((item: any) => ({
                    id: String(item.id),
                    title: item.title || "Nomsiz Test",
                    isDemo: item.is_demo ?? false,
                    isFree: item.is_free ?? false,
                    level: item.level || "B2",
                    duration: item.duration || 35,
                    totalQuestions: item.total_questions || 30,
                    parts: []
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

    // Filtrlash mantiqi
    const filteredTests = exams.filter((test) => {
        if (activeTab === 'free') return test.isFree;
        if (activeTab === 'premium') return !test.isFree;
        return true;
    })

    const handleTestAction = (testId: string, isFree: boolean) => {
        if (isFree) {
            router.push(`/dashboard/test/listening/${testId}`)
        } else {
            setSelectedTestId(testId)
            setShowUnlockModal(true)
        }
    }

    return (
        <div className="space-y-8">
            {/* 1. TOP INFO & STATS BLOCK */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="md:col-span-2 p-8 rounded-[32px] bg-gradient-to-br from-purple-600 to-indigo-700 text-white relative overflow-hidden shadow-2xl shadow-purple-200"
                >
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Zap size={18} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-black uppercase tracking-widest opacity-80">Listening Mastery</span>
                        </div>
                        <h2 className="text-3xl font-black mb-4 tracking-tight">Eshiting va tushunishni <br/>yangi bosqichga olib chiqing.</h2>
                        <p className="text-purple-100 text-sm font-medium max-w-md opacity-90 leading-relaxed">
                            Xalqaro standartlar asosida tayyorlangan testlar yordamida CEFR darajangizni aniqlang.
                        </p>
                    </div>
                    {/* Background Noise/Decoration */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                    <Headphones size={180} className="absolute -right-10 -bottom-10 text-white opacity-10 rotate-12" />
                </motion.div>

                <div className="p-8 rounded-[32px] bg-white border border-slate-100 flex flex-col justify-center shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                            <Filter size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase">Saralash</p>
                            <p className="text-lg font-black text-slate-900">Filtrlar</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        {['all', 'free', 'premium'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                    activeTab === tab 
                                    ? "bg-purple-600 text-white shadow-lg shadow-purple-100" 
                                    : "text-slate-400 hover:bg-slate-50"
                                }`}
                            >
                                {tab === 'all' ? 'Barchasi' : tab === 'free' ? 'Bepul' : 'Premium'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 2. TESTS LIST */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="font-black text-slate-900 text-lg tracking-tight">Mavjud modullar</h3>
                    <Badge variant="outline" className="bg-white rounded-lg border-slate-200 text-slate-400 font-bold">
                        Jami: {filteredTests.length}
                    </Badge>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-28 w-full bg-white rounded-[32px] border border-slate-100 animate-pulse" />
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
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => handleTestAction(test.id, test.isFree)}
                                        className="group flex items-center justify-between p-6 rounded-[32px] bg-white border border-slate-100 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-500/[0.04] transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center transition-all duration-500 ${isLocked ? 'bg-slate-50 text-slate-300' : 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white shadow-inner'}`}>
                                                {isLocked ? <Lock size={26} /> : <Headphones size={28} />}
                                            </div>
                                            <div>
                                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                                    <h3 className="font-black text-slate-900 text-lg tracking-tight group-hover:text-purple-600 transition-colors">
                                                        {test.title}
                                                    </h3>
                                                    {test.isDemo && (
                                                        <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-600 text-[10px] font-black uppercase border border-amber-100">Demo</span>
                                                    )}
                                                    {test.isFree ? (
                                                        <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-emerald-100 text-[10px] font-black">OPEN</Badge>
                                                    ) : (
                                                        <Badge className="bg-purple-50 text-purple-600 hover:bg-purple-50 border-purple-100 text-[10px] font-black tracking-widest">PREMIUM</Badge>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                                    <span className="flex items-center gap-2"><Clock size={14} className="text-slate-300" /> {test.duration} min</span>
                                                    <span className="flex items-center gap-2"><FileText size={14} className="text-slate-300" /> {test.totalQuestions} Savol</span>
                                                    <span className="text-slate-900 font-black">{test.level}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${isLocked ? 'text-slate-200' : 'bg-slate-50 text-slate-400 group-hover:bg-purple-600 group-hover:text-white group-hover:shadow-lg'}`}>
                                            <ChevronRight size={24} />
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
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