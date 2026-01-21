"use client"

import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import ExamHeader from "@/components/exam/exam-header"
import ReadingExamContent from "@/components/exam/reading/reading-exam-content"
import ReadingExamSidebar from "@/components/exam/reading/reading-exam-sidebar"
import { getReadingExamByIdAPI, submitReadingExamAPI } from "@/lib/api/reading"
import type { ReadingExam } from "@/lib/types/reading"

// --- SKELETON LOADING ---
const ExamSkeleton = () => (
    <div className="flex h-screen flex-col bg-white overflow-hidden">
        <div className="h-16 border-b bg-gray-50 animate-pulse" />
        <div className="flex flex-1 overflow-hidden flex-row">
            <div className="flex-1 p-8 space-y-4 overflow-y-auto">
                <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse mb-8" />
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                    ))}
                </div>
            </div>
            <div className="w-72 border-l bg-gray-50 p-4 space-y-4">
                <div className="h-20 bg-gray-200 rounded-xl animate-pulse" />
                <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="h-8 bg-gray-200 rounded animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    </div>
)

export default function ExamPage() {
    const params = useParams()
    const testId = params?.testId as string
    const router = useRouter()

    // --- STATE ---
    const [test, setTest] = useState<ReadingExam | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [timeLeft, setTimeLeft] = useState<number | null>(null)
    const [currentQuestion, setCurrentQuestion] = useState<number>(0)

    const [answers, setAnswers] = useState<Record<number, string>>({})
    const [answered, setAnswered] = useState<Record<number, boolean>>({})

    // 🛡️ hasStarted'ni darhol localStorage'dan tekshiramiz (Reload flicker'ni oldini oladi)
    const [hasStarted, setHasStarted] = useState<boolean>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem(`reading-${testId}-started`) === "true"
        }
        return false
    })

    const answersRef = useRef<Record<number, string>>({})
    const [fontSize, setFontSize] = useState(18)
    const [isFinishModalOpen, setIsFinishModalOpen] = useState(false)
    const isExamFinished = useRef(false)
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- 1. YAKUNLASH VA APIGA YUBORISH FUNKSIYASI ---
    const handleFinish = useCallback(async () => {
        // 1. Tekshiruv: Takroriy yuborishni oldini olish
        if (isExamFinished.current || isSubmitting) return;

        setIsSubmitting(true);
        isExamFinished.current = true;

        // 2. Javoblarni yig'ish (answers state va answersRef refni birlashtirish)
        const finalAnswers = { ...answers, ...answersRef.current };

        // 3. Backend formatiga keltirish (Savol ID: Javob matni)
        const submissionData = {
            exam_id: testId,
            user_answers: Object.entries(finalAnswers).reduce((acc, [key, value]) => {
                acc[String(key)] = String(value);
                return acc;
            }, {} as Record<string, string>)
        };

        try {
            // 4. API so'rovi
            const response = await submitReadingExamAPI(submissionData);

            /* MUHIM: Backend submit_exam funksiyasi quyidagicha qaytaradi:
               return { "summary": new_result, "review": review_items }
               Shuning uchun ID: response.data.summary.id ichida bo'ladi.
            */
            const resultId = response.data.summary.id;

            // 5. Muvaffaqiyatli bo'lsa LocalStorage ni tozalash
            localStorage.removeItem(`reading-${testId}-time`);
            localStorage.removeItem(`reading-${testId}-started`);
            localStorage.removeItem(`reading-${testId}-answers`);

            // 6. Natija sahifasiga yo'naltirish (Result ID bilan)
            // Dashboard yo'nalishingizga qarab:
            router.push(`/dashboard/result/reading/${resultId}`);

        } catch (error: any) {
            console.error("Topshirishda xatolik:", error);

            // Foydalanuvchiga tushunarli xabar
            const errorMsg = error.response?.data?.detail || "Natijani saqlab bo'lmadi.";
            alert(`Xatolik: ${errorMsg}`);

            // Xatolik bo'lsa foydalanuvchi qayta urinishi uchun holatni tiklaymiz
            isExamFinished.current = false;
            setIsSubmitting(false);
        }
    }, [answers, testId, router, isSubmitting]);

    // --- 2. DATA FETCHING & SESSION RESTORE ---
    useEffect(() => {
        if (!testId) return;

        const fetchExam = async () => {
            setLoading(true);
            try {
                const response = await getReadingExamByIdAPI(testId);
                const examData = response.data;
                if (!examData) throw new Error("Ma'lumot topilmadi");
                setTest(examData);

                const sessionStarted = localStorage.getItem(`reading-${testId}-started`) === "true";

                if (sessionStarted) {
                    setHasStarted(true);

                    // Javoblarni tiklash
                    const savedAnswers = localStorage.getItem(`reading-${testId}-answers`);
                    if (savedAnswers) {
                        const parsed = JSON.parse(savedAnswers);
                        setAnswers(parsed);
                        answersRef.current = parsed;
                        const newAnswered: Record<number, boolean> = {};
                        Object.keys(parsed).forEach(id => newAnswered[Number(id)] = !!parsed[id].trim());
                        setAnswered(newAnswered);
                    }

                    // Vaqtni tiklash
                    const savedTime = localStorage.getItem(`reading-${testId}-time`);
                    if (savedTime) {
                        setTimeLeft(parseInt(savedTime, 10));
                    } else {
                        setTimeLeft(examData.duration_minutes * 60);
                    }
                } else {
                    // Yangi urinish bo'lsa barchasini tozalash
                    setTimeLeft(examData.duration_minutes * 60);
                    setAnswers({});
                    setAnswered({});
                    answersRef.current = {};
                }

                if (examData.parts.length > 0 && examData.parts[0].questions.length > 0) {
                    setCurrentQuestion(Number(examData.parts[0].questions[0].id));
                }
            } catch (err: any) {
                setError(err.message || "Xatolik yuz berdi");
            } finally {
                setLoading(false);
            }
        };
        fetchExam();
    }, [testId]);

    // --- 3. TIMER LOGIC ---
    useEffect(() => {
        if (timeLeft === null || !test || !hasStarted || isExamFinished.current) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev === null || prev <= 1) {
                    clearInterval(interval);
                    handleFinish();
                    return 0;
                }
                const nextTime = prev - 1;
                localStorage.setItem(`reading-${testId}-time`, nextTime.toString());
                return nextTime;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [test, timeLeft, hasStarted, testId, handleFinish]);

    // --- 4. BROWSER CONTROLS ---
    useEffect(() => {
        const preventDefault = (e: BeforeUnloadEvent) => {
            if (hasStarted && !isExamFinished.current) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.history.pushState(null, "", window.location.href);
        const handlePopState = () => {
            if (hasStarted && !isExamFinished.current) window.history.pushState(null, "", window.location.href);
        };

        window.addEventListener("beforeunload", preventDefault);
        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("beforeunload", preventDefault);
            window.removeEventListener("popstate", handlePopState);
        };
    }, [hasStarted]);

    // --- 5. HELPERS ---
    const handleAnswer = (questionId: number, value: string) => {
        setAnswers((prev) => {
            const newAnswers = { ...prev, [questionId]: value };
            answersRef.current = newAnswers;
            localStorage.setItem(`reading-${testId}-answers`, JSON.stringify(newAnswers));
            return newAnswers;
        });
        setAnswered((prev) => ({ ...prev, [questionId]: !!value.trim() }));
    };

    const unansweredQuestions = useMemo(() => {
        if (!test) return [];
        const allQuestions: number[] = [];
        test.parts.forEach(part => {
            part.questions.forEach(q => allQuestions.push(Number(q.questionNumber || q.id)));
        });
        return allQuestions.filter(num => !answered[num]);
    }, [test, answered]);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    };

    // --- 6. TESTNI BOSHLASH ---
    const startExam = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) elem.requestFullscreen().catch(() => { });

        localStorage.removeItem(`reading-${testId}-answers`);
        localStorage.setItem(`reading-${testId}-started`, "true");
        setHasStarted(true);
    };

    if (loading) return <ExamSkeleton />;
    if (error) return <div className="h-screen flex items-center justify-center text-red-500 font-bold">{error}</div>;

    const totalQuestions = test?.parts.reduce((acc, part) => acc + part.questions.length, 0) || 0;

    // --- START SCREEN ---
    if (!hasStarted) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
                <div className="bg-white p-10 rounded-[40px] shadow-2xl text-center max-w-lg border-4 border-white">
                    <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black text-slate-800 mb-4 uppercase italic tracking-tight">IELTS Reading</h1>
                    <p className="text-slate-500 mb-8 font-medium leading-relaxed italic">
                        Test boshlanishi bilan brauzer To&apos;liq Ekran rejimiga o&apos;tadi va navigatsiya bloklanadi.
                    </p>
                    <button onClick={startExam} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg uppercase shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all">
                        Testni boshlash
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col bg-white overflow-hidden relative select-none">
            <ExamHeader currentSection="reading" />
            <div className="flex flex-1 overflow-hidden flex-row">
                <main className="flex-1 overflow-hidden relative">
                    <ReadingExamContent
                        examData={test!}
                        currentQuestion={currentQuestion}
                        answered={answered}
                        answers={answers}
                        onAnswer={handleAnswer}
                        onSelectQuestion={setCurrentQuestion}
                        fontSize={fontSize}
                    />
                </main>
                <ReadingExamSidebar
                    currentQuestion={currentQuestion}
                    totalQuestions={totalQuestions}
                    answered={answered}
                    timeLeft={formatTime(timeLeft || 0)}
                    onSelectQuestion={setCurrentQuestion}
                    onFinish={() => setIsFinishModalOpen(true)}
                    fontSize={fontSize}
                    onIncreaseFontSize={() => setFontSize(s => Math.min(s + 2, 30))}
                    onDecreaseFontSize={() => setFontSize(s => Math.max(s - 2, 12))}
                />
            </div>

            {/* 🏁 YAKUNLASH MODALI */}
            {isFinishModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[32px] shadow-2xl max-w-md w-full p-8 text-center border-4 border-white">
                        <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase italic tracking-tight">Testni yakunlash</h2>
                        {unansweredQuestions.length > 0 ? (
                            <div className="mb-8 text-left p-6 bg-amber-50 rounded-[24px] border border-amber-100">
                                <p className="text-amber-700 font-bold mb-4 text-center text-sm uppercase italic">Sizda {unansweredQuestions.length} ta savol qoldi:</p>
                                <div className="flex flex-wrap justify-center gap-2 max-h-40 overflow-y-auto custom-scrollbar">
                                    {unansweredQuestions.map(num => (
                                        <span key={num} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-xs font-black text-slate-400 border border-slate-200 shadow-sm">{num}</span>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p className="text-slate-500 font-bold mb-8 uppercase tracking-tight">Barcha savollar belgilandi. Yakunlashga tayyormisiz?</p>
                        )}
                        <div className="flex gap-4">
                            <button onClick={() => setIsFinishModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase hover:bg-slate-200 transition-all">Qaytish</button>
                            <button onClick={handleFinish} className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl shadow-blue-200 active:scale-95 transition-all">Yakunlash</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}