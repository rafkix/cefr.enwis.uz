"use client"

import { useState, useEffect, useRef } from "react"
import { Camera, BookOpen, PenTool } from "lucide-react"
import ExamHeader from "@/components/exam/exam-header"

export default function WritingTestPage() {
    const taskOrder = ["1.1", "1.2", "2"]
    const [responses, setResponses] = useState<Record<string, string>>({ "1.1": "", "1.2": "", "2": "" })
    const [fontSizes, setFontSizes] = useState<Record<string, number>>({ "1.1": 18, "1.2": 18, "2": 18 })
    const [visibleTask, setVisibleTask] = useState("1.1")
    const [activeTab, setActiveTab] = useState<"question" | "answer">("answer")

    // Yozish paytida navigatsiyani yashirish uchun holat
    const [isTyping, setIsTyping] = useState(false)

    const taskRefs: Record<string, React.RefObject<HTMLDivElement | null>> = {
        "1.1": useRef<HTMLDivElement | null>(null),
        "1.2": useRef<HTMLDivElement | null>(null),
        "2": useRef<HTMLDivElement | null>(null),
    }

    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerWidth < 1024) return
            const scrollPos = containerRef.current?.scrollTop || 0
            for (const id of taskOrder) {
                const ref = taskRefs[id]
                if (ref.current && Math.abs(ref.current.offsetTop - scrollPos - 30) < 200) {
                    setVisibleTask(id)
                }
            }
        }
        const container = containerRef.current
        container?.addEventListener("scroll", handleScroll)
        return () => container?.removeEventListener("scroll", handleScroll)
    }, [])

    const scrollToTask = (task: string) => {
        setActiveTab("answer")
        setTimeout(() => {
            taskRefs[task].current?.scrollIntoView({ behavior: "smooth" })
            setVisibleTask(task)
        }, 100)
    }

    const changeFontSize = (task: string, delta: number) => {
        setFontSizes(prev => ({ ...prev, [task]: Math.min(Math.max(prev[task] + delta, 12), 32) }))
    }

    const getWordCount = (text: string) => text.trim().split(/\s+/).filter(Boolean).length

    return (
        <div className="flex flex-col h-screen bg-[#F3F4F6] font-sans overflow-hidden">
            <ExamHeader currentSection="writing" />

            {/* MOBILE TAB BAR - Yozayotganda yashirinadi */}
            <div className={`lg:hidden flex bg-white border-b border-gray-200 shrink-0 transition-all duration-300 ${isTyping ? "h-0 overflow-hidden opacity-0" : "h-auto opacity-100"}`}>
                <button
                    onClick={() => setActiveTab("question")}
                    className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold transition-all ${activeTab === "question" ? "text-blue-600 border-b-4 border-blue-600 bg-blue-50" : "text-gray-400"}`}
                >
                    <BookOpen size={18} /> Question
                </button>
                <button
                    onClick={() => setActiveTab("answer")}
                    className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold transition-all ${activeTab === "answer" ? "text-[#22D3EE] border-b-4 border-[#22D3EE] bg-cyan-50" : "text-gray-400"}`}
                >
                    <PenTool size={18} /> Javob
                </button>
            </div>

            <main className="flex flex-1 overflow-hidden relative">

                {/* --- JAVOBLAR SECTION --- */}
                <section
                    ref={containerRef}
                    className={`
                        w-full lg:w-1/2 h-full overflow-y-auto p-4 lg:p-10 custom-scrollbar scroll-smooth
                        ${activeTab === "answer" ? "block" : "hidden lg:block"}
                    `}
                >
                    <div className="space-y-12 pb-80">
                        {taskOrder.map((taskId) => (
                            <div
                                key={taskId}
                                id={`task-${taskId}`} // Navigatsiya ishlashi uchun ID muhim
                                ref={taskRefs[taskId]}
                                className="rounded-3xl border-2 border-[#22D3EE] overflow-hidden shadow-lg flex flex-col resize-y min-h-[350px] bg-white group"
                                style={{ height: taskId === "2" ? "550px" : "450px" }}
                            >
                                {/* Task Header */}
                                <div className="bg-[#22D3EE] p-5 flex justify-between items-center text-white shrink-0">
                                    <span className="font-black text-2xl italic uppercase tracking-tighter">Task {taskId}</span>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center bg-white/20 rounded-xl p-1 border border-white/30">
                                            <button onClick={() => changeFontSize(taskId, -2)} className="px-3 hover:bg-white/20 rounded-lg font-bold transition-colors">-a</button>
                                            <div className="w-[1px] h-4 bg-white/40 mx-1" />
                                            <button onClick={() => changeFontSize(taskId, 2)} className="px-3 hover:bg-white/20 rounded-lg font-bold transition-colors">A+</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Textarea */}
                                <div className="flex-1 min-h-0">
                                    <textarea
                                        style={{ fontSize: `${fontSizes[taskId]}px` }}
                                        onFocus={() => setIsTyping(true)}
                                        onBlur={() => setIsTyping(false)}
                                        className="w-full h-full p-8 outline-none leading-relaxed text-gray-700 font-medium transition-all bg-transparent custom-scrollbar resize-none"
                                        placeholder={`Task ${taskId} uchun javobingizni shu yerga yozing...`}
                                        value={responses[taskId]}
                                        onChange={(e) => setResponses({ ...responses, [taskId]: e.target.value })}
                                    />
                                </div>

                                {/* Word Counter */}
                                <div className={`p-4 bg-slate-50 text-right font-black text-sm border-t shrink-0 ${getWordCount(responses[taskId]) === 0 ? 'text-red-400' : 'text-[#22D3EE]'}`}>
                                    {getWordCount(responses[taskId])} TA SO'Z
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- SAVOLLAR SECTION --- */}
                <section className={`
                    w-full lg:w-1/2 h-full overflow-y-auto p-6 lg:p-12 bg-[#F3F4F6] border-l border-gray-200 relative custom-scrollbar
                    ${activeTab === "question" ? "block" : "hidden lg:block"}
                `}>
                    <div className="max-w-5xl mx-auto bg-white rounded-[20px] shadow-sm border border-gray-100 p-12 space-y-10 mb-20">
                        {/* Part 1 */}
                        <div className="text-center space-y-4">
                            <h3 className="text-3xl font-black uppercase">Part 1</h3>
                        </div>
                        <p className="font-bold leading-tight text-xl">You are a member of a fitness club. You received an email from the manager of the club.</p>
                        <div className="text-lg leading-relaxed text-slate-600">
                            Dear Member, <br /><br />
                            I am sorry to inform you that the fitness center is closing for a month from next Monday.
                            The building needs some repairs and we also plan to install some new equipment.
                            What else do you think should be changed? As the center will not be operating for a month,
                            what kind of alternative activities should we organize in the meantime? We appreciate your opinion very much. <br /><br />
                            The Manager.
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="font-black text-xl text-slate-800">Task 1.1</h4>
                                <p className="italic text-lg">Write a letter to your friend, who is also a member of the club. Write about your feelings and what you think the club management should do about the situation. Write about 50 words.</p>
                            </div>
                            <div>
                                <h4 className="font-black text-xl text-slate-800">Task 1.2</h4>
                                <p className="italic text-lg">Write a letter to the manager. Write about your feelings and what you think the club management should do about the situation. Write about 120-150 words.</p>
                            </div>
                        </div>

                        <div className="pt-10 border-t">
                            <h3 className="text-3xl font-black uppercase text-center mb-6">Part 2</h3>
                            <p className="text-lg leading-relaxed">
                                You are participating in an online discussion for language learners. <br />
                                The question is: <b>“Is it better to live in a big city or a small town?”</b> <br />
                                Post your response, giving reasons and examples. <br />
                                Write 180-200 words.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Yozayotganda (isTyping) navigatsiya tugmalari butunlay yashiriladi */}
                <section className="w-1/16">
                    <div className={`fixed lg:absolute right-6 top-1/2 -translate-y-1/2 lg:flex flex-col gap-5 z-50 transition-all duration-300
                    ${isTyping ? "max-lg:opacity-0 max-lg:pointer-events-none" : "flex opacity-100"}
                `}>
                        {taskOrder.map((id) => (
                            <button
                                key={id}
                                onClick={() => scrollToTask(id)}
                                className={`w-15 h-15 rounded-[20px] font-black shadow-lg transition-all flex flex-col items-center justify-center text-center leading-[1.1] tracking-tighter border-4 
                                ${visibleTask === id
                                        ? "bg-blue-600 text-white scale-110 border-blue-200 shadow-blue-300"
                                        : "bg-blue-100 text-blue-400 border-transparent hover:bg-blue-200"
                                    }`}
                            >
                                <span className={visibleTask === id ? "text-xl" : "text-lg"}>{id}</span>
                                {visibleTask === id && <span className="text-[10px] uppercase font-black mt-1">task</span>}
                            </button>
                        ))}
                    </div>

                    {/* CAMERA */}
                    <div className="hidden lg:flex absolute bottom-6 right-8 w-48 h-28 bg-[#22D3EE] rounded-2xl border-4 border-white shadow-2xl items-center justify-center overflow-hidden">
                        <Camera className="text-white opacity-20" size={50} />
                        <div className="absolute bottom-2 left-4 flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black text-white uppercase italic tracking-tighter">camera</span>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    )
}