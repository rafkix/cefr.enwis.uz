'use client'

import React, { useEffect, useMemo, useRef, useState, useCallback, memo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, AlertCircle, CheckCircle2, Play } from 'lucide-react'
import { toast } from 'sonner'

import { getWritingExamByIdAPI, submitWritingExamAPI } from '@/lib/api/writing'
import WritingHeader from '@/components/exam/writing-header'

type Task = {
  id: number | string
  part_number: number | string
  sub_part?: number | string | null
  topic?: string
  context_text?: string
  instruction?: string
  format?: { min_words: number | string; max_words: number | string }
}

const wc = (text: string) => text.trim().split(/\s+/).filter(Boolean).length
const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b)

const getLimits = (task: Task) => ({
  min: Number(task?.format?.min_words ?? 0),
  max: Number(task?.format?.max_words ?? 999999),
})

const taskLabel = (task: Task) =>
  Number(task.part_number) === 1 ? `1.${task.sub_part}` : '2'

/**
 * Stable debounce helper (no re-create each render)
 */
function useDebouncedCallback<T extends (...args: any[]) => void>(cb: T, delay: number) {
  const cbRef = useRef(cb)
  useEffect(() => {
    cbRef.current = cb
  }, [cb])

  const timerRef = useRef<number | null>(null)

  return useCallback((...args: Parameters<T>) => {
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => cbRef.current(...args), delay)
  }, [delay])
}

/**
 * Write to localStorage when browser is idle (prevents input lag)
 */
function writeStorageIdle(key: string, value: string) {
  try {
    // @ts-ignore
    if (typeof window.requestIdleCallback === 'function') {
      // @ts-ignore
      window.requestIdleCallback(() => {
        try {
          localStorage.setItem(key, value)
        } catch {}
      })
      return
    }
    setTimeout(() => {
      try {
        localStorage.setItem(key, value)
      } catch {}
    }, 0)
  } catch {}
}

type TaskTextAreaProps = {
  task: Task
  initialValue: string
  fontSize: number
  compact?: boolean
  onFocusTask: (id: string) => void
  onDraftChange: (id: string, val: string) => void
}

const TaskTextArea = memo(function TaskTextArea({
  task,
  initialValue,
  fontSize,
  compact,
  onFocusTask,
  onDraftChange,
}: TaskTextAreaProps) {
  const id = String(task.id)
  const label = taskLabel(task)

  // ✅ local typing state (smooth)
  const [localValue, setLocalValue] = useState(initialValue)

  // ✅ only sync from parent when NOT focused (prevents caret jump)
  const isFocusedRef = useRef(false)
  useEffect(() => {
    if (isFocusedRef.current) return
    setLocalValue(initialValue)
  }, [initialValue])

  const { min, max } = getLimits(task)
  const words = wc(localValue)
  const outOfRange = words > 0 && (words < min || words > max)
  const isOk = localValue.trim().length >= 10 && words >= min && words <= max

  // ✅ push changes up, but NOT on every render
  const pushDraftDebounced = useDebouncedCallback((val: string) => {
    onDraftChange(id, val)
  }, 150) // 100-250ms ideal

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
        className={`flex-1 ${compact ? 'p-5' : 'p-8'} outline-none leading-relaxed text-gray-700 resize-none min-h-[200px]`}
        placeholder={`Task ${label} uchun javob yozing...`}
        value={localValue}
        onFocus={() => {
          isFocusedRef.current = true
          onFocusTask(id)
        }}
        onBlur={() => {
          isFocusedRef.current = false
          // blur paytida aniq sync
          onDraftChange(id, localValue)
        }}
        onChange={(e) => {
          const v = e.target.value
          setLocalValue(v)
          pushDraftDebounced(v)
        }}
        // ✅ stop global key handlers messing with typing
        onKeyDownCapture={(e) => e.stopPropagation()}
      />

      <div
        className={`p-3 text-right font-black ${compact ? 'text-xs' : 'text-sm'} border-t shrink-0 ${
          outOfRange ? 'bg-red-50 text-red-500 border-red-200' : 'bg-gray-50 text-cyan-500 border-gray-200'
        }`}
      >
        {outOfRange ? (
          <span className="flex items-center justify-end gap-2">
            <AlertCircle size={14} />
            {words < min ? `KAMIDA ${min} SO'Z (${words}/${min})` : `KO'PI ${max} SO'Z (${words}/${max})`}
          </span>
        ) : (
          <span>
            {words} TA SO'Z <span className="text-gray-400">({min}-{max})</span>
          </span>
        )}
      </div>
    </div>
  )
})

