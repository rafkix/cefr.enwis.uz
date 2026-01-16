"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Folder, Eraser } from "lucide-react"
import QuestionRenderer from "@/components/exam/question-renderer"
import HighlightText from "@/components/highlight-text"
import type { ExamSet } from "@/lib/exams/reading/data"

export default function ExamContent({
    examData,
    currentQuestion,
    answered,
    onAnswer,
    onSelectQuestion,
    fontSize = 16,
}: {
    examData: ExamSet
    currentQuestion: number
    answered: Record<number, boolean>
    onAnswer: (value: string) => void
    onSelectQuestion: (questionNum: number) => void
    fontSize?: number
}) {
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({})
    const [highlightsByPart, setHighlightsByPart] = useState<Record<number, any[]>>({})
    const [activeColor, setActiveColor] = useState("#fef08a")
    const [sidebarWidth, setSidebarWidth] = useState(45)
    const [isResizing, setIsResizing] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const currentPartIndex = examData.parts.findIndex(part =>
        part.questions.some(q => q.id === currentQuestion)
    )
    const activePartIdx = currentPartIndex === -1 ? 0 : currentPartIndex
    const currentPart = examData.parts[activePartIdx]
    const currentHighlights = highlightsByPart[activePartIdx] || []

    // --- NUSXA KO'CHIRISHNI TAQIQLASH ---
    const preventCopy = useCallback((e: any) => {
        e.preventDefault()
        return false
    }, [])

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl+C, Ctrl+V, Ctrl+U, Ctrl+S va boshqa kombinatsiyalarni bloklash
            if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'u' || e.key === 's' || e.key === 'a')) {
                e.preventDefault()
            }
        }
        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [])

    // --- HIGHLIGHT MANTIQI ---
    const handleHighlight = useCallback(() => {
        const selection = window.getSelection()
        if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return

        const range = selection.getRangeAt(0)
        const container = range.commonAncestorContainer.parentElement?.closest('.passage-segment')
        if (!container) return

        const offset = parseInt(container.getAttribute('data-offset') || '0')
        const preRange = range.cloneRange()
        preRange.selectNodeContents(container)
        preRange.setEnd(range.startContainer, range.startOffset)
        
        const startIndex = offset + preRange.toString().length
        const selectedText = selection.toString()

        if (activeColor !== "transparent" && selectedText.trim().length > 0) {
            setHighlightsByPart(prev => ({
                ...prev,
                [activePartIdx]: [...(prev[activePartIdx] || []), {
                    id: `hl-${Date.now()}`,
                    text: selectedText,
                    color: activeColor,
                    startIndex: startIndex
                }]
            }))
            selection.removeAllRanges() // Bo'yab bo'lingach tanlovni bekor qilish
        }
    }, [activeColor, activePartIdx])

    const renderContent = () => {
        const text = currentPart.passage
        const parts = text.split(/_{3,}/g)
        const gapFillQs = currentPart.questions.filter(q => q.type === "GAP_FILL" || q.type === "GAP_FILL_FILL")
        let globalOffset = 0

        return (
            <div 
                className="leading-[2.5] text-justify whitespace-pre-wrap text-slate-800"
                style={{ fontSize: `${fontSize}px` }}
                onCopy={preventCopy}
                onCut={preventCopy}
                onContextMenu={(e) => e.preventDefault()} // O'ng tugmani bloklash
            >
                {parts.map((part, index) => {
                    const currentSegmentOffset = globalOffset
                    globalOffset += part.length + 3

                    return (
                        <span key={index} className="inline">
                            <span 
                                className="passage-segment inline select-text" 
                                data-offset={currentSegmentOffset}
                                onMouseUp={handleHighlight}
                            >
                                <HighlightText 
                                    text={part}
                                    highlights={currentHighlights}
                                    offset={currentSegmentOffset}
                                    onRemoveHighlight={(id) => setHighlightsByPart(prev => ({
                                        ...prev, [activePartIdx]: (prev[activePartIdx] || []).filter(h => h.id !== id)
                                    }))}
                                />
                            </span>
                            {index < parts.length - 1 && gapFillQs[index] && (
                                <input
                                    type="text"
                                    value={selectedAnswers[gapFillQs[index].id] || ""}
                                    onChange={(e) => {
                                        setSelectedAnswers(prev => ({ ...prev, [gapFillQs[index].id]: e.target.value }))
                                        onAnswer(e.target.value)
                                    }}
                                    onFocus={() => onSelectQuestion(gapFillQs[index].id)}
                                    className="w-32 h-8 mx-1 px-2 border-b-2 outline-none text-center font-bold text-blue-900 bg-blue-50/30 border-blue-300 rounded-t-md"
                                    placeholder={`(${gapFillQs[index].id})`}
                                />
                            )}
                        </span>
                    )
                })}
            </div>
        )
    }

    // --- RESIZER VA BOSHQA QISMLAR ---
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing || !containerRef.current) return
            const newWidth = ((containerRef.current.offsetWidth - (e.clientX - containerRef.current.offsetLeft)) / containerRef.current.offsetWidth) * 100
            if (newWidth > 20 && newWidth < 80) setSidebarWidth(newWidth)
        }
        if (isResizing) { window.addEventListener("mousemove", handleMouseMove); window.addEventListener("mouseup", () => setIsResizing(false)) }
        return () => { window.removeEventListener("mousemove", handleMouseMove); window.removeEventListener("mouseup", () => setIsResizing(false)) }
    }, [isResizing])

    return (
        <div ref={containerRef} className="flex flex-col h-full bg-white overflow-hidden relative border border-gray-200 rounded-xl select-none shadow-sm">
            <div className="flex items-center justify-center p-3 bg-gray-50 border-b z-30">
                <div className="flex items-center gap-1 bg-gray-200/50 p-1 rounded-lg">
                    {examData.parts.map((_, idx) => (
                        <button key={idx} onClick={() => onSelectQuestion(examData.parts[idx].questions[0].id)}
                            className={`px-6 py-1.5 rounded-md text-sm font-bold ${activePartIdx === idx ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"}`}>
                            Part {idx + 1}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                <div style={{ width: `${100 - sidebarWidth}%` }} className="h-full overflow-y-auto p-8 bg-white no-copy">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center justify-between mb-8 border-b pb-4">
                            <h2 className="font-bold text-blue-900" style={{ fontSize: `${fontSize + 8}px` }}>{currentPart.title}</h2>
                            <div className="flex gap-2">
                                <button onClick={() => setActiveColor("transparent")} className={`p-2 rounded-full ${activeColor === "transparent" ? "bg-blue-100 ring-2 ring-blue-400" : "bg-slate-100"}`}><Eraser className="w-4 h-4" /></button>
                                {['#fef08a', '#bbf7d0', '#fecaca'].map(c => (
                                    <button key={c} onClick={() => setActiveColor(c)} className="w-7 h-7 rounded-full border-2" style={{ backgroundColor: c, borderColor: activeColor === c ? '#3b82f6' : 'transparent' }} />
                                ))}
                            </div>
                        </div>
                        {renderContent()}
                    </div>
                </div>

                <div onMouseDown={() => setIsResizing(true)} className={`w-1 cursor-col-resize ${isResizing ? 'bg-blue-500' : 'bg-gray-200'}`} />

                <div style={{ width: `${sidebarWidth}%` }} className="h-full overflow-y-auto p-6 bg-slate-50 border-l">
                    <div className="max-w-lg mx-auto space-y-4">
                        {currentPart.questions.filter(q => q.type !== "GAP_FILL").map((question: any) => (
                            <div key={question.id} onClick={() => onSelectQuestion(question.id)} className={`p-5 rounded-2xl border bg-white ${currentQuestion === question.id ? "border-blue-400 shadow-md" : "border-gray-100"}`}>
                                <div className="flex gap-4 text-left">
                                    <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">{question.id}</div>
                                    <div className="flex-1">
                                        <p className="font-bold text-slate-800 mb-2">{question.text || "Select the answer:"}</p>
                                        {currentQuestion === question.id && <QuestionRenderer question={question} answer={selectedAnswers[question.id] || ""} onAnswer={(val) => { setSelectedAnswers(prev => ({ ...prev, [question.id]: val })); onAnswer(val) }} onInputChange={(val) => { setSelectedAnswers(prev => ({ ...prev, [question.id]: val })); onAnswer(val) }} fontSize={fontSize} />}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}