'use client'

import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlertCircle, CheckCircle2, GripHorizontal, Loader2, Play } from 'lucide-react'
import { toast } from 'sonner'

import { getWritingExamByIdAPI, submitWritingExamAPI } from '@/lib/api/writing'
import WritingHeader from '@/components/exam/writing-header'

// ---------------- helpers ----------------
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
const getLimits = (task: Task) => ({
  min: Number(task?.format?.min_words ?? 0),
  max: Number(task?.format?.max_words ?? 9999),
})
const taskLabel = (task: Task) =>
  Number(task.part_number) === 1 ? `1.${task.sub_part}` : '2'

function debounce<T extends (...args: any[]) => void>(fn: T, wait = 700) {
  let t: any
  return (...args: Parameters<T>) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), wait)
  }
}

// ---------------- textarea (local state) ----------------
const TaskTextArea = memo(function TaskTextArea({
  task,
  value,
  fontSize,
  onFocusTask,
  onChangeDraft,
}: {
  task: Task
  value: string
  fontSize: number
  onFocusTask: (id: string) => void
  onChangeDraft: (id: string, v: string) => void
}) {
  const [localValue, setLocalValue] = useState(value)
  const focused = useRef(false)

  // parent value update (initial load / restore) – do NOT override while typing
  useEffect(() => {
    if (!focused.current) setLocalValue(value)
  }, [value])

  const { min, max } = getLimits(task)
  const words = wc(localValue)
  const outOfRange = words > 0 && (words < min || words > max)
  const ok = localValue.trim().length >= 10 && words >= min && words <= max

  return (
    <div className="rounded-3xl border-2 border-orange-400 overflow-hidden shadow-lg flex flex-col min-h-[300px] bg-white">
      <div className="bg-orange-500 p-4 flex justify-between items-center text-white">
        <span className="text-xl font-black italic uppercase">Task {taskLabel(task)}</span>
        {ok && (
          <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black italic flex items-center gap-1">
            <CheckCircle2 size={12} /> OK
          </span>
        )}
      </div>

      <textarea
        style={{ fontSize }}
        className="flex-1 p-6 outline-none leading-relaxed text-gray-700 resize-none min-h-[180px]"
        value={localValue}
        placeholder={`Task ${taskLabel(task)} uchun javob yozing...`}
        onFocus={() => {
          focused.current = true
          onFocusTask(String(task.id))
        }}
        onBlur={() => {
          focused.current = false
        }}
        onChange={(e) => {
          const v = e.target.value
          setLocalValue(v)
          onChangeDraft(String(task.id), v)
        }}
      />

      <div
        className={`p-2 text-right font-black text-xs border-t ${
          outOfRange ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-700 border-orange-100'
        }`}
      >
        {words} so&apos;z ({min}-{max})
      </div>
    </div>
  )
})

