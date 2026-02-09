"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    Headphones, BookOpen, PenTool, Mic,
    AlertTriangle, CheckCircle2, Loader2, Clock, Layers
} from "lucide-react"
import { toast } from "sonner"

import ExamHeader from "@/components/exam/exam-header"
import { getMockExamByIdAPI, finishMockExamAPI, getMockAttemptStatusAPI } from "@/lib/api/mock"

const SKILLS_CONFIG = [
    { id: "LISTENING", title: "Listening", duration: "35 min", questions: "40", icon: Headphones, bg: "bg-purple-50", text: "text-purple-600", examKey: "listening_id", image: "/listening.png" },
    { id: "READING", title: "Reading", duration: "60 min", questions: "40", icon: BookOpen, bg: "bg-emerald-50", text: "text-emerald-600", examKey: "reading_id", image: "/reading.png" },
    { id: "WRITING", title: "Writing", duration: "60 min", questions: "2 qism", icon: PenTool, bg: "bg-orange-50", text: "text-orange-600", examKey: "writing_id", image: "/writing.png" },
    { id: "SPEAKING", title: "Speaking", duration: "15 min", questions: "3 qism", icon: Mic, bg: "bg-rose-50", text: "text-rose-600", examKey: "speaking_id", image: "/speaking.png" }
]

