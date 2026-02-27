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

// --- OPTIMALLASHTIRILGAN TEXTAREA KOMPONENTI ---
// Memo ishlatish orqali faqat matni o'zgargan textarea qayta render bo'ladi
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
  
  // Initial load uchun
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value
    setLocalValue(newVal) // Local state darhol o'zgaradi (qotish yo'qoladi)
    onChange(id, newVal)  // Asosiy responses state-ga uzatiladi
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
        {isOk && (
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-black italic uppercase tracking-widest flex items-center gap-1">
            <CheckCircle2 size={14} /> OK
          </span>
        )}
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
  const isExamFinished = useRef(false)
  
  const taskRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Layout states
  const [mobileView, setMobileView] = useState<'both' | 'question' | 'answer'>('both')
  const [qWidth, setQWidth] = useState<number>(860)

  const startedKey = useMemo(() => examId ? `writing-${examId}-started` : null, [examId])
  const storageKey = useMemo(() => examId ? `writing_responses_${examId}` : null, [examId])

  // --- API dan yuklash ---
  useEffect(() => {
    async function loadExam() {
      if (!examId) return
      try {
        const res = await getWritingExamByIdAPI(examId)
        setExam(res.data)
        
        const saved = localStorage.getItem(`writing_responses_${examId}`)
        if (saved) setResponses(JSON.parse(saved))
        
        const started = localStorage.getItem(`writing-${examId}-started`) === 'true'
        setHasStarted(started)
      } catch {
        toast.error("Ma'lumotlarni yuklashda xatolik!")
      } finally {
        setLoading(false)
      }
    }
    loadExam()
  }, [examId])

  // --- Javoblarni saqlash (Optimallashtirilgan Debounce) ---
  const handleResponseChange = useCallback((id: string, val: string) => {
    setResponses(prev => ({ ...prev, [id]: val }))
  }, [])

  useEffect(() => {
    if (!storageKey) return
    // Har bir harf yozilganda emas, user yozishdan to'xtaganda 1 marta saqlaydi
    const timer = setTimeout(() => {
      localStorage.setItem(storageKey, JSON.stringify(responses))
    }, 1000) 
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

  // --- Submit ---
  const doSubmit = async () => {
    if (!examId || isSubmitting) return
    setIsSubmitting(true)
    try {
      const finalAnswers = tasks.map(t => ({ 
        task_id: Number(t.id), 
        content: (responses[String(t.id)] || '').trim() 
      }))
      const res = await submitWritingExamAPI(examId, { answers: finalAnswers })
      
      localStorage.removeItem(storageKey!)
      localStorage.removeItem(startedKey!)
      router.push(`/dashboard/results/writing/view?id=${res.data.id}`)
    } catch (e: any) {
      toast.error("Xatolik: Topshirishda muammo bo'ldi")
      setIsSubmitting(false)
    }
  }

  // --- UI Blocks ---
  const QuestionPaper = ({ compact }: { compact?: boolean }) => (
    <div className={`max-w-4xl mx-auto bg-white rounded-3xl shadow-sm ${compact ? 'p-5' : 'p-10'} space-y-8`}>
      <div className="text-center">
        <h3 className="text-2xl font-black uppercase italic">Question Paper</h3>
        <p className="text-[10px] font-bold text-gray-400 tracking-widest">WRITING SECTION</p>
      </div>
      {tasks.map(task => (
        <div key={task.id} className="p-6 border-2 border-dashed border-slate-200 rounded-3xl relative group">
          <div className="flex justify-between items-center mb-4">
             <h4 className="font-black text-blue-600 uppercase tracking-tighter italic">Task {taskLabel(task)}</h4>
             <button 
               onClick={() => {setMobileView('answer'); scrollToTask(String(task.id))}} 
               className="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-600 hover:text-white transition"
             >
               GO TO ANSWER →
             </button>
          </div>
          <p className="font-bold text-lg text-slate-800 mb-2">{task.topic}</p>
          <p className="italic text-gray-600 mb-4 whitespace-pre-line leading-relaxed">{task.context_text}</p>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-slate-700 font-medium">{task.instruction}</p>
          </div>
        </div>
      ))}
    </div>
  )

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
    </div>
  )

  if (!hasStarted) return (
    <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
       <div className="bg-white p-12 rounded-[40px] shadow-2xl text-center max-w-lg border-4 border-white">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Play size={40} className="ml-1" />
          </div>
          <h1 className="text-3xl font-black mb-4 italic uppercase">{exam?.title || 'Writing Test'}</h1>
          <p className="text-slate-500 mb-8">Tayyor bo'lsangiz, "Boshlash" tugmasini bosing.</p>
          <button 
            onClick={() => { localStorage.setItem(startedKey!, 'true'); setHasStarted(true) }} 
            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
          >
            Testni boshlash
          </button>
       </div>
    </div>
  )

  return (
    <div className="flex flex-col h-screen bg-[#F3F4F6] overflow-hidden">
      <WritingHeader 
        initialSeconds={(Number(exam?.duration_minutes) || 60) * 60} 
        onFinish={() => setShowConfirmModal(true)} 
        isSubmitting={isSubmitting} 
      />

      {/* Desktop Layout */}
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

        {/* Question Side (Splitter o'rniga oddiy border-l va kenglik) */}
        <section className="h-full overflow-y-auto p-10 bg-gray-100 border-l border-slate-200 custom-scrollbar" style={{ width: qWidth }}>
          <QuestionPaper />
        </section>
        
        {/* Nav Sidebar */}
        <aside className={`w-24 border-l bg-white flex flex-col items-center py-8 gap-4 transition-opacity duration-300 ${isTyping ? 'opacity-20' : 'opacity-100'}`}>
          {tasks.map(t => {
            const isActive = visibleTaskId === String(t.id)
            return (
              <button 
                key={t.id} 
                onClick={() => scrollToTask(String(t.id))} 
                className={`w-14 h-14 rounded-2xl font-black border-2 transition-all ${isActive ? 'bg-blue-600 text-white border-blue-200 shadow-lg scale-110' : 'bg-gray-50 border-transparent text-slate-400 hover:border-slate-200'}`}
              >
                {taskLabel(t)}
              </button>
            )
          })}
        </aside>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex-1 flex flex-col p-3 overflow-hidden">
         <div className="flex gap-2 mb-3 bg-white p-2 rounded-2xl shadow-sm">
            <button 
              onClick={() => setMobileView('question')} 
              className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition ${mobileView === 'question' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500'}`}
            >
              Savollar
            </button>
            <button 
              onClick={() => setMobileView('answer')} 
              className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition ${mobileView === 'answer' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-500'}`}
            >
              Javoblar
            </button>
         </div>
         <div className="flex-1 overflow-y-auto bg-white rounded-3xl shadow-inner">
            {mobileView === 'question' ? <QuestionPaper compact /> : (
              <div className="p-4 space-y-6">
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

      {/* Submit Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl border-4 border-white animate-in zoom-in duration-200">
            <h3 className="text-3xl font-black mb-2 italic uppercase leading-none">Tayyormisiz?</h3>
            <p className="text-slate-500 mb-8 font-medium">Barcha javoblar tekshirish uchun yuboriladi.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowConfirmModal(false)} 
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition"
              >
                Yo'q
              </button>
              <button 
                onClick={() => { setShowConfirmModal(false); doSubmit(); }} 
                className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg hover:bg-blue-700 transition"
              >
                HA, YUBORISH
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Loading for AI submission */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-xl z-[200] flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-24 h-24 border-8 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
            <CheckCircle2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600" size={32} />
          </div>
          <h2 className="mt-8 text-2xl font-black italic uppercase">AI tekshirmoqda...</h2>
          <p className="text-slate-400 mt-2 animate-pulse">Iltimos, kutib turing</p>
        </div>
      )}
    </div>
  )
}