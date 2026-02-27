'use client'

import React, { useEffect, useMemo, useRef, useState, useCallback, memo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, AlertCircle, CheckCircle2, Play, GripHorizontal } from 'lucide-react'
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

/**
 * Persist responses: Debounce + Idle helper
 */
function writeStorageIdle(key: string, value: string) {
  try {
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(() => {
        localStorage.setItem(key, value)
      })
      return
    }
    setTimeout(() => { localStorage.setItem(key, value) }, 0)
  } catch {}
}

// --- OPTIMALLASHTIRILGAN TEXTAREA KOMPONENTI ---
const TaskTextArea = memo(function TaskTextArea({
  task,
  initialValue,
  fontSize,
  onFocusTask,
  onDraftChange,
}: any) {
  const [localValue, setLocalValue] = useState(initialValue)
  const isFocusedRef = useRef(false)

  useEffect(() => {
    if (!isFocusedRef.current) setLocalValue(initialValue)
  }, [initialValue])

  const { min, max } = getLimits(task)
  const words = wc(localValue)
  const outOfRange = words > 0 && (words < min || words > max)
  const isOk = localValue.trim().length >= 10 && words >= min && words <= max

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value
    setLocalValue(v)
    onDraftChange(String(task.id), v)
  }

  return (
    <div className="rounded-3xl border-2 border-orange-400 overflow-hidden shadow-lg flex flex-col min-h-[300px] bg-white transition-all focus-within:ring-4 focus-within:ring-orange-100">
      <div className="bg-orange-500 p-4 flex justify-between items-center text-white">
        <span className="text-xl font-black italic uppercase">Task {taskLabel(task)}</span>
        {isOk && <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black italic"><CheckCircle2 size={12} className="inline mr-1"/>OK</span>}
      </div>
      <textarea
        style={{ fontSize: `${fontSize}px` }}
        className="flex-1 p-6 outline-none leading-relaxed text-gray-700 resize-none min-h-[180px]"
        value={localValue}
        onFocus={() => { isFocusedRef.current = true; onFocusTask(String(task.id)) }}
        onBlur={() => { isFocusedRef.current = false }}
        onChange={handleChange}
      />
      <div className={`p-2 text-right font-black text-xs border-t ${outOfRange ? 'bg-red-50 text-red-500' : 'bg-orange-50 text-orange-600'}`}>
        {words} SO'Z ({min}-{max})
      </div>
    </div>
  )
})

