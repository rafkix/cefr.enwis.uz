    // "use client"

    // import { useState, useEffect, useRef } from "react"
    // import { useRouter, useParams } from "next/navigation"
    // import { Loader2, Sparkles, Clock, CheckCircle2, UserCircle } from "lucide-react"
    // // import { writingSets, type EvaluationResult } from "@/lib/exams/writing/data"
    // import { WritingEvaluationModal } from "@/components/writing-evaluation-modal"

    // export default function WritingTestPage() {
    //     const router = useRouter()
    //     const { testId } = useParams<{ testId: string }>()

    //     // --- DATA ---
    //     // const test = writingSets.find((t) => t.id === testId)

    //     // --- STATE ---
    //     const [activePart, setActivePart] = useState<string>(test?.tasks[0]?.part || "")
    //     const [responses, setResponses] = useState<Record<string, string>>({})
    //     const [timeRemaining, setTimeRemaining] = useState(3600)
    //     const [fontSize, setFontSize] = useState(16)

    //     // --- REFS ---
    //     const promptRefs = useRef<Record<string, HTMLDivElement | null>>({})
    //     const inputRefs = useRef<Record<string, HTMLDivElement | null>>({})
    //     const videoRef = useRef<HTMLVideoElement>(null)

    //     // --- FLAGS ---
    //     const [isCameraOn, setIsCameraOn] = useState(false)
    //     const [isEvaluating, setIsEvaluating] = useState(false)
    //     const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null)
    //     const [showEvaluation, setShowEvaluation] = useState(false)
    //     const [isSubmitting, setIsSubmitting] = useState(false)

    //     // --- TIMER & CAMERA ---
    //     useEffect(() => {
    //         const i = setInterval(() => setTimeRemaining((t) => Math.max(t - 1, 0)), 1000)
    //         async function startCam() {
    //             try {
    //                 const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    //                 if (videoRef.current) {
    //                     videoRef.current.srcObject = stream
    //                     setIsCameraOn(true)
    //                 }
    //             } catch (e) { console.error(e) }
    //         }
    //         startCam()
    //         return () => clearInterval(i)
    //     }, [])

    //     const formatTime = (s: number) => {
    //         const m = Math.floor(s / 60).toString().padStart(2, "0")
    //         const sec = (s % 60).toString().padStart(2, "0")
    //         return `${m}:${sec}`
    //     }

    //     // --- ACTIONS ---
    //     const handleNavClick = (part: string) => {
    //         setActivePart(part)
    //         // Ikkala tomonni ham scroll qilamiz
    //         promptRefs.current[part]?.scrollIntoView({ behavior: "smooth", block: "center" })
    //         inputRefs.current[part]?.scrollIntoView({ behavior: "smooth", block: "center" })
    //     }

    //     const handleZoomIn = () => setFontSize(p => Math.min(p + 1, 24))
    //     const handleZoomOut = () => setFontSize(p => Math.max(p - 1, 14))

    //     const handleCheckAI = async (part: string) => {
    //         const currentTask = test?.tasks.find(t => t.part === part)
    //         if (!currentTask) return
    //         const text = responses[part] || ""
    //         if (text.length < 5) return alert("Matn juda qisqa.")

    //         setIsEvaluating(true)
    //         try {
    //             const res = await fetch("/api/evaluate-writing", {
    //                 method: "POST",
    //                 headers: { "Content-Type": "application/json" },
    //                 body: JSON.stringify({
    //                     taskPart: part,
    //                     taskPrompt: `${currentTask.instruction}\n\n${currentTask.prompt}`,
    //                     userAnswer: text
    //                 })
    //             })
    //             const data = await res.json()
    //             setEvaluation(data)
    //             setShowEvaluation(true)
    //         } finally {
    //             setIsEvaluating(false)
    //         }
    //     }

    //     const handleSubmit = async () => {
    //         if (!confirm("Testni yakunlaysizmi?")) return
    //         setIsSubmitting(true)
    //         setTimeout(() => {
    //             setIsSubmitting(false)
    //             router.push(`/test/writing/${testId}/result`)
    //         }, 1000)
    //     }

    //     if (!test) return <div>Loading...</div>

    //     return (
    //         <div className="flex flex-col h-screen bg-[#F5F7FA] font-sans text-slate-800 overflow-hidden select-none">

    //             {/* ================= HEADER 1-QAVAT (Sarlavha & User) ================= */}
    //             <div className="flex-none h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-40">
    //                 {/* Chap: Logo */}
    //                 <div className="flex items-center gap-3">
    //                     <div className="bg-[#00BFFF] w-2 h-8 rounded-r"></div>
    //                     <h1 className="text-2xl font-extrabold text-gray-700 tracking-wide uppercase">Yozish Qismi</h1>
    //                 </div>

    //                 {/* O'ng: User */}
    //                 <div className="flex items-center gap-3">
    //                     <div className="text-right hidden sm:block">
    //                         <p className="text-sm font-bold text-gray-800">Abdullayev Abdulla</p>
    //                         <p className="text-xs text-gray-500">ID: 2409821</p>
    //                     </div>
    //                     <div className="bg-gray-100 p-2 rounded-full text-gray-600 border border-gray-300">
    //                         <UserCircle size={24} />
    //                     </div>
    //                 </div>
    //             </div>

    //             {/* ================= MAIN CONTENT ================= */}
    //             <div className="flex flex-1 overflow-hidden">

    //                 {/* --- CHAP: INPUTLAR (45%) --- */}
    //                 <div className="w-[45%] h-full overflow-y-auto bg-white border-r border-gray-300 p-5 scroll-smooth">
    //                     <div className="flex flex-col gap-8 pb-32">
    //                         {test.tasks.map((task) => {
    //                             const isActive = activePart === task.part
    //                             return (
    //                                 <div
    //                                     key={task.part}
    //                                     ref={(el) => { inputRefs.current[task.part] = el }}
    //                                     onClick={() => handleNavClick(task.part)}
    //                                     className={`flex flex-col bg-white border transition-all duration-300 rounded-sm
    //                                 ${isActive ? 'border-[#00BFFF] shadow-md ring-2 ring-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
    //                                 >
    //                                     <div className={`px-4 py-2.5 flex justify-between items-center border-b
    //                                 ${isActive ? 'bg-[#00BFFF] text-white' : 'bg-gray-100 text-gray-600'}`}>
    //                                         <span className="font-bold text-lg">Task {task.part}</span>
    //                                         {isActive && (
    //                                             <button
    //                                                 onClick={(e) => { e.stopPropagation(); handleCheckAI(task.part); }}
    //                                                 className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1"
    //                                             >
    //                                                 {isEvaluating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
    //                                                 AI
    //                                             </button>
    //                                         )}
    //                                     </div>
    //                                     <textarea
    //                                         className="w-full min-h-[220px] p-4 resize-y outline-none text-gray-800 text-base leading-relaxed rounded-b-sm"
    //                                         style={{ fontSize: `${fontSize}px` }}
    //                                         value={responses[task.part] || ""}
    //                                         onChange={(e) => setResponses({ ...responses, [task.part]: e.target.value })}
    //                                         placeholder="Javobingizni shu yerga yozing..."
    //                                     />
    //                                     <div className="bg-gray-50 px-3 py-1 text-right text-xs font-bold text-gray-500 border-t">
    //                                         Words: {(responses[task.part] || "").split(/\s+/).filter(Boolean).length} / {task.minWords}
    //                                     </div>
    //                                 </div>
    //                             )
    //                         })}
    //                     </div>
    //                 </div>

    //                 {/* --- O'NG: MATN VA SAVOLLAR (TOZALANGAN) --- */}
    //                 <div className="flex-1 h-full overflow-y-auto bg-white relative scroll-smooth">
    //                     <div className="p-10 pb-40 max-w-3xl mx-auto" style={{ fontSize: `${fontSize}px` }}>

    //                         {/* Context (Umumiy matn) - Hech qanday ramka va yozuvsiz */}
    //                         {test.sharedContext && (
    //                             <div className="mb-10 text-gray-800 leading-loose italic">
    //                                 {test.sharedContext}
    //                             </div>
    //                         )}

    //                         {/* Tasks List - Chiziqlar olib tashlandi */}
    //                         {test.tasks.map((task) => {
    //                             return (
    //                                 <div
    //                                     key={task.part}
    //                                     ref={(el) => { promptRefs.current[task.part] = el }}
    //                                     className="mb-16 scroll-mt-32" // Har bir task orasida joy
    //                                 >
    //                                     {/* Task Nomi (Masalan: Task 1.1) */}
    //                                     <h3 className="font-bold mb-4 text-xl text-[#00BFFF]">
    //                                         Task {task.part}
    //                                     </h3>

    //                                     {/* Yo'riqnoma */}
    //                                     <p className="font-bold text-gray-900 mb-3">
    //                                         {task.instruction}
    //                                     </p>

    //                                     {/* Savol matni */}
    //                                     <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
    //                                         {task.prompt}
    //                                     </div>

    //                                     {/* So'z limiti */}
    //                                     {task.minWords && (
    //                                         <p className="mt-2 text-sm text-gray-500 font-bold">
    //                                             Min: {task.minWords} words
    //                                         </p>
    //                                     )}
    //                                 </div>
    //                             )
    //                         })}
    //                     </div>
    //                 </div>

    //                 {/* Chap va O'ng o'rtasida joylashgan vertikal liniya */}
    //                 <div className="w-[80px] h-full bg-[#E9ECEF] border-x border-gray-300 flex flex-col items-center justify-center gap-4 shadow-inner z-20">

    //                     {/* Dinamik Tugmalar (Kvadrat shaklda) */}
    //                     {test.tasks.map((task, index) => (
    //                         <div key={task.part} className="flex flex-col items-center w-full">
    //                             <button
    //                                 onClick={() => handleNavClick(task.part)}
    //                                 className={`
    //                     w-14 h-14 flex items-center justify-center font-bold text-sm rounded-md shadow-sm transition-all duration-200
    //                     ${activePart === task.part
    //                                         ? 'bg-[#00BFFF] text-white border-2 border-[#00BFFF] scale-110 shadow-lg'
    //                                         : 'bg-white text-gray-600 border-2 border-gray-300 hover:border-[#00BFFF] hover:text-[#00BFFF]'}
    //                 `}
    //                             >
    //                                 {task.part}
    //                             </button>
    //                         </div>
    //                     ))}

    //                 </div>

    //             </div>

    //             {/* ================= VEB-KAMERA ================= */}
    //             <div className="fixed bottom-4 right-4 w-52 h-40 bg-black rounded shadow-2xl border-2 border-white overflow-hidden z-50 cursor-move">
    //                 <video
    //                     ref={videoRef}
    //                     autoPlay
    //                     muted
    //                     className="w-full h-full object-cover transform scale-x-[-1]"
    //                 />
    //                 <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
    //                     <div className={`w-2 h-2 rounded-full ${isCameraOn ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
    //                     <span className="text-[9px] font-bold text-white tracking-wider">REC</span>
    //                 </div>
    //             </div>

    //             <WritingEvaluationModal
    //                 open={showEvaluation}
    //                 onOpenChange={setShowEvaluation}
    //                 evaluation={evaluation}
    //                 taskPart={activePart}
    //             />
    //         </div>
    //     )
    // }

    "use client"

import { useRouter } from "next/navigation"
import { Construction, ArrowLeft, PenTool } from "lucide-react"

export default function WritingMaintenancePage() {
    const router = useRouter()

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
            
            {/* Icon qismi */}
            <div className="relative mb-8">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                    <Construction size={48} className="text-blue-600" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-100">
                    <PenTool size={20} className="text-slate-400" />
                </div>
            </div>

            {/* Matn qismi */}
            <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-4 uppercase tracking-tight">
                Tez Kunda!
            </h1>
            <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium leading-relaxed">
                Writing (Yozish) moduli ustida hozirda texnik ishlar olib borilmoqda. 
                Tez orada to'liq funksional holda taqdim etiladi.
            </p>

            {/* Tugma */}
            <button 
                onClick={() => router.back()}
                className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-slate-200"
            >
                <ArrowLeft size={20} />
                Orqaga qaytish
            </button>
            
            <p className="mt-12 text-xs font-bold text-slate-300 uppercase tracking-widest">
                Enwis Development Team
            </p>
        </div>
    )
}