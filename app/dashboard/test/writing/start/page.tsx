'use client'

import React, { useEffect, useMemo, useRef, useState, useCallback, memo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  GripHorizontal,
  GripVertical,
  Type,
  Play,
  Settings2
} from 'lucide-react'
import { toast } from 'sonner'

import { getWritingExamByIdAPI, submitWritingExamAPI } from '@/lib/api/writing'
import WritingHeader from '@/components/exam/writing-header'

// --- Yordamchi Funksiyalar ---
const wc = (text: string) => text.trim().split(/\s+/).filter(Boolean).length
const getLimits = (task: any) => ({
  min: Number(task?.format?.min_words ?? 0),
  max: Number(task?.format?.max_words ?? 9999),
})
const taskLabel = (task: any) => Number(task.part_number) === 1 ? `1.${task.sub_part}` : '2'

// --- OPTIMALLASHTIRILGAN INPUT (QOTISHNI OLDINI OLISH UCHUN) ---
const TaskBox = memo(({ task, initialValue, fontSize, onUpdate, onFocus }: any) => {
  const [val, setVal] = useState(initialValue)
  const isFocused = useRef(false)

  useEffect(() => {
    if (!isFocused.current) setVal(initialValue)
  }, [initialValue])

  const limits = getLimits(task)
  const words = wc(val)
  const isError = words > 0 && (words < limits.min || words > limits.max)
  const isOk = val.trim().length >= 10 && !isError && words >= limits.min

  return (
    <div className="flex flex-col h-full bg-white rounded-[32px] border-2 border-orange-200 shadow-xl overflow-hidden focus-within:border-orange-500 transition-all">
      <div className="bg-orange-500 p-4 flex justify-between items-center text-white shrink-0">
        <span className="font-black italic uppercase tracking-tighter text-lg">Task {taskLabel(task)}</span>
        <div className="flex items-center gap-3">
          {isOk && <CheckCircle2 size={20} className="text-white animate-bounce" />}
          <span className="bg-black/20 px-3 py-1 rounded-full text-xs font-bold">{words} words</span>
        </div>
      </div>
      <textarea
        style={{ fontSize: `${fontSize}px` }}
        className="flex-1 p-6 outline-none leading-relaxed text-slate-700 resize-none font-medium"
        value={val}
        onFocus={() => { isFocused.current = true; onFocus(String(task.id)) }}
        onBlur={() => { isFocused.current = false }}
        onChange={(e) => {
          setVal(e.target.value)
          onUpdate(String(task.id), e.target.value)
        }}
        placeholder="Sizning javobingiz..."
      />
      <div className={`p-3 text-center text-[10px] font-black uppercase tracking-widest border-t ${isError ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-600'}`}>
        Limit: {limits.min} - {limits.max} so'z
      </div>
    </div>
  )
})

