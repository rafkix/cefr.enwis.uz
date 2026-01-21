"use client"

import { useEffect, useState, useRef, useCallback, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import ExamHeader from "@/components/exam/exam-header"
import ListeningExamContent from "@/components/exam/listening/listening-exam-content"
import ListeningExamSidebar from "@/components/exam/listening/listening-exam-sidebar"
import { Loader2, AlertCircle } from "lucide-react"

// API
import { getListeningExamByIdAPI, submitListeningExamAPI } from "@/lib/api/listening"
import type { ListeningExam } from "@/lib/types/listening"

export default function ListeningExamPage() {
    const params = useParams()
    const testId = params?.testId as string
    const router = useRouter()

    // --- STATE ---
    const [test, setTest] = useState<ListeningExam | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [hasStarted, setHasStarted] = useState(false)
    const [currentQuestion, setCurrentQuestion] = useState<number>(1)
    const [activePartIndex, setActivePartIndex] = useState(0)

    // MUHIM: Javoblarni ID (String) bo'yicha saqlaymiz.
    // Chunki Backend UUID qaytarishi mumkin.
    const [answers, setAnswers] = useState<Record<string, string>>({})
    const [answered, setAnswered] = useState<Record<string, boolean>>({})
    const answersRef = useRef<Record<string, string>>({})

    const [status, setStatus] = useState<"reading" | "playing" | "ending" | "finished">("reading")
    const [countdown, setCountdown] = useState(10) // 10 soniya tayyorgarlik
    const [fontSize, setFontSize] = useState(18)
    const [volume, setVolume] = useState(80)
    const [audioProgress, setAudioProgress] = useState(0)
    const [audioCurrentTime, setAudioCurrentTime] = useState(0)
    const [isFinishModalOpen, setIsFinishModalOpen] = useState(false)

    // ----------------------------------------------------
    // 1. DATA FETCHING & MAPPING (ENG MUHIM QISM)
    // ----------------------------------------------------
    useEffect(() => {
        if (!testId) return;

        const fetchExam = async () => {
            try {
                setLoading(true);
                setError(null);

                // 1. API dan javob olish
                const response: any = await getListeningExamByIdAPI(testId);

                // 2. Axios tekshiruvi (ba'zan data ichida data keladi)
                let rawData = response;
                if (response && response.data) {
                    rawData = response.data;
                }

                if (!rawData) throw new Error("Ma'lumot topilmadi");

                // 3. MAPPING (Backend snake_case -> Frontend camelCase)
                // Bu yerda har bir maydonni ehtiyotkorlik bilan o'giramiz
                const formattedData: ListeningExam = {
                    id: String(rawData.id || rawData._id),
                    title: rawData.title || "Listening Test",
                    isDemo: rawData.is_demo ?? false,
                    isFree: rawData.is_free ?? false,
                    sections: rawData.sections || "Listening",
                    level: rawData.level || "Medium",
                    duration: rawData.duration || 30,
                    totalQuestions: rawData.total_questions || 0,

                    parts: Array.isArray(rawData.parts) ? rawData.parts.map((p: any) => ({
                        id: String(p.id),
                        partNumber: p.part_number, // backend: part_number
                        title: p.title,
                        instruction: p.instruction,
                        taskType: p.task_type,     // backend: task_type
                        audioLabel: p.audio_label, // backend: audio_label
                        context: p.context,
                        passage: p.passage,
                        mapImage: p.map_image,     // backend: map_image
                        options: p.options || [],
                        questions: Array.isArray(p.questions) ? p.questions.map((q: any) => ({
                            id: String(q.id),
                            questionNumber: q.question_number, // backend: question_number
                            type: q.type,
                            question: q.question,
                            correctAnswer: q.correct_answer,   // backend: correct_answer
                            options: q.options || []
                        })) : []
                    })) : []
                };

                setTest(formattedData);

                // 4. Sessiyani tiklash (Agar sahifa yangilansa)
                const savedSession = localStorage.getItem(`listening-session-${testId}`);
                if (savedSession) {
                    try {
                        const parsed = JSON.parse(savedSession);
                        setAnswers(parsed.answers || {});
                        setAnswered(parsed.answered || {});
                        answersRef.current = parsed.answers || {};
                        setActivePartIndex(parsed.activePartIndex || 0);

                        // Statusni tiklash
                        setStatus(parsed.status || "reading");
                        setCountdown(parsed.countdown ?? 10);
                        setAudioCurrentTime(parsed.audioCurrentTime || 0);
                        setHasStarted(true); // Test davom etyapti
                    } catch (e) { console.error("Session parse error", e); }
                }

            } catch (err: any) {
                console.error("Xatolik:", err);
                setError("Testni yuklab bo'lmadi. Internetni tekshiring.");
            } finally {
                setLoading(false);
            }
        }

        fetchExam();
    }, [testId]);

    // ----------------------------------------------------
    // 2. LOGIC: TIMER, START, FINISH
    // ----------------------------------------------------

    // Timer (Faqat reading statusida ishlaydi)
    useEffect(() => {
        if (!hasStarted || status !== "reading") return;

        if (countdown <= 0) {
            setStatus("playing"); // Vaqt tugadi, audio boshlanadi
            return;
        }

        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [hasStarted, status, countdown]);

    // Doimiy saqlash (Auto Save)
    useEffect(() => {
        if (!testId || loading || !hasStarted || status === "finished") return;
        localStorage.setItem(`listening-session-${testId}`, JSON.stringify({
            answers, answered, activePartIndex, status, audioCurrentTime, countdown
        }));
    }, [answers, answered, activePartIndex, status, audioCurrentTime, countdown, hasStarted, loading, testId]);

    // Testni Boshlash
    const startExam = () => {
        const elem = document.documentElement;
        if (elem.requestFullscreen) elem.requestFullscreen().catch(() => { });

        // Eskisini tozalash
        localStorage.removeItem(`listening-session-${testId}`);
        localStorage.removeItem(`listening-${testId}-answers`);

        // Boshlash
        setHasStarted(true);
        setStatus("reading");
        setCountdown(10);
        setAudioCurrentTime(0);
    };

    // Javob berish (String ID bilan)
    const handleAnswer = useCallback((questionId: string | number, value: string) => {
        const idStr = String(questionId); // ID har doim string bo'lsin
        setAnswers(prev => ({ ...prev, [idStr]: value }));
        setAnswered(prev => ({ ...prev, [idStr]: !!value.trim() }));
        answersRef.current[idStr] = value;
    }, []);

    // Yakunlash
    // handleFinish funksiyasini yangilaymiz
    const handleFinish = useCallback(async () => {
        try {
            setLoading(true); // Yuborish jarayonida loader ko'rsatamiz

            // 1. To'liq ekran rejimidan chiqish
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(() => { });
            }

            // 2. Payload tayyorlash (Backend kutayotgan formatda)
            // answersRef.current da { "savol_id": "javob" } saqlangan
            const payload = {
                exam_id: testId,
                user_answers: answersRef.current
            };

            // 3. API orqali natijani yuborish
            // submitListeningExamAPI biz avvalroq listening.ts da yozgan funksiya
            const response = await submitListeningExamAPI(payload);
            const result = response.data;

            // 4. Sessiyalarni tozalash (LocalStorage)
            localStorage.removeItem(`listening-session-${testId}`);
            // Review uchun kerak bo'lishi mumkin bo'lgan javoblarni vaqtinchalik saqlaymiz
            localStorage.setItem(`last-result-${testId}`, JSON.stringify(result));

            setStatus("finished");

            // 5. Natija sahifasiga yo'naltirish (Backend qaytargan RESULT ID bilan)
            // Muhim: result.id bu ExamResult jadvalidagi ID
            router.push(`/dashboard/result/listening/${result.id}`);

        } catch (err: any) {
            console.error("Natijani yuborishda xato:", err);
            alert("Natijani saqlashda muammo yuz berdi. Iltimos, qayta urinib ko'ring.");
            setLoading(false);
        }
    }, [testId, router]);

    // Javob berilmagan savollar
    const unansweredQuestions = useMemo(() => {
        if (!test || !test.parts) return [];
        return test.parts.flatMap(p => p.questions)
            .filter(q => !answered[String(q.id)]) // ID string bo'yicha tekshirish
            .map(q => q.questionNumber);
    }, [test, answered]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // ----------------------------------------------------
    // 3. RENDER
    // ----------------------------------------------------

    if (loading) return (
        <div className="h-screen flex items-center justify-center text-slate-500 font-bold bg-slate-50">
            <Loader2 className="w-8 h-8 animate-spin mr-2 text-blue-600" /> Yuklanmoqda...
        </div>
    )

    if (error || !test) return (
        <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-xl font-bold text-slate-800 mb-2">Xatolik yuz berdi</h2>
            <p className="text-slate-600 mb-6">{error || "Test topilmadi"}</p>
            <button onClick={() => router.push("/test/listening")} className="px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition">
                Orqaga qaytish
            </button>
        </div>
    )

    // Start Ekrani
    if (!hasStarted) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
                <div className="bg-white p-10 rounded-[40px] shadow-2xl text-center max-w-lg border-4 border-white animate-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-4 uppercase italic tracking-tight">{test.title}</h1>
                    <p className="text-slate-500 mb-8 font-medium italic">Test boshlanishi bilan brauzer To&apos;liq Ekran rejimiga o&apos;tadi va navigatsiya bloklanadi.</p>
                    <button
                        onClick={startExam}
                        className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg uppercase shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all"
                    >
                        Testni Boshlash
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col bg-white overflow-hidden relative select-none">
            <ExamHeader currentSection="listening" />
            <div className="flex flex-1 overflow-hidden flex-row">
                <main className="flex-1 overflow-hidden relative">
                    <ListeningExamContent
                        examData={test}
                        currentQuestion={currentQuestion}
                        answers={answers}
                        status={status}
                        activePartIndex={activePartIndex}
                        fontSize={fontSize}
                        volume={volume}
                        onAnswer={handleAnswer}
                        onSelectQuestion={setCurrentQuestion}
                        onTimeUpdate={(c: number, d: number) => {
                            setAudioCurrentTime(c);
                            if (d > 0) setAudioProgress((c / d) * 100);
                        }}
                        onTransitionToEnding={() => setStatus("ending")}
                        onNextPart={() => {
                            if (activePartIndex < test.parts.length - 1) {
                                setActivePartIndex(p => p + 1);
                                setStatus("reading");
                                setCountdown(10);
                                setAudioCurrentTime(0);
                            } else {
                                setIsFinishModalOpen(true);
                            }
                        }}
                        initialTime={audioCurrentTime}
                    />
                </main>
                <ListeningExamSidebar
                    currentQuestion={currentQuestion}
                    answered={answered}
                    timeLeft={status === "reading" ? `00:${String(countdown).padStart(2, '0')}` : formatTime(audioCurrentTime)}
                    progress={audioProgress}
                    status={status}
                    fontSize={fontSize}
                    volume={volume}
                    onVolumeChange={setVolume}
                    onSelectQuestion={setCurrentQuestion}
                    onFinish={() => setIsFinishModalOpen(true)}
                    onIncreaseFontSize={() => setFontSize(s => Math.min(s + 2, 30))}
                    onDecreaseFontSize={() => setFontSize(s => Math.max(s - 2, 12))}
                    activePartIndex={activePartIndex}
                />
            </div>

            {isFinishModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[32px] shadow-2xl max-w-md w-full p-8 text-center border-4 border-white">
                        <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase italic tracking-tight">Testni yakunlash</h2>
                        {unansweredQuestions.length > 0 ? (
                            <div className="mb-8 text-left p-6 bg-amber-50 rounded-[24px] border border-amber-100">
                                <p className="text-amber-700 font-bold mb-4 text-center text-sm uppercase italic">Sizda {unansweredQuestions.length} ta savol qoldi:</p>
                                <div className="flex flex-wrap justify-center gap-2 max-h-40 overflow-y-auto custom-scrollbar">
                                    {unansweredQuestions.map(qNum => (
                                        <span key={qNum} className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-xs font-black text-slate-400 border border-slate-200 shadow-sm">{qNum}</span>
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