'use client'

import React, { useEffect, useMemo, useRef, useState, useCallback, memo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  ChevronsLeftRight,
  LayoutPanelTop,
  LayoutPanelLeft,
  Maximize2,
  Minimize2,
  Play,
} from 'lucide-react'
import { toast } from 'sonner'

import { getWritingExamByIdAPI, submitWritingExamAPI } from '@/lib/api/writing'
import WritingHeader from '@/components/exam/writing-header'

// --- Turlar ---
type Task = {
  id: number | string
  part_number: number | string
  sub_part?: number | string | null
  topic?: string
  context_text?: string
  instruction?: string
  format?: { min_words: number | string; max_words: number | string }
}

// --- Yordamchi funksiyalar ---
const wc = (text: string) => text.trim().split(/\s+/).filter(Boolean).length
const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b)
const getLimits = (task: Task) => ({
  min: Number(task?.format?.min_words ?? 0),
  max: Number(task?.format?.max_words ?? 999999)
})
const taskLabel = (task: Task) =>
  Number(task.part_number) === 1 ? `1.${task.sub_part}` : '2'

// --- ALOHIDA OPTIMALLASHTIRILGAN INPUT KOMPONENTI ---
const TaskTextArea = memo(({ 
  task, 
  value, 
  fontSize, 
  onChange, 
  onFocus, 
  compact 
}: { 
  task: Task, 
  value: string, 
  fontSize: number, 
  onChange: (id: string, val: string) => void,
  onFocus: () => void,
  compact?: boolean
}) => {
  const [localValue, setLocalValue] = useState(value)
  const id = String(task.id)
  const label = taskLabel(task)
  
  // Tashqaridan (initial load) qiymat kelsa yangilaymiz
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value
    setLocalValue(newVal) // Local state darhol yangilanadi (qotish bo'lmaydi)
    onChange(id, newVal)  // Asosiy state'ga uzatiladi
  }

  const words = wc(localValue)
  const { min, max } = getLimits(task)
  const outOfRange = words > 0 && (words < min || words > max)
  const isOk = localValue.trim().length >= 10 && words >= min && words <= max

  return (
    <div className="rounded-3xl border-2 border-cyan-400 overflow-hidden shadow-lg flex flex-col min-h-[320px] bg-white">
      <div className="bg-cyan-400 p-4 flex justify-between items-center text-white">
        <span className={`${compact ? 'text-lg' : 'text-2xl'} font-black italic uppercase`}>
          Task {label}
        </span>
        {isOk && <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-black italic uppercase tracking-widest"><CheckCircle2 size={14} className="inline mr-1" /> OK</span>}
      </div>

      <textarea
        style={{ fontSize: `${fontSize}px` }}
        onFocus={onFocus}
        className={`flex-1 ${compact ? 'p-5' : 'p-8'} outline-none leading-relaxed text-gray-700 resize-none min-h-[200px]`}
        placeholder={`Task ${label} uchun javob yozing...`}
        value={localValue}
        onChange={handleChange}
      />

      <div className={`p-3 text-right font-black ${compact ? 'text-xs' : 'text-sm'} border-t shrink-0 ${
        outOfRange ? 'bg-red-50 text-red-500 border-red-200' : 'bg-gray-50 text-cyan-500 border-gray-200'
      }`}>
        {outOfRange ? (
          <span className="flex items-center justify-end gap-2">
            <AlertCircle size={14} />
            {words < min ? `KAMIDA ${min} SO'Z (${words}/${min})` : `KO'PI ${max} SO'Z (${words}/${max})`}
          </span>
        ) : (
          <span>{words} TA SO'Z <span className="text-gray-400">({min}-{max})</span></span>
        )}
      </div>
    </div>
  )
})
TaskTextArea.displayName = 'TaskTextArea'