export default function WritingTestPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const examId = searchParams.get('id')

  const [exam, setExam] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [visibleTaskId, setVisibleTaskId] = useState<string | null>(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  // Mobile Splitter State
  const [qHeight, setQHeight] = useState(40) // Foizda (%)
  const [isDragging, setIsDragging] = useState(false)

  const taskRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const storageKey = useMemo(() => examId ? `writing_responses_${examId}` : null, [examId])

  useEffect(() => {
    async function load() {
      if (!examId) return
      try {
        const res = await getWritingExamByIdAPI(examId)
        setExam(res.data)
        const saved = localStorage.getItem(storageKey!)
        if (saved) setResponses(JSON.parse(saved))
        if (localStorage.getItem(`writing-${examId}-started`) === 'true') setHasStarted(true)
      } catch { toast.error("Xatolik!") } finally { setLoading(false) }
    }
    load()
  }, [examId, storageKey])

  const onDraftChange = useCallback((id: string, val: string) => {
    setResponses(prev => ({ ...prev, [id]: val }))
    if (storageKey) {
        // Debounce o'rniga oddiyroq persistence (UI bloklamaydi)
        writeStorageIdle(storageKey, JSON.stringify({ ...responses, [id]: val }))
    }
  }, [responses, storageKey])

  const tasks = useMemo(() => (exam?.tasks ?? []).sort((a: any, b: any) => a.part_number - b.part_number), [exam])

  // Splitter logic (Touch & Mouse)
  const handleMove = (clientY: number) => {
    if (!isDragging) return
    const h = (clientY / window.innerHeight) * 100
    setQHeight(Math.min(Math.max(h, 20), 80))
  }

  const QuestionPaper = ({ compact }: { compact?: boolean }) => (
    <div className={`space-y-6 ${compact ? 'p-4' : 'p-10'} bg-white`}>
      <h3 className="text-xl font-black uppercase italic text-orange-600 border-b pb-2">Question Paper</h3>
      {tasks.map((task: any) => (
        <div key={task.id} className="p-5 border-2 border-orange-100 rounded-3xl bg-orange-50/20">
          <h4 className="font-black text-orange-500 mb-2 uppercase">Task {taskLabel(task)}</h4>
          <p className="font-bold text-slate-800 text-sm mb-2">{task.topic}</p>
          <p className="italic text-gray-500 text-xs mb-3 whitespace-pre-line">{task.context_text}</p>
          <div className="bg-white p-3 rounded-xl border border-orange-100 text-xs text-slate-700">{task.instruction}</div>
        </div>
      ))}
    </div>
  )

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-orange-500" size={40} /></div>

  if (!hasStarted) return (
    <div className="h-screen flex items-center justify-center bg-orange-50 p-6">
      <div className="bg-white p-12 rounded-[50px] shadow-2xl text-center max-w-lg border-b-[10px] border-orange-500">
        <h1 className="text-3xl font-black mb-6 italic text-slate-800 uppercase">{exam?.title}</h1>
        <button onClick={() => { setHasStarted(true); localStorage.setItem(`writing-${examId}-started`, 'true') }} 
          className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black text-xl hover:bg-orange-600 shadow-lg">TESTNI BOSHLASH</button>
      </div>
    </div>
  )

  return (
    <div 
      className="flex flex-col h-screen bg-[#FDFCFB] overflow-hidden select-none"
      onMouseMove={(e) => handleMove(e.clientY)}
      onMouseUp={() => setIsDragging(false)}
      onTouchMove={(e) => handleMove(e.touches[0].clientY)}
      onTouchEnd={() => setIsDragging(false)}
    >
      <WritingHeader initialSeconds={(exam?.duration_minutes || 60) * 60} onFinish={() => setShowConfirmModal(true)} isSubmitting={isSubmitting} />

      {/* --- DESKTOP LAYOUT --- */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        <section className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-10 pb-20">
            {tasks.map((task: any) => (
              <div key={task.id} ref={el => { taskRefs.current[task.id] = el }}>
                <TaskTextArea task={task} initialValue={responses[task.id] || ''} fontSize={18} onDraftChange={onDraftChange} onFocusTask={setVisibleTaskId} />
              </div>
            ))}
          </div>
        </section>
        <section className="w-[500px] border-l bg-slate-50 overflow-y-auto custom-scrollbar">
          <QuestionPaper />
        </section>
      </div>

      {/* --- MOBILE VERTICAL SPLITTER LAYOUT --- */}
      <div className="lg:hidden flex flex-1 flex-col overflow-hidden relative">
        {/* Savollar Qismi (Tepada) */}
        <div style={{ height: `${qHeight}%` }} className="overflow-y-auto bg-slate-50 border-b-2 border-orange-200">
          <QuestionPaper compact />
        </div>

        {/* Splitter Handle (Suriladigan chiziq) */}
        <div 
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
          className="h-8 bg-orange-500 flex items-center justify-center cursor-ns-resize shadow-md relative z-10"
        >
          <div className="w-16 h-1.5 bg-white/40 rounded-full mb-1"></div>
          <GripHorizontal className="text-white absolute right-4" size={20} />
          <span className="text-[10px] text-white font-black uppercase tracking-widest px-4">Resize</span>
          <div className="w-16 h-1.5 bg-white/40 rounded-full mb-1"></div>
        </div>

        {/* Javoblar Qismi (Pastda) */}
        <div style={{ height: `${100 - qHeight}%` }} className="overflow-y-auto p-4 bg-white custom-scrollbar">
          <div className="space-y-8 pb-10">
            {tasks.map((task: any) => (
              <TaskTextArea key={task.id} task={task} initialValue={responses[task.id] || ''} fontSize={16} onDraftChange={onDraftChange} onFocusTask={setVisibleTaskId} />
            ))}
          </div>
        </div>
      </div>

      {/* MODALLAR */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] p-10 max-w-md w-full text-center">
            <h3 className="text-2xl font-black mb-4 italic uppercase text-orange-600">Imtihonni yakunlaysizmi?</h3>
            <div className="flex gap-4">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold">Yo'q</button>
              <button onClick={doSubmit} className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-black shadow-lg">HA, YUBORISH</button>
            </div>
          </div>
        </div>
      )}

      {isSubmitting && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-xl z-[200] flex flex-col items-center justify-center">
          <div className="w-20 h-20 border-8 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
          <h2 className="mt-6 text-xl font-black italic text-orange-600 uppercase tracking-tight">AI natijalarni hisoblamoqda...</h2>
        </div>
      )}
    </div>
  )

  async function doSubmit() {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const answers = tasks.map((t: any) => ({ task_id: t.id, content: (responses[t.id] || '').trim() }))
      const res = await submitWritingExamAPI(examId!, { answers })
      localStorage.removeItem(storageKey!)
      localStorage.removeItem(`writing-${examId}-started`)
      router.push(`/dashboard/results/writing/view?id=${res.data.id}`)
    } catch {
      toast.error("Xatolik!")
      setIsSubmitting(false)
    }
  }
}