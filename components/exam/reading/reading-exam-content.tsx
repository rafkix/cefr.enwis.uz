"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Eraser, Folder } from "lucide-react"
import QuestionRenderer from "@/components/exam/reading/reading-question-renderer"
import HighlightText from "@/components/highlight-text"
// O'ZGARISH: Type endi API strukturasiga moslashdi
import type { ReadingExam } from "@/lib/types/reading"

export default function ReadingExamContent({
    examData, currentQuestion, answered, answers, onAnswer, onSelectQuestion, fontSize = 16,
}: {
    examData: ReadingExam; // O'ZGARISH: ExamSet -> ReadingExam
    currentQuestion: number;
    answered: Record<number, boolean>;
    answers: Record<number, string>;
    onAnswer: (questionId: number, value: string) => void;
    onSelectQuestion: (questionNum: number) => void;
    fontSize?: number
}) {
    const [activePartIndex, setActivePartIndex] = useState(0)
    const [highlightsByPart, setHighlightsByPart] = useState<Record<number, any[]>>({})
    const [activeColor, setActiveColor] = useState("#fef08a")
    const [sidebarWidth, setSidebarWidth] = useState(45)
    const [isResizing, setIsResizing] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    // Current Question o'zgarganda Partni ham o'zgartirish
    useEffect(() => {
        if (!examData?.parts) return;
        const pIdx = examData.parts.findIndex(p => p.questions.some(q => Number(q.id) === Number(currentQuestion)))
        if (pIdx !== -1 && pIdx !== activePartIndex) setActivePartIndex(pIdx)
    }, [currentQuestion, examData, activePartIndex])

    const currentPart = examData?.parts?.[activePartIndex] || examData?.parts?.[0]

    // Agar ma'lumot hali yuklanmagan bo'lsa
    if (!currentPart) return null;

    const currentHighlights = highlightsByPart[activePartIndex] || []

    const handleHighlight = useCallback(() => {
        const s = window.getSelection(); if (!s || s.isCollapsed) return;
        const r = s.getRangeAt(0); const c = r.commonAncestorContainer.parentElement?.closest('.passage-segment');
        if (!c) return;
        const hl = { id: `hl-${Date.now()}`, text: s.toString(), color: activeColor, startIndex: parseInt(c.getAttribute('data-offset') || '0') + r.cloneRange().selectNodeContents(c).toString().length };
        if (activeColor !== "transparent") setHighlightsByPart(p => ({ ...p, [activePartIndex]: [...(p[activePartIndex] || []), hl] }));
        s.removeAllRanges();
    }, [activeColor, activePartIndex])

    const renderContent = () => {
        const text = currentPart.passage || "";
        const parts = text.split(/_{3,}/g);
        const gapFillQs = currentPart.questions.filter(q => q.type === "GAP_FILL");
        let offset = 0;

        return (
            <div className="leading-[2.5] text-justify whitespace-pre-wrap text-slate-800" style={{ fontSize: `${fontSize}px` }} onContextMenu={e => e.preventDefault()}>
                {parts.map((part, i) => {
                    const segOffset = offset; offset += part.length + 3;
                    const q = gapFillQs[i];
                    const qId = q ? Number(q.id) : 0;

                    return (
                        <span key={i} className="inline">
                            <span className="passage-segment inline select-text" data-offset={segOffset} onMouseUp={handleHighlight}>
                                <HighlightText text={part} highlights={currentHighlights} offset={segOffset} onRemoveHighlight={id => setHighlightsByPart(p => ({ ...p, [activePartIndex]: p[activePartIndex].filter(h => h.id !== id) }))} />
                            </span>

                            {i < parts.length - 1 && q && (
                                <input
                                    type="text"
                                    value={answers[qId] || ""}
                                    onChange={e => onAnswer(qId, e.target.value)}
                                    onFocus={() => onSelectQuestion(qId)}
                                    placeholder={`(${q.id})`}
                                    className={`w-32 h-8 mx-1 px-2 border-b-2 outline-none text-center font-bold text-blue-900 bg-blue-50/30 border-blue-300 rounded-t-md ${Number(currentQuestion) === qId ? "ring-2 ring-blue-400" : ""}`}
                                />
                            )}
                        </span>
                    )
                })}
            </div>
        )
    }

    // Resizer logic
    useEffect(() => {
        const mv = (e: MouseEvent) => { if (isResizing && containerRef.current) setSidebarWidth(((containerRef.current.offsetWidth - (e.clientX - containerRef.current.offsetLeft)) / containerRef.current.offsetWidth) * 100) }
        const up = () => setIsResizing(false);
        if (isResizing) { window.addEventListener("mousemove", mv); window.addEventListener("mouseup", up) }
        return () => { window.removeEventListener("mousemove", mv); window.removeEventListener("mouseup", up) }
    }, [isResizing])

    return (
        <div ref={containerRef} className="flex flex-col h-full bg-white overflow-hidden relative border border-gray-200 select-none shadow-sm">
            <div className="h-14 bg-white border-b flex items-center justify-center shrink-0 ">
                {/* 🧭 Reading Part Navigation */}
                <div className="h-14 bg-white border-b flex items-center justify-center shrink-0">
                    <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
                        {examData.parts.map((_, idx: number) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setActivePartIndex(idx);
                                    const firstQuestion = examData.parts[idx].questions[0];
                                    if (firstQuestion) {
                                        onSelectQuestion(Number(firstQuestion.id));
                                    }
                                }}
                                className={`flex items-center gap-3 px-5 py-2 rounded-xl text-[11px] font-black transition-all 
                ${activePartIndex === idx
                                        ? "bg-white text-blue-600 shadow-md ring-1 ring-black/5"
                                        : "text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"}`}
                            >
                                <Folder
                                    size={14}
                                    className={`${activePartIndex === idx ? "text-blue-500 fill-blue-50" : "text-slate-300"}`}
                                />
                                <span className="tracking-tighter uppercase">{idx + 1}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex flex-1 overflow-hidden">
                <div style={{ width: `${100 - sidebarWidth}%` }} className="h-full overflow-y-auto p-8 bg-white no-copy">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center justify-between mb-8 border-b pb-4">
                            <h2 className="font-bold text-blue-900" style={{ fontSize: `${fontSize + 8}px` }}>{currentPart.title}</h2>
                            <div className="flex gap-2">
                                <button onClick={() => setActiveColor("transparent")} className={`p-2 rounded-full ${activeColor === "transparent" ? "bg-blue-100 ring-2 ring-blue-400" : "bg-slate-100"}`}><Eraser className="w-4 h-4" /></button>
                                {['#fef08a', '#bbf7d0', '#fecaca'].map(c => (<button key={c} onClick={() => setActiveColor(c)} className="w-7 h-7 rounded-full border-2" style={{ backgroundColor: c, borderColor: activeColor === c ? '#3b82f6' : 'transparent' }} />))}
                            </div>
                        </div>
                        {renderContent()}
                    </div>
                </div>
                <div onMouseDown={() => setIsResizing(true)} className={`w-1 cursor-col-resize ${isResizing ? 'bg-blue-500' : 'bg-gray-200'}`} />
                <div style={{ width: `${sidebarWidth}%` }} className="h-full overflow-y-auto p-6 bg-slate-50 border-l">
                    <div className="max-w-lg mx-auto space-y-4">
                        {currentPart.questions.filter(q => q.type !== "GAP_FILL").map((q) => {
                            const qId = Number(q.id);
                            return (
                                <div key={q.id} onClick={() => onSelectQuestion(qId)} className={`p-5 rounded-2xl border bg-white cursor-pointer ${Number(currentQuestion) === qId ? "border-blue-400 shadow-md" : "border-gray-100"}`}>
                                    <div className="flex gap-4 text-left">
                                        <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">{q.id}</div>
                                        <div className="flex-1">
                                            {q.type !== "GAP_FILL_FILL" && <p className="font-bold text-slate-800 mb-2">{q.text || "Select answer:"}</p>}
                                            {/* GAP_FILL_FILL Logic */}
                                            {q.type === "GAP_FILL_FILL" ? (
                                                <div className="text-sm leading-loose text-slate-800">
                                                    {q.text.split(/_{3,}|__________/g).map((part, i, arr) => (
                                                        <span key={i}>{part}{i < arr.length - 1 && (
                                                            <input type="text" value={answers[qId] || ""} onChange={e => onAnswer(qId, e.target.value)} onFocus={() => onSelectQuestion(qId)}
                                                                className={`mx-1 w-28 h-7 px-2 border-b-2 outline-none text-center font-bold rounded-t-md transition-all text-sm inline-block ${Number(currentQuestion) === qId ? "border-blue-500 bg-blue-50 text-blue-900" : "border-gray-300 bg-gray-50"}`} />
                                                        )}</span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div onClick={e => e.stopPropagation()}>
                                                    <QuestionRenderer question={q} answer={answers[qId] || ""} onAnswer={v => onAnswer(qId, v)} onInputChange={v => onAnswer(qId, v)} fontSize={fontSize} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        {currentPart.questions.every(q => q.type === "GAP_FILL") && <div className="text-center p-10 text-gray-400 border-2 border-dashed rounded-xl">Matn ichidagi bo'sh joylarni to'ldiring.</div>}
                    </div>
                </div>
            </div>
        </div>
    )
}