export default function WritingTestPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const examId = searchParams.get('id')

  // --- States ---
  const [exam, setExam] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [fontSize, setFontSize] = useState(18)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  
  // Layout States
  const [splitPos, setSplitPos] = useState(50) // Foizda
  const [isDragging, setIsDragging] = useState(false)
  const [activeTaskId, setActiveTaskId] = useState('')

  const storageKey = `writing_res_${examId}`

  useEffect(() => {
    if (!examId) return
    getWritingExamByIdAPI(examId).then(res => {
      setExam(res.data)
      const saved = localStorage.getItem(storageKey)
      if (saved) setResponses(JSON.parse(saved))
      if (localStorage.getItem(`started_${examId}`)) setHasStarted(true)
      setLoading(false)
    })
  }, [examId, storageKey])

  // Debounced Save to LocalStorage
  useEffect(() => {
    const t = setTimeout(() => {
      if (Object.keys(responses).length > 0) localStorage.setItem(storageKey, JSON.stringify(responses))
    }, 800)
    return () => clearTimeout(t)
  }, [responses, storageKey])

  const handleUpdate = useCallback((id: string, val: string) => {
    setResponses(prev => ({ ...prev, [id]: val }))
  }, [])

  const tasks = useMemo(() => (exam?.tasks ?? []).sort((a: any, b: any) => a.part_number - b.part_number), [exam])

  const handleResize = (e: any) => {
    if (!isDragging) return
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    
    // Mobil uchun Vertical, Desktop uchun Horizontal splitter
    if (window.innerWidth < 1024) {
      const pos = (clientY / window.innerHeight) * 100
      setSplitPos(Math.min(Math.max(pos, 20), 80))
    } else {
      const pos = (clientX / window.innerWidth) * 100
      setSplitPos(Math.min(Math.max(pos, 30), 70))
    }
  }

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-orange-500" size={50} /></div>

  if (!hasStarted) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl text-center max-w-md border-b-8 border-orange-500 animate-in fade-in zoom-in duration-500">
        <h1 className="text-3xl font-black text-slate-800 mb-2 italic uppercase">{exam?.title}</h1>
        <p className="text-slate-400 mb-8 font-medium italic">Writing Section Imtihoni</p>
        <button onClick={() => { setHasStarted(true); localStorage.setItem(`started_${examId}`, 'true') }} 
          className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black text-xl hover:bg-orange-600 shadow-lg shadow-orange-200 active:scale-95 transition-all uppercase italic">
          Boshlash
        </button>
      </div>
    </div>
  )

  return (
    <div 
      className="h-screen flex flex-col bg-[#F8FAFC] overflow-hidden select-none"
      onMouseMove={handleResize}
      onMouseUp={() => setIsDragging(false)}
      onTouchMove={handleResize}
      onTouchEnd={() => setIsDragging(false)}
    >
      <WritingHeader initialSeconds={(exam?.duration_minutes || 60) * 60} onFinish={() => setIsSubmitting(true)} isSubmitting={isSubmitting} />

      {/* --- MAIN LAYOUT (SPLITTER) --- */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* SAVOLLAR QISMI */}
        <div 
          style={{ [window.innerWidth < 1024 ? 'height' : 'width']: `${splitPos}%` }}
          className="overflow-y-auto bg-slate-100 p-4 lg:p-10 custom-scrollbar"
        >
          <div className="max-w-3xl mx-auto space-y-8 pb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold italic shadow-lg shadow-orange-100 italic">Q</div>
              <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">Question Paper</h2>
            </div>
            {tasks.map((task: any) => (
              <div key={task.id} className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-full bg-orange-400"></div>
                <h4 className="font-black text-orange-500 mb-3 text-sm italic uppercase tracking-widest">TASK {taskLabel(task)}</h4>
                <p className="font-bold text-slate-800 text-lg mb-4 leading-tight">{task.topic}</p>
                <div className="text-slate-600 leading-relaxed italic text-sm whitespace-pre-line bg-slate-50 p-4 rounded-2xl mb-4 border border-slate-100">
                  {task.context_text}
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Instruction: <span className="text-slate-700 normal-case font-medium italic">{task.instruction}</span></p>
              </div>
            ))}
          </div>
        </div>

        {/* SPLITTER HANDLE */}
        <div 
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
          className={`shrink-0 z-50 flex items-center justify-center transition-colors
            ${window.innerWidth < 1024 
              ? 'h-6 w-full cursor-ns-resize bg-slate-200 hover:bg-orange-400' 
              : 'w-6 h-full cursor-ew-resize bg-slate-200 hover:bg-orange-400'}`}
        >
          {window.innerWidth < 1024 ? <GripHorizontal className="text-slate-400 group-hover:text-white" /> : <GripVertical className="text-slate-400 group-hover:text-white" />}
        </div>

        {/* JAVOBLAR QISMI */}
        <div 
          style={{ [window.innerWidth < 1024 ? 'height' : 'width']: `${100 - splitPos}%` }}
          className="flex-1 overflow-y-auto p-4 lg:p-10 bg-[#F1F5F9] custom-scrollbar"
        >
          <div className="max-w-4xl mx-auto space-y-12 pb-24 h-full">
             {/* Font sozlamalari */}
             <div className="flex justify-end gap-2 mb-4">
               <button onClick={() => setFontSize(f => Math.max(14, f - 2))} className="p-2 bg-white rounded-lg shadow-sm hover:bg-orange-50"><Type size={16} className="scale-75"/></button>
               <button onClick={() => setFontSize(f => Math.min(24, f + 2))} className="p-2 bg-white rounded-lg shadow-sm hover:bg-orange-50"><Type size={16} className="scale-125"/></button>
             </div>

             {tasks.map((task: any) => (
               <div key={task.id} className="h-[400px] mb-10">
                  <TaskBox 
                    task={task} 
                    initialValue={responses[task.id] || ''} 
                    fontSize={fontSize} 
                    onUpdate={handleUpdate} 
                    onFocus={setActiveTaskId}
                  />
               </div>
             ))}

             <button 
               onClick={() => setIsSubmitting(true)}
               className="w-full py-6 bg-green-500 text-white rounded-[32px] font-black text-xl hover:bg-green-600 shadow-xl shadow-green-100 transition-all uppercase italic tracking-widest"
             >
               Imtihonni topshirish
             </button>
          </div>
        </div>

      </div>

      {/* FOOTER (Faqat navigatsiya uchun) */}
      <div className="bg-white border-t p-2 flex justify-center gap-2 lg:hidden overflow-x-auto">
        {tasks.map((t: any) => (
          <div key={t.id} className={`px-4 py-2 rounded-full text-xs font-black italic uppercase ${activeTaskId === String(t.id) ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
            Task {taskLabel(t)}
          </div>
        ))}
      </div>

      {/* AI SUBMITTING OVERLAY */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-xl z-[200] flex flex-col items-center justify-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-8 border-slate-100 border-t-orange-500 rounded-full animate-spin"></div>
            <Play className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-orange-500 ml-1" size={30} />
          </div>
          <h2 className="text-3xl font-black italic text-slate-800 uppercase tracking-tighter">AI natijalarni hisoblamoqda...</h2>
          <p className="text-slate-400 mt-2 font-medium animate-pulse">Iltimos, sahifadan chiqib ketmang</p>
        </div>
      )}
    </div>
  )
}