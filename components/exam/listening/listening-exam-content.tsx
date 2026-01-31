"use client"

import { useEffect, useRef, useState } from "react"
import { Folder } from "lucide-react"
import { ListeningExam } from "@/lib/types/listening"

interface ListeningExamContentProps {
    examData: ListeningExam | null
    currentQuestion: number
    answers: Record<string, string>
    onAnswer: (questionId: string | number, value: string) => void
    onSelectQuestion: (qIndex: number) => void
    activePartIndex: number
    status: "reading" | "playing" | "ending" | "finished"
    fontSize: number
    volume: number
    onNextPart: () => void
    onTransitionToEnding: () => void
    onTimeUpdate: (current: number, duration: number) => void
    initialTime: number
}

export default function ListeningExamContent({
    examData,
    currentQuestion,
    answers,
    onAnswer,
    onSelectQuestion,
    activePartIndex,
    status,
    fontSize,
    volume,
    onNextPart,
    onTransitionToEnding,
    onTimeUpdate,
    initialTime
}: ListeningExamContentProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)

    if (!examData || !examData.parts || examData.parts.length === 0) return null;

    const currentPart = examData.parts[activePartIndex];
    if (!currentPart) return <div>Part not found</div>;

    // --- 1. OVOZ BOSHQARUVI ---
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = (volume || 80) / 100;
        }
    }, [volume]);

    // --- 2. AUDIO IJRO MANTIQI ---
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio || !currentPart) return;

        let targetSrc = "";

        if (status === "playing") {
            targetSrc = currentPart.audioLabel || "";
        } else if (status === "ending") {
            const pNum = currentPart.partNumber || (activePartIndex + 1);
            targetSrc = `/audios/this_is_the_end_part_${pNum}.mp3`;
        }

        if (targetSrc) {
            const currentSrc = audio.getAttribute("src");
            if (currentSrc !== targetSrc) {
                audio.src = targetSrc;
                audio.load();
                if (status === "playing" && initialTime > 0) {
                    audio.currentTime = initialTime;
                }
            }
            
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => setIsPlaying(true))
                    .catch(e => {
                        console.error("Audio Play Error:", e);
                        if (status === "ending") onNextPart();
                        else if (status === "playing") onTransitionToEnding();
                    });
            }
        } else {
            audio.pause();
            setIsPlaying(false);
        }
    }, [status, currentPart, initialTime, activePartIndex, onNextPart, onTransitionToEnding]);

    // --- GAP FILL RENDER ---
    const renderGapFillPassage = (text: string, questions: any[]) => {
        if (!text) return null;
        const parts = text.split(/_{3,}|__________/g);

        return (
            // Mobilda padding kichikroq (p-5), Desktopda katta (md:p-10)
            <div className="leading-[2.8] text-justify text-slate-800 bg-white p-5 md:p-10 rounded-xl border border-slate-200 shadow-sm" style={{ fontSize: `${fontSize}px` }}>
                {parts.map((part, i) => {
                    const q = questions[i];
                    const qId = q ? String(q.id) : null;
                    const qNum = q ? Number(q.questionNumber) : null;

                    return (
                        <span key={i} className="inline">
                            <span dangerouslySetInnerHTML={{ __html: part }} />
                            {i < parts.length - 1 && qId && (
                                <input
                                    type="text"
                                    value={answers[qId] || ""}
                                    onChange={e => onAnswer(qId, e.target.value)}
                                    onFocus={() => qNum && onSelectQuestion(qNum)}
                                    // Mobilda input torroq (w-24), Desktopda kengroq (md:w-32)
                                    className={`w-24 md:w-32 h-9 mx-1 px-2 border-b-2 outline-none text-center font-bold text-blue-700 bg-blue-50 border-blue-400 rounded-t-lg transition-all ${currentQuestion === qNum ? "ring-2 ring-blue-500 bg-white" : ""}`}
                                    placeholder={`(${qNum})`}
                                />
                            )}
                        </span>
                    );
                })}
            </div>
        );
    }

    const isFullWidthPassage = currentPart.taskType === "GAP_FILL" || (currentPart.passage && currentPart.passage.length > 0);
    const isMapLayout = currentPart.taskType === "MAP_DIAGRAM" || !!currentPart.mapImage;

    return (
        <div className="flex flex-col h-full bg-[#F8FAFC] overflow-hidden">

            {/* PART TABS - Mobilda scroll bo'ladi */}
            <div className="h-14 bg-white border-b flex items-center justify-center shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto max-w-full no-scrollbar mx-2">
                    {examData.parts.map((p, idx) => (
                        <div
                            key={p.id}
                            className={`flex items-center gap-2 md:gap-3 px-3 md:px-5 py-2 rounded-xl text-[10px] md:text-[11px] font-black transition-all whitespace-nowrap cursor-default select-none
                                ${activePartIndex === idx ? "bg-white text-blue-600 shadow-md ring-1 ring-black/5" : "text-slate-400"}`}
                        >
                            <Folder size={14} className={`${activePartIndex === idx ? "text-blue-500 fill-blue-50" : "text-slate-300"}`} />
                            <span className="tracking-tighter uppercase">{p.partNumber}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* AUDIO PLAYER (Invisible logic) */}
            <audio
                ref={audioRef}
                preload="auto"
                onTimeUpdate={(e) => {
                    if (status === "playing") {
                        onTimeUpdate(e.currentTarget.currentTime, e.currentTarget.duration)
                    }
                }}
                onEnded={() => {
                    if (status === "playing") onTransitionToEnding();
                    else if (status === "ending") onNextPart();
                }}
            />

            {/* MAIN CONTENT AREA */}
            {/* Mobilda: flex-col (rasm tepada, savol pastda) */}
            {/* Desktop: md:flex-row (rasm va savol yonma-yon) */}
            <div className="flex-1 overflow-y-auto p-4 md:p-10 bg-[#F1F5F9]/50 flex flex-col md:flex-row gap-6 relative">

                {/* MAP / IMAGE SECTION */}
                {isMapLayout && currentPart.mapImage && (
                    <div className={`w-full md:w-1/2 h-min bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden 
                        ${/* Mobilda oddiy turadi, Desktopda yopishib turadi */ ""}
                        relative md:sticky md:top-0 transition-all duration-300
                    `}>
                        <div className="relative w-full h-auto p-2 bg-slate-50/50">
                             {/* Rasmni bosganda kattalashtirish funksiyasi (Zoom) qo'shish mumkin kelajakda */}
                             {/*  */}
                            <img src={currentPart.mapImage} alt="Map" className="w-full h-auto max-h-[40vh] md:max-h-[80vh] object-contain rounded-lg mx-auto" />
                        </div>
                    </div>
                )}

                {/* QUESTIONS SECTION */}
                {/* Agar rasm bo'lsa, Desktopda qolgan 50% joyni oladi */}
                <div className={`flex-1 max-w-4xl mx-auto ${isMapLayout ? 'md:w-1/2' : 'w-full'}`}>
                    
                    {/* Header: Title & Instruction */}
                    <div className="mb-4 md:mb-6">
                        <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-1 leading-tight">
                            {currentPart.partNumber}: {currentPart.title}
                        </h2>
                        <p className="text-slate-500 text-xs md:text-sm italic">{currentPart.instruction}</p>
                    </div>

                    {/* Questions Grid */}
                    {/* Mobilda: 1 ta ustun. Desktopda: 2 ta ustun (agar oddiy savol bo'lsa) */}
                    <div className={`grid gap-4 md:gap-6 ${isFullWidthPassage || isMapLayout ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"}`}>
                        {isFullWidthPassage ? (
                            renderGapFillPassage(currentPart.passage || "", currentPart.questions)
                        ) : (
                            currentPart.questions.map((q) => {
                                const qId = String(q.id);
                                const qNum = Number(q.questionNumber);
                                const isActive = currentQuestion === qNum;
                                const hasOptions = (q.type === 'MULTIPLE_CHOICE' || q.type === 'MATCHING') && q.options && q.options.length > 0;

                                return (
                                    <div
                                        key={qId}
                                        id={`q-${qNum}`}
                                        onClick={() => onSelectQuestion(qNum)}
                                        // Mobilda padding kamroq (p-4), Desktopda (p-6)
                                        className={`p-4 md:p-6 rounded-xl border-2 transition-all bg-white cursor-pointer shadow-sm 
                                            ${isActive ? "border-blue-500 ring-2 md:ring-4 ring-blue-500/10 shadow-xl" : "border-transparent hover:border-slate-200"}`}
                                    >
                                        <div className="flex gap-3 md:gap-5">
                                            {/* Savol raqami */}
                                            <span className={`shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center text-xs md:text-sm font-black transition-colors
                                                ${isActive ? "bg-blue-600 text-white shadow-lg" : "bg-slate-100 text-slate-400"}`}>
                                                {qNum}
                                            </span>

                                            <div className="flex-1" onClick={e => e.stopPropagation()}>
                                                {q.question && (
                                                    <p className="font-bold text-slate-800 mb-3 md:mb-4 leading-tight text-sm md:text-base" dangerouslySetInnerHTML={{ __html: q.question }} />
                                                )}

                                                {hasOptions ? (
                                                    <div className="space-y-2">
                                                        {q.options.map((opt) => (
                                                            <label key={opt.value} className={`flex items-center gap-3 p-2.5 md:p-3 rounded-lg border cursor-pointer transition-all select-none
                                                                ${answers[qId] === opt.value ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'border-slate-200 hover:bg-slate-50'}`}>
                                                                <input
                                                                    type="radio"
                                                                    name={`q-${qId}`}
                                                                    value={opt.value}
                                                                    checked={answers[qId] === opt.value}
                                                                    onChange={() => onAnswer(qId, opt.value)}
                                                                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 accent-blue-600"
                                                                />
                                                                <span className="text-sm font-medium text-slate-700">
                                                                    <span className="font-bold mr-2">{opt.value})</span>
                                                                    {opt.label}
                                                                </span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={answers[qId] || ""}
                                                        onChange={(e) => onAnswer(qId, e.target.value)}
                                                        placeholder="Answer..."
                                                        className="w-full bg-slate-50 border border-slate-200 p-2.5 md:p-3 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all font-medium text-slate-800 text-sm md:text-base"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}