export default function WritingTestPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const examId = searchParams.get('id')

  const [exam, setExam] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [fontSizes, setFontSizes] = useState<Record<string, number>>({})
  const [isTyping, setIsTyping] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [visibleTaskId, setVisibleTaskId] = useState<string | null>(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [forceSubmit, setForceSubmit] = useState(false)
  const isExamFinished = useRef(false)
  
  const layoutRef = useRef<HTMLDivElement>(null)
  const taskRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Layout sozlamalari
  const [mobileView, setMobileView] = useState<'both' | 'question' | 'answer'>('both')
  const [qWidth, setQWidth] = useState<number>(860)
  const [isMiniQ, setIsMiniQ] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [mQHeight, setMQHeight] = useState<number>(320)
  const [mDragging, setMDragging] = useState(false)
  const [mExpand, setMExpand] = useState<'normal' | 'question' | 'answer'>('normal')

  const startedKey = useMemo(() => examId ? `writing-${examId}-started` : null, [examId])
  const storageKey = useMemo(() => examId ? `writing_responses_${examId}` : null, [examId])

  // --- API dan yuklash ---
  useEffect(() => {
    async function loadExam() {
      if (!examId) return
      try {
        const res = await getWritingExamByIdAPI(examId)
        setExam(res.data)
        
        // LocalStorage'dan javoblarni tiklash
        const saved = localStorage.getItem(`writing_responses_${examId}`)
        if (saved) setResponses(JSON.parse(saved))
        
        const started = localStorage.getItem(`writing-${examId}-started`) === 'true'
        setHasStarted(started)
      } catch {
        toast.error("Xatolik yuz berdi")
      } finally {
        setLoading(false)
      }
    }
    loadExam()
  }, [examId])

  // --- Javoblarni saqlash (Debounced) ---
  const handleResponseChange = useCallback((id: string, val: string) => {
    setResponses(prev => ({ ...prev, [id]: val }))
  }, [])

  useEffect(() => {
    if (!storageKey) return
    const timer = setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify(responses))
    }, 1000) // Har bir harfda emas, 1 sekund to'xtaganda saqlaydi
    return () => clearTimeout(timer)
  }, [responses, storageKey])

  const tasks: Task[] = useMemo(() => {
    const t = (exam?.tasks ?? []) as Task[]
    return [...t].sort((a, b) => Number(a.part_number) - Number(b.part_number))
  }, [exam])

  const scrollToTask = (taskId: string) => {
    setTimeout(() => {
      taskRefs.current[taskId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setVisibleTaskId(taskId)
    }, 60)
  }

  // --- Submit funksiyasi ---
  const doSubmit = async (allowForce: boolean) => {
    if (!examId || isSubmitting) return
    setIsSubmitting(true)
    try {
      const finalAnswers = tasks.map(t => ({ task_id: Number(t.id), content: (responses[String(t.id)] || '').trim() }))
      const res = await submitWritingExamAPI(examId, { answers: finalAnswers })
      
      localStorage.removeItem(storageKey!)
      localStorage.removeItem(startedKey!)
      router.push(`/dashboard/results/writing/view?id=${res.data.id}`)
    } catch (e: any) {
      toast.error("Xato yuz berdi")
      setIsSubmitting(false)
    }
  }

  // --- Render bloklari ---
  const QuestionPaper = ({ compact }: { compact?: boolean }) => (
    <div className={`max-w-4xl mx-auto bg-white rounded-3xl shadow-sm ${compact ? 'p-5' : 'p-10'} space-y-8`}>
      <h3 className="text-center text-2xl font-black uppercase">Question Paper</h3>
      {tasks.map(task => (
        <div key={task.id} className="p-5 border-2 border-dashed rounded-2xl">
          <div className="flex justify-between border-b pb-2 mb-2">
             <h4 className="font-black text-blue-600">Task {taskLabel(task)}</h4>
             <button onClick={() => {setMobileView('answer'); scrollToTask(String(task.id))}} className="text-xs font-bold text-cyan-600">ANSWER BOX →</button>
          </div>
          <p className="font-bold mb-2">{task.topic}</p>
          <p className="italic text-gray-600 mb-4 whitespace-pre-line">{task.context_text}</p>
          <p className="text-gray-800">{task.instruction}</p>
        </div>
      ))}
    </div>
  )

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>

  if (!hasStarted) return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
       <div className="bg-white p-12 rounded-[40px] shadow-xl text-center">
          <h1 className="text-3xl font-black mb-6 italic">{exam?.title}</h1>
          <button onClick={() => { localStorage.setItem(startedKey!, 'true'); setHasStarted(true) }} className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-black uppercase">Testni boshlash</button>
       </div>
    </div>
  )

  return (
    <div className="flex flex-col h-screen bg-[#F3F4F6] overflow-hidden">
      <WritingHeader initialSeconds={(Number(exam?.duration_minutes) || 60) * 60} onFinish={() => setShowConfirmModal(true)} isSubmitting={isSubmitting} />

      {/* Desktop View */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        {/* Answer Side */}
        <section className="flex-1 h-full overflow-y-auto p-10 custom-scrollbar">
          <div className="space-y-10 pb-24">
            {tasks.map(task => (
              <div key={task.id} ref={el => { taskRefs.current[String(task.id)] = el }}>
                <TaskTextArea
                  task={task}
                  value={responses[String(task.id)] || ''}
                  fontSize={fontSizes[String(task.id)] || 18}
                  onChange={handleResponseChange}
                  onFocus={() => { setIsTyping(true); setVisibleTaskId(String(task.id)) }}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Question Side */}
        <section className="h-full overflow-y-auto p-10 bg-gray-100 border-l" style={{ width: qWidth }}>
          <QuestionPaper />
        </section>
        
        {/* Sidebar Nav */}
        <aside className="w-24 border-l bg-white flex flex-col items-center py-6 gap-4">
          {tasks.map(t => (
            <button key={t.id} onClick={() => scrollToTask(String(t.id))} className={`w-14 h-14 rounded-2xl font-black border transition ${visibleTaskId === String(t.id) ? 'bg-blue-600 text-white' : 'bg-gray-50'}`}>
              {taskLabel(t)}
            </button>
          ))}
        </aside>
      </div>

      {/* Mobile View */}
      <div className="lg:hidden flex-1 flex flex-col p-3 overflow-hidden">
         <div className="flex gap-2 mb-3">
            <button onClick={() => setMobileView('question')} className={`flex-1 py-3 rounded-xl font-bold ${mobileView === 'question' ? 'bg-blue-600 text-white' : 'bg-white'}`}>Savollar</button>
            <button onClick={() => setMobileView('answer')} className={`flex-1 py-3 rounded-xl font-bold ${mobileView === 'answer' ? 'bg-cyan-600 text-white' : 'bg-white'}`}>Javoblar</button>
         </div>
         <div className="flex-1 overflow-y-auto bg-white rounded-3xl p-4">
            {mobileView === 'question' ? <QuestionPaper compact /> : (
              <div className="space-y-6">
                 {tasks.map(task => (
                    <TaskTextArea
                      key={task.id}
                      task={task}
                      value={responses[String(task.id)] || ''}
                      fontSize={16}
                      onChange={handleResponseChange}
                      onFocus={() => setVisibleTaskId(String(task.id))}
                      compact
                    />
                 ))}
              </div>
            )}
         </div>
      </div>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-lg w-full">
            <h3 className="text-2xl font-black mb-4 italic uppercase">Imtihonni yakunlaysizmi?</h3>
            <div className="flex gap-4">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-4 bg-gray-100 rounded-2xl font-bold">Yo'q</button>
              <button onClick={() => doSubmit(true)} className="flex-1 py-4 bg-cyan-400 text-white rounded-2xl font-black">HA, YAKUNLASH</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}