export default function MockProcessPage() {
    const router = useRouter()
    const params = useParams()
    const searchParams = useSearchParams()

    // URL parametrlari
    const attemptId = params?.attemptId as string
    const examId = searchParams?.get("examId")

    const [exam, setExam] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isFinishing, setIsFinishing] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [skillsStatus, setSkillsStatus] = useState<Record<string, any>>({})

    const refreshData = useCallback(async () => {
        if (!examId || !attemptId || examId === "undefined") return;

        // Keshni oldini olish uchun timestamp
        const t = Date.now();
        try {
            const [examRes, statusRes] = await Promise.all([
                getMockExamByIdAPI(examId),
                getMockAttemptStatusAPI(attemptId)
            ])

            if (examRes?.data) setExam(examRes.data);

            if (statusRes?.data && Array.isArray(statusRes.data)) {
                const statusMap: Record<string, any> = {};
                statusRes.data.forEach((item: any) => {
                    // Skill nomini katta harfga o'tkazish (Backendga moslashish)
                    const skillName = String(item.skill).toUpperCase().trim();
                    const isReallySubmitted = item.is_submitted === true || (item.submitted_at && item.submitted_at !== "0" && item.submitted_at !== 0);
                    
                    statusMap[skillName] = { is_submitted: isReallySubmitted };
                });
                setSkillsStatus(statusMap);
            }
        } catch (err: any) {
            console.error("Fetch Error:", err.response?.data || err.message);
        } finally {
            setLoading(false);
        }
    }, [examId, attemptId]);

    useEffect(() => { refreshData() }, [refreshData]);

    const handleStartSkill = (skill: typeof SKILLS_CONFIG[0]) => {
        if (!exam) return;
        
        // Agar allaqachon topshirilgan bo'lsa
        if (skillsStatus[skill.id]?.is_submitted) {
            toast.error("Ushbu bo'lim topshirilgan!");
            return;
        }

        const testDbId = exam[skill.examKey];
        if (!testDbId) return toast.error("Test ID topilmadi");

        // Skill pathni kichik harfda yuborish (Next.js routing uchun)
        const skillPath = skill.title.toLowerCase();
        router.push(`/dashboard/test/${skillPath}/start?id=${testDbId}&mode=mock&attemptId=${attemptId}&examId=${examId}`);
    };

    const handleFinalSubmit = async () => {
        if (!attemptId) return;
        setIsFinishing(true);
        try {
            // Backend 400 bermasligi uchun attemptId ni Number qilib yuboramiz
            await finishMockExamAPI(attemptId);
            toast.success("Imtihon muvaffaqiyatli yakunlandi");
            router.push(`/dashboard/result/mock/${attemptId}`);
        } catch (err: any) {
            setIsFinishing(false);
            setShowConfirmModal(false);
            const errorMsg = err.response?.data?.detail || "Yakunlashda xatolik yuz berdi";
            toast.error(errorMsg);
        }
    };

    const submittedCount = Object.values(skillsStatus).filter((s: any) => s.is_submitted).length;

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-white">
            <Loader2 className="animate-spin text-[#17776A] w-10 h-10 mb-4" />
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] bg-[#F8FAFC] overflow-y-auto font-sans">
            <ExamHeader currentSection="process" />
            
            <div className="max-w-6xl mx-auto px-6 pt-24 pb-16 min-h-screen flex-col justify-center">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                    {SKILLS_CONFIG.slice(0, 3).map((skill) => (
                        <SkillCard key={skill.id} skill={skill} isDone={skillsStatus[skill.id]?.is_submitted} onStart={() => handleStartSkill(skill)} />
                    ))}
                </div>
                
                <div className="flex justify-center mb-10">
                    <div className="w-full md:w-1/3">
                        <SkillCard skill={SKILLS_CONFIG[3]} isDone={skillsStatus[SKILLS_CONFIG[3].id]?.is_submitted} onStart={() => handleStartSkill(SKILLS_CONFIG[3])} />
                    </div>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <button
                        onClick={() => setShowConfirmModal(true)}
                        disabled={submittedCount === 0}
                        className={`px-14 py-4 rounded-full font-black text-[11px] uppercase tracking-[0.2em] transition-all
                            ${submittedCount > 0 ? 'bg-slate-900 text-white hover:bg-black' : 'bg-slate-100 text-slate-300 shadow-none'}`}
                    >
                        Natijani hisoblash
                    </button>
                    <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest italic">
                        Progress: {submittedCount} / 4 bo'lim
                    </p>
                </div>
            </div>

            <AnimatePresence>
                {showConfirmModal && (
                    <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 text-center">
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white p-10 rounded-[40px] max-w-sm w-full shadow-2xl">
                            <AlertTriangle className="mx-auto text-amber-500 mb-6" size={48} />
                            <h3 className="text-lg font-black mb-4 uppercase italic">Sessiyani yakunlash</h3>
                            <p className="text-slate-500 text-sm mb-8 leading-relaxed italic text-center">Topshirilgan bo'limlar bo'yicha yakuniy natijani hisoblashni tasdiqlaysizmi?</p>
                            <div className="flex flex-col gap-2">
                                <button onClick={handleFinalSubmit} className="w-full py-4 bg-[#17776A] text-white rounded-2xl font-bold uppercase text-[10px] tracking-widest">
                                    {isFinishing ? "HISOBLANMOQDA..." : "HA, TASDIQLAYMAN"}
                                </button>
                                <button onClick={() => setShowConfirmModal(false)} className="w-full py-4 bg-slate-50 text-slate-400 rounded-xl font-bold uppercase text-[10px]">BEKOR QILISH</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

function SkillCard({ skill, isDone, onStart }: { skill: any, isDone: boolean, onStart: () => void }) {
    return (
        <motion.div
            whileHover={!isDone ? { y: -4 } : {}}
            onClick={onStart}
            className={`relative p-5 rounded-[28px] border-2 transition-all duration-300 flex items-center justify-between h-32 overflow-hidden
                ${isDone 
                    ? 'border-emerald-100 bg-emerald-50/20 cursor-not-allowed opacity-80 grayscale' 
                    : 'bg-white border-white hover:border-[#17776A]/20 hover:shadow-xl cursor-pointer'}`}
        >
            <div className="flex flex-col justify-between h-full z-10 w-2/3">
                <div className="flex flex-col">
                    <div className={`w-fit p-1.5 rounded-lg mb-2 ${skill.bg} ${skill.text}`}>
                        <skill.icon size={16} />
                    </div>
                    <h3 className="text-[15px] font-black text-slate-800 uppercase italic tracking-tighter leading-tight">{skill.title}</h3>
                    <div className="flex gap-2 mt-1 opacity-60">
                        <span className="flex items-center gap-1 text-[8px] font-bold text-slate-400 uppercase"><Clock size={10} /> {skill.duration}</span>
                        <span className="flex items-center gap-1 text-[8px] font-bold text-slate-400 uppercase"><Layers size={10} /> {skill.questions}</span>
                    </div>
                </div>
                <p className={`text-[9px] font-black tracking-widest uppercase mt-2 ${isDone ? 'text-emerald-500' : 'text-[#17776A]'}`}>
                    {isDone ? "Bajarildi ✅" : "Boshlash →"}
                </p>
            </div>
            <div className="relative w-1/3 h-full flex items-center justify-end">
                <img src={skill.image} alt={skill.title} className={`w-14 h-14 object-contain transition-all duration-500 ${isDone ? 'opacity-10' : 'opacity-80'}`} />
                {isDone && <div className="absolute inset-0 flex items-center justify-center mr-2"><CheckCircle2 size={28} className="text-emerald-500 bg-white rounded-full p-0.5" /></div>}
            </div>
            {isDone && <div className="absolute inset-0 z-20 cursor-not-allowed" />}
        </motion.div>
    )
}