export default function WritingTestPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const examId = searchParams.get('id')

  const [exam, setExam] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  const [responses, setResponses] = useState<Record<string, string>>({})
  const [fontSizes, setFontSizes] = useState<Record<string, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [visibleTaskId, setVisibleTaskId] = useState<string | null>(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const isExamFinished = useRef(false)
  const taskRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const [mobileView, setMobileView] = useState<'question' | 'answer'>('question')
  const [qWidth] = useState<number>(860)

  const startedKey = useMemo(() => (examId ? `writing-${examId}-started` : null), [examId])
  const storageKey = useMemo(() => (examId ? `writing_responses_${examId}` : null), [examId])

  const tasks: Task[] = useMemo(() => {
    const t = (exam?.tasks ?? []) as Task[]
    return [...t].sort((a, b) => Number(a.part_number) - Number(b.part_number))
  }, [exam])

  // Load exam + restore
  useEffect(() => {
    async function loadExam() {
      if (!examId) return
      try {
        setLoading(true)
        const res = await getWritingExamByIdAPI(examId)
        setExam(res.data)

        const saved = localStorage.getItem(`writing_responses_${examId}`)
        if (saved) {
          try {
            setResponses(JSON.parse(saved))
          } catch {}
        }

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

  // init fontSizes once tasks ready
  useEffect(() => {
    if (!tasks.length) return
    setFontSizes((prev) => {
      const next = { ...prev }
      for (const t of tasks) {
        const id = String(t.id)
        if (typeof next[id] !== 'number') next[id] = 18
      }
      return next
    })
    if (!visibleTaskId) setVisibleTaskId(String(tasks[0].id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks.length])

  const onDraftChange = useCallback((id: string, val: string) => {
    setResponses((prev) => {
      if (prev[id] === val) return prev
      return { ...prev, [id]: val }
    })
  }, [])

  const onFocusTask = useCallback((id: string) => {
    setVisibleTaskId(id)
  }, [])

  // ✅ persist responses: debounce + idle
  const persistDebounced = useDebouncedCallback((payload: Record<string, string>) => {
    if (!storageKey) return
    writeStorageIdle(storageKey, JSON.stringify(payload))
  }, 600)

  useEffect(() => {
    if (!storageKey) return
    if (!responses || Object.keys(responses).length === 0) return
    persistDebounced(responses)
  }, [responses, storageKey, persistDebounced])

  const scrollToTask = useCallback((taskId: string) => {
    setTimeout(() => {
      taskRefs.current[taskId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setVisibleTaskId(taskId)
    }, 40)
  }, [])

  const doSubmit = useCallback(async () => {
    if (!examId || isSubmitting || isExamFinished.current) return
    setIsSubmitting(true)
    isExamFinished.current = true

    try {
      const finalAnswers = tasks.map((t) => ({
        task_id: Number(t.id),
        content: (responses[String(t.id)] || '').trim(),
      }))

      const res = await submitWritingExamAPI(examId, { answers: finalAnswers })

      if (storageKey) localStorage.removeItem(storageKey)
      if (startedKey) localStorage.removeItem(startedKey)

      router.push(`/dashboard/results/writing/view?id=${res.data.id}`)
    } catch {
      toast.error("Xatolik: Topshirishda muammo bo'ldi")
      isExamFinished.current = false
      setIsSubmitting(false)
    }
  }, [examId, isSubmitting, tasks, responses, router, storageKey, startedKey])

  const QuestionPaper = useMemo(() => {
    return function QuestionPaperInner({ compact }: { compact?: boolean }) {
      return (
        <div className={`max-w-4xl mx-auto bg-white rounded-3xl shadow-sm ${compact ? 'p-5' : 'p-10'} space-y-8`}>
          <div className="text-center">
            <h3 className="text-2xl font-black uppercase italic">Question Paper</h3>
            <p className="text-[10px] font-bold text-gray-400 tracking-widest">WRITING SECTION</p>
          </div>

          {tasks.map((task) => (
            <div key={String(task.id)} className="p-6 border-2 border-dashed border-slate-200 rounded-3xl">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-black text-blue-600 uppercase tracking-tighter italic">
                  Task {taskLabel(task)}
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setMobileView('answer')
                    scrollToTask(String(task.id))
                  }}
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, scrollToTask])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
      </div>
    )
  }

  if (!hasStarted) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-12 rounded-[40px] shadow-2xl text-center max-w-lg border-4 border-white">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Play size={40} className="ml-1" />
          </div>
          <h1 className="text-3xl font-black mb-4 italic uppercase">{exam?.title || 'Writing Test'}</h1>
          <p className="text-slate-500 mb-8">Tayyor bo'lsangiz, "Boshlash" tugmasini bosing.</p>
          <button
            type="button"
            onClick={() => {
              if (startedKey) localStorage.setItem(startedKey, 'true')
              setHasStarted(true)
            }}
            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
          >
            Testni boshlash
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-[#F3F4F6] overflow-hidden">
      <WritingHeader
        initialSeconds={(Number(exam?.duration_minutes) || 60) * 60}
        onFinish={() => setShowConfirmModal(true)}
        isSubmitting={isSubmitting}
      />

      {/* Desktop */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        <section className="flex-1 h-full overflow-y-auto p-10 custom-scrollbar">
          <div className="space-y-10 pb-24">
            {tasks.map((task) => {
              const id = String(task.id)
              return (
                <div key={id} ref={(el) => (taskRefs.current[id] = el)}>
                  <TaskTextArea
                    task={task}
                    initialValue={responses[id] || ''}
                    fontSize={fontSizes[id] || 18}
                    onDraftChange={onDraftChange}
                    onFocusTask={onFocusTask}
                  />
                </div>
              )
            })}
          </div>
        </section>

        <section className="h-full overflow-y-auto p-10 bg-gray-100 border-l border-slate-200 custom-scrollbar" style={{ width: qWidth }}>
          <QuestionPaper />
        </section>

        <aside className="w-24 border-l bg-white flex flex-col items-center py-8 gap-4">
          {tasks.map((t) => {
            const id = String(t.id)
            const active = visibleTaskId === id
            return (
              <button
                key={id}
                type="button"
                onClick={() => scrollToTask(id)}
                className={`w-14 h-14 rounded-2xl font-black border-2 transition-all ${
                  active ? 'bg-blue-600 text-white border-blue-200 shadow-lg scale-110' : 'bg-gray-50 border-transparent text-slate-400 hover:border-slate-200'
                }`}
              >
                {taskLabel(t)}
              </button>
            )
          })}
        </aside>
      </div>

      {/* Mobile */}
      <div className="lg:hidden flex-1 flex flex-col p-3 overflow-hidden">
        <div className="flex gap-2 mb-3 bg-white p-2 rounded-2xl shadow-sm">
          <button
            type="button"
            onClick={() => setMobileView('question')}
            className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition ${
              mobileView === 'question' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500'
            }`}
          >
            Savollar
          </button>
          <button
            type="button"
            onClick={() => setMobileView('answer')}
            className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition ${
              mobileView === 'answer' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-500'
            }`}
          >
            Javoblar
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-white rounded-3xl shadow-inner">
          {mobileView === 'question' ? (
            <QuestionPaper compact />
          ) : (
            <div className="p-4 space-y-6">
              {tasks.map((task) => {
                const id = String(task.id)
                return (
                  <div key={id} ref={(el) => (taskRefs.current[id] = el)}>
                    <TaskTextArea
                      task={task}
                      initialValue={responses[id] || ''}
                      fontSize={16}
                      compact
                      onDraftChange={onDraftChange}
                      onFocusTask={onFocusTask}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Submit Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl border-4 border-white">
            <h3 className="text-3xl font-black mb-2 italic uppercase leading-none">Tayyormisiz?</h3>
            <p className="text-slate-500 mb-8 font-medium">Barcha javoblar tekshirish uchun yuboriladi.</p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition"
              >
                Yo'q
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false)
                  doSubmit()
                }}
                className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg hover:bg-blue-700 transition"
              >
                HA, YUBORISH
              </button>
            </div>
          </div>
        </div>
      )}

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