// ---------------- page ----------------
export default function WritingTestPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const examId = searchParams.get('id')

  const [exam, setExam] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [hasStarted, setHasStarted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const [visibleTaskId, setVisibleTaskId] = useState<string | null>(null)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const responsesRef = useRef<Record<string, string>>({}) // ✅ stale-state fix

  const taskRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // mobile splitter
  const [qHeight, setQHeight] = useState(40) // %
  const draggingRef = useRef(false)

  const storageKey = useMemo(() => (examId ? `writing_responses_${examId}` : null), [examId])
  const startedKey = useMemo(() => (examId ? `writing-${examId}-started` : null), [examId])

  const tasks: Task[] = useMemo(() => {
    const t = (exam?.tasks ?? []) as Task[]
    return [...t].sort((a, b) => Number(a.part_number) - Number(b.part_number))
  }, [exam])

  // -------- load exam + restore --------
  useEffect(() => {
    if (!examId) return
    ;(async () => {
      try {
        setLoading(true)
        const res = await getWritingExamByIdAPI(examId)
        setExam(res.data)

        const started = localStorage.getItem(`writing-${examId}-started`) === 'true'
        setHasStarted(started)

        const saved = localStorage.getItem(`writing_responses_${examId}`)
        if (saved) {
          const parsed = JSON.parse(saved)
          setResponses(parsed)
          responsesRef.current = parsed
        }
      } catch {
        toast.error('Xatolik! (exam yuklanmadi)')
      } finally {
        setLoading(false)
      }
    })()
  }, [examId])

  // -------- persist (debounced) --------
  const persistDebounced = useMemo(() => {
    return debounce((key: string, data: Record<string, string>) => {
      try {
        localStorage.setItem(key, JSON.stringify(data))
      } catch {}
    }, 800)
  }, [])

  const onChangeDraft = useCallback(
    (id: string, v: string) => {
      // ✅ no stale state
      responsesRef.current = { ...responsesRef.current, [id]: v }
      setResponses(responsesRef.current)

      if (storageKey) persistDebounced(storageKey, responsesRef.current)
    },
    [storageKey, persistDebounced]
  )

  const scrollToTask = useCallback((id: string) => {
    setVisibleTaskId(id)
    requestAnimationFrame(() => {
      taskRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  // -------- mobile splitter move --------
  const handleMove = useCallback((clientY: number) => {
    if (!draggingRef.current) return
    const h = (clientY / window.innerHeight) * 100
    setQHeight(Math.min(Math.max(h, 20), 80))
  }, [])

  // attach global move listeners only when dragging
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientY)
    const onMouseUp = () => (draggingRef.current = false)
    const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientY)
    const onTouchEnd = () => (draggingRef.current = false)

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [handleMove])

  // -------- guards --------
  if (!examId) {
    return (
      <div className="h-screen flex items-center justify-center bg-orange-50">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-orange-600 mx-auto mb-3" />
          <p className="font-black text-slate-700">ID topilmadi</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-orange-500" size={42} />
      </div>
    )
  }

  if (!hasStarted) {
    return (
      <div className="h-screen flex items-center justify-center bg-orange-50 p-6">
        <div className="bg-white p-12 rounded-[50px] shadow-2xl text-center max-w-lg border-b-[10px] border-orange-500">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Play />
          </div>
          <h1 className="text-3xl font-black mb-6 italic text-slate-800 uppercase">
            {exam?.title || 'Writing Test'}
          </h1>

          <button
            onClick={() => {
              setHasStarted(true)
              localStorage.setItem(`writing-${examId}-started`, 'true')
            }}
            className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black text-xl hover:bg-orange-600 shadow-lg"
            type="button"
          >
            TESTNI BOSHLASH
          </button>
        </div>
      </div>
    )
  }

  // -------- UI blocks --------
  const QuestionPaper = ({ compact }: { compact?: boolean }) => (
    <div className={`space-y-6 ${compact ? 'p-4' : 'p-8'} bg-white`}>
      <h3 className="text-xl font-black uppercase italic text-orange-700 border-b pb-2">
        Question Paper
      </h3>

      {tasks.map((task) => (
        <button
          key={String(task.id)}
          type="button"
          onClick={() => scrollToTask(String(task.id))}
          className="w-full text-left p-5 border-2 border-orange-100 rounded-3xl bg-orange-50/30 hover:bg-orange-50 transition"
        >
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-black text-orange-600 uppercase">Task {taskLabel(task)}</h4>
            <span className="text-[10px] font-black uppercase text-orange-700 bg-white px-3 py-2 rounded-xl border border-orange-100">
              Go to answer
            </span>
          </div>

          <p className="font-bold text-slate-800 text-sm mt-3 mb-2">{task.topic}</p>
          <p className="italic text-gray-500 text-xs mb-3 whitespace-pre-line">{task.context_text}</p>
          <div className="bg-white p-3 rounded-xl border border-orange-100 text-xs text-slate-700">
            {task.instruction}
          </div>
        </button>
      ))}
    </div>
  )

  async function doSubmit() {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const answers = tasks.map((t) => ({
        task_id: Number(t.id),
        content: (responsesRef.current[String(t.id)] || '').trim(),
      }))

      const res = await submitWritingExamAPI(examId!, { answers })

      if (storageKey) localStorage.removeItem(storageKey)
      if (startedKey) localStorage.removeItem(startedKey)

      router.push(`/dashboard/results/writing/view?id=${res.data.id}`)
    } catch {
      toast.error('Xatolik! (submit bo‘lmadi)')
      setIsSubmitting(false)
    }
  }

  // -------- Navigation buttons (Task list) --------
  const NavButtons = ({ mobile }: { mobile?: boolean }) => (
    <div className={mobile ? 'flex gap-2 overflow-x-auto p-3 bg-white border-b border-orange-100' : 'flex flex-col gap-3 pr-2'}>
      {tasks.map((t) => {
        const id = String(t.id)
        const active = visibleTaskId === id
        const text = (responsesRef.current[id] || '').trim()
        const { min, max } = getLimits(t)
        const words = wc(text)
        const ok = text.length >= 10 && words >= min && words <= max

        const cls = mobile
          ? `shrink-0 w-16 h-14 rounded-2xl font-black border transition ${
              active ? 'bg-orange-600 text-white border-orange-200' : 'bg-orange-50 text-orange-700 border-orange-100'
            }`
          : `w-14 h-14 rounded-2xl font-black border transition ${
              active ? 'bg-orange-600 text-white border-orange-200' : 'bg-white text-orange-700 border-orange-100'
            }`

        return (
          <button key={id} type="button" onClick={() => scrollToTask(id)} className={cls} title={`Task ${taskLabel(t)}`}>
            <div className="flex flex-col items-center justify-center leading-none">
              <span className="text-sm">{taskLabel(t)}</span>
              <span className={`text-[9px] mt-1 ${ok ? 'opacity-95' : 'opacity-60'}`}>{ok ? 'OK' : '...'}</span>
            </div>
          </button>
        )
      })}
    </div>
  )

  return (
    <div className="flex flex-col h-screen bg-[#FDFCFB] overflow-hidden">
      <WritingHeader
        initialSeconds={(Number(exam?.duration_minutes) || 60) * 60}
        onFinish={() => setShowConfirmModal(true)}
        isSubmitting={isSubmitting}
      />

      {/* submit overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-xl z-[200] flex flex-col items-center justify-center">
          <div className="w-20 h-20 border-8 border-orange-100 border-t-orange-500 rounded-full animate-spin" />
          <h2 className="mt-6 text-xl font-black italic text-orange-700 uppercase">
            AI natijalarni hisoblamoqda...
          </h2>
        </div>
      )}

      {/* confirm modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] p-10 max-w-md w-full text-center">
            <h3 className="text-2xl font-black mb-4 italic uppercase text-orange-700">
              Imtihonni yakunlaysizmi?
            </h3>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold"
                type="button"
              >
                Yo&apos;q
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false)
                  doSubmit()
                }}
                className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-black shadow-lg hover:bg-orange-600"
                type="button"
              >
                HA, YUBORISH
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------- Desktop -------- */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        <section className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-10 pb-20">
            {tasks.map((task) => {
              const id = String(task.id)
              return (
                <div
                  key={id}
                  ref={(el) => {
                    taskRefs.current[id] = el
                  }}
                >
                  <TaskTextArea
                    task={task}
                    value={responses[id] || ''}
                    fontSize={18}
                    onChangeDraft={onChangeDraft}
                    onFocusTask={(tid) => setVisibleTaskId(tid)}
                  />
                </div>
              )
            })}
          </div>
        </section>

        <section className="w-[520px] border-l bg-slate-50 overflow-y-auto custom-scrollbar">
          <QuestionPaper />
        </section>

        <aside className="w-24 border-l bg-white flex items-center justify-center">
          <NavButtons />
        </aside>
      </div>

      {/* -------- Mobile: nav + vertical splitter -------- */}
      <div className="lg:hidden flex flex-1 flex-col overflow-hidden">
        <NavButtons mobile />

        {/* question */}
        <div style={{ height: `${qHeight}%` }} className="overflow-y-auto bg-slate-50 border-b-2 border-orange-200">
          <QuestionPaper compact />
        </div>

        {/* splitter */}
        <div
          className="h-10 bg-orange-500 flex items-center justify-center cursor-ns-resize shadow-md select-none"
          onMouseDown={() => (draggingRef.current = true)}
          onTouchStart={() => (draggingRef.current = true)}
        >
          <div className="w-16 h-1.5 bg-white/40 rounded-full" />
          <GripHorizontal className="text-white mx-4" size={18} />
          <div className="w-16 h-1.5 bg-white/40 rounded-full" />
        </div>

        {/* answers */}
        <div style={{ height: `${100 - qHeight}%` }} className="overflow-y-auto p-4 bg-white custom-scrollbar">
          <div className="space-y-8 pb-10">
            {tasks.map((task) => {
              const id = String(task.id)
              return (
                <TaskTextArea
                  key={id}
                  task={task}
                  value={responses[id] || ''}
                  fontSize={16}
                  onChangeDraft={onChangeDraft}
                  onFocusTask={(tid) => setVisibleTaskId(tid)}
                />
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}