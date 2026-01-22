"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Eraser, Folder } from "lucide-react"
import QuestionRenderer, { GapFillFillRenderer } from "@/components/exam/reading/reading-question-renderer"
import HighlightText from "@/components/highlight-text"
import type { ReadingExam } from "@/lib/types/reading"

interface ReadingExamContentProps {
    examData: ReadingExam;
    currentQuestion: number; // Database ID
    answered: Record<number, boolean>;
    answers: Record<number, string>;
    onAnswer: (questionId: number, value: string) => void;
    onSelectQuestion: (dbId: number) => void;
    fontSize?: number;
    revMap: Record<number, number>; // 🟢 QO'SHILDI: Mapping lug'ati
}

export default function ReadingExamContent({
    examData,
    currentQuestion,
    answers,
    onAnswer,
    onSelectQuestion,
    fontSize = 18,
    revMap = {}, // 🟢 QO'SHILDI
}: ReadingExamContentProps) {
    const [activePartIndex, setActivePartIndex] = useState(0)
    const [highlightsByPart, setHighlightsByPart] = useState<Record<number, any[]>>({})
    const [activeColor, setActiveColor] = useState("#fef08a")
    const [sidebarWidth, setSidebarWidth] = useState(45)
    const [isResizing, setIsResizing] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // 1. Savol o'zgarganda tegishli Partni avtomatik ochish
    useEffect(() => {
        if (!examData?.parts) return;
        const pIdx = examData.parts.findIndex(p =>
            p.questions.some(q => Number(q.id) === Number(currentQuestion))
        )
        if (pIdx !== -1 && pIdx !== activePartIndex) {
            setActivePartIndex(pIdx)
        }
    }, [currentQuestion, examData.parts, activePartIndex])

    const currentPart = examData.parts[activePartIndex];
    const currentHighlights = highlightsByPart[activePartIndex] || [];

    // 2. Highlight mantiqi
    const handleHighlight = useCallback(() => {
        const s = window.getSelection();
        if (!s || s.isCollapsed) return;

        const r = s.getRangeAt(0);
        const c = r.commonAncestorContainer.parentElement?.closest('.passage-segment');
        if (!c) return;

        const hl = {
            id: `hl-${Date.now()}`,
            text: s.toString(),
            color: activeColor,
            startIndex: r.startOffset
        };

        if (activeColor !== "transparent") {
            setHighlightsByPart(p => ({
                ...p,
                [activePartIndex]: [...(p[activePartIndex] || []), hl]
            }));
        }
        s.removeAllRanges();
    }, [activeColor, activePartIndex]);

    // 3. Matn ichidagi bo'shliqlarni render qilish
    const renderPassage = () => {
        if (!currentPart?.passage) return null;

        const text = currentPart.passage;
        const gapFillQs = currentPart.questions.filter(q => q.type === "GAP_FILL");
        const segments = text.split(/_{3,}|__________/g);

        return (
            <div className="leading-[2.5] text-justify whitespace-pre-wrap text-slate-800 select-text"
                style={{ fontSize: `${fontSize}px` }}>
                {segments.map((segment, i) => {
                    const q = gapFillQs[i];
                    const qId = q ? Number(q.id) : null;
                    // 🟢 Virtual raqamni aniqlaymiz
                    const displayNum = qId ? revMap[qId] : "";

                    return (
                        <span key={i} className="inline">
                            <span className="passage-segment inline" onMouseUp={handleHighlight}>
                                <HighlightText
                                    text={segment}
                                    highlights={currentHighlights}
                                    onRemoveHighlight={id => setHighlightsByPart(p => ({
                                        ...p, [activePartIndex]: p[activePartIndex].filter(h => h.id !== id)
                                    }))} offset={0} />
                            </span>

                            {i < segments.length - 1 && qId && (
                                <input
                                    type="text"
                                    value={answers[qId] || ""}
                                    onChange={e => onAnswer(qId, e.target.value)}
                                    onFocus={() => onSelectQuestion(qId)}
                                    placeholder={`(${displayNum})`} // 🟢 Virtual raqam
                                    className={`w-32 h-8 mx-1 px-2 border-b-2 outline-none text-center font-bold transition-all rounded-t-md
                                        ${Number(currentQuestion) === qId
                                            ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100"
                                            : "border-blue-300 bg-blue-50/30 hover:border-blue-400"}`}
                                />
                            )}
                        </span>
                    )
                })}
            </div>
        )
    }

    // Sidebar Resizer
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing || !containerRef.current) return;
            const containerWidth = containerRef.current.offsetWidth;
            const rect = containerRef.current.getBoundingClientRect();
            const newWidth = ((containerWidth - (e.clientX - rect.left)) / containerWidth) * 100;
            if (newWidth > 20 && newWidth < 80) setSidebarWidth(newWidth);
        };
        const handleMouseUp = () => setIsResizing(false);
        if (isResizing) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizing]);

    return (
        <div ref={containerRef} className="flex flex-col h-full bg-white overflow-hidden relative border border-gray-200 shadow-sm rounded-lg">
            <div className="h-14 bg-white border-b flex items-center justify-center shrink-0 z-10">
                <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
                    {examData.parts.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                setActivePartIndex(idx);
                                const firstQ = examData.parts[idx].questions[0];
                                if (firstQ) onSelectQuestion(Number(firstQ.id));
                            }}
                            className={`flex items-center gap-3 px-5 py-2 rounded-xl text-[11px] font-black transition-all 
                                ${activePartIndex === idx
                                    ? "bg-white text-blue-600 shadow-md ring-1 ring-black/5"
                                    : "text-slate-400 hover:text-slate-600"}`}
                        >
                            <Folder size={14} className={activePartIndex === idx ? "text-blue-500 fill-blue-50" : "text-slate-300"} />
                            <span className="tracking-tighter uppercase font-black">{idx + 1}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                <div style={{ width: `${100 - sidebarWidth}%` }} className="h-full overflow-y-auto p-8 bg-white no-copy">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center justify-between mb-8 border-b pb-4">
                            <h2 className="font-black text-blue-900 uppercase italic tracking-tighter" style={{ fontSize: `${fontSize + 6}px` }}>
                                {currentPart.title}
                            </h2>
                            <div className="flex gap-2 bg-slate-50 p-2 rounded-full border">
                                <button onClick={() => setActiveColor("transparent")} className="p-1.5 rounded-full transition hover:bg-white"><Eraser size={16} /></button>
                                {['#fef08a', '#bbf7d0', '#fecaca'].map(c => (
                                    <button key={c} onClick={() => setActiveColor(c)} className="w-6 h-6 rounded-full border shadow-sm" style={{ backgroundColor: c, outline: activeColor === c ? '2px solid #3b82f6' : 'none' }} />
                                ))}
                            </div>
                        </div>
                        {renderPassage()}
                    </div>
                </div>

                <div onMouseDown={() => setIsResizing(true)} className={`w-1 cursor-col-resize transition-colors ${isResizing ? 'bg-blue-500' : 'bg-gray-200'}`} />

                <div style={{ width: `${sidebarWidth}%` }} className="h-full overflow-y-auto p-6 bg-slate-50 border-l">
                    <div className="max-w-lg mx-auto space-y-4">
                        {currentPart.questions.map((q) => {
                            const qId = Number(q.id);
                            // JSON ichidagi question_number yoki revMap orqali raqamni olish
                            const displayNum = revMap[qId] || q.question_number || q.id;

                            // Matn ichidagi gap-fill bo'lsa, sidebar'da ko'rsatmaymiz
                            if (q.type === "GAP_FILL") return null;

                            return (
                                <div key={q.id}
                                    onClick={() => onSelectQuestion(qId)}
                                    className={`p-5 rounded-3xl border bg-white transition-all cursor-pointer 
                                            ${Number(currentQuestion) === qId ? "border-blue-400 shadow-xl ring-1 ring-blue-100 scale-[1.01]" : "border-gray-100"}`}
                                >
                                    <div className="flex gap-4 text-left">
                                        <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[11px]">
                                            {displayNum}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-800 mb-4 text-sm leading-relaxed">{q.text}</p>

                                            {/* 🟢 XATOLIKNI TUZATISH: GAP_FILL_FILL uchun maxsus shart */}
                                            {q.type === "GAP_FILL_FILL" ? (
                                                <GapFillFillRenderer
                                                    answer={answers[qId] || ""}
                                                    onInputChange={(v) => onAnswer(qId, v)}
                                                    fontSize={fontSize}
                                                />
                                            ) : (
                                                <QuestionRenderer
                                                    question={q}
                                                    answer={answers[qId] || ""}
                                                    onAnswer={v => onAnswer(qId, v)}
                                                    fontSize={fontSize} onInputChange={function (value: string): void {
                                                        throw new Error("Function not implemented.")
                                                    }} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}