'use client'

import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, AlertCircle, CheckCircle2, Play, GripHorizontal } from 'lucide-react'
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

type WritingExam = {
  id: string
  title: string
  duration_minutes?: number
  tasks: Task[]
}

const wc = (text: string) => text.trim().split(/\s+/).filter(Boolean).length
const clamp = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b)

const getLimits = (task: Task) => ({
  min: Number(task?.format?.min_words ?? 0),
  max: Number(task?.format?.max_words ?? 9999),
})

const taskLabel = (task: Task) => (Number(task.part_number) === 1 ? `1.${task.sub_part}` : '2')

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

/**
 * TEXTAREA: local state -> typing smooth
 * parent: receives drafts (throttled/idle persisted)
 */
const TaskTextArea = memo(function TaskTextArea({
  task,
  initialValue,
  fontSize,
  compact,
  onFocusTask,
  onDraftChange,
}: {
  task: Task
  initialValue: string
  fontSize: number
  compact?: boolean
  onFocusTask: (id: string) => void
  onDraftChange: (id: string, val: string) => void
}) {
  const [localValue, setLocalValue] = useState(initialValue)
  const focusedRef = useRef(false)

  // parent updates only when not focused (avoid cursor jump)
  useEffect(() => {
    if (!focusedRef.current) setLocalValue(initialValue)
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
        <span className={`${compact ? 'text-lg' : 'text-xl'} font-black italic uppercase`}>
          Task {taskLabel(task)}
        </span>
        {isOk ? (
          <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-black italic flex items-center gap-1">
            <CheckCircle2 size={12} /> OK
          </span>
        ) : null}
      </div>

      <textarea
        style={{ fontSize: `${fontSize}px` }}
        className={`flex-1 ${compact ? 'p-5' : 'p-6'} outline-none leading-relaxed text-gray-700 resize-none min-h-[180px]`}
        value={localValue}
        placeholder={`Task ${taskLabel(task)} uchun javob yozing...`}
        onFocus={() => {
          focusedRef.current = true
          onFocusTask(String(task.id))
        }}
        onBlur={() => {
          focusedRef.current = false
        }}
        onChange={handleChange}
      />

      <div
        className={`p-2 text-right font-black text-xs border-t ${
          outOfRange ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-700 border-orange-100'
        }`}
      >
        {outOfRange ? (
          <span>
            {words} so‘z — {words < min ? `kam (min ${min})` : `ko‘p (max ${max})`}
          </span>
        ) : (
          <span>
            {words} so‘z <span className="text-gray-400">({min}-{max})</span>
          </span>
        )}
      </div>
    </div>
  )
})

export default function WritingTestPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const examId = searchParams.get('id')

  const [loading, setLoading] = useState(true)
  const [exam, setExam] = useState<WritingExam | null>(null)

  // drafts cache (parent)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [fontSizes, setFontSizes] = useState<Record<string, number>>({})

  const [hasStarted, setHasStarted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const [visibleTaskId, setVisibleTaskId] = useState<string | null>(null)

  // ===== MOBILE vertical splitter =====
  const [qHeightPct, setQHeightPct] = useState(42) // %
  const [isDraggingY, setIsDraggingY] = useState(false)

  // ===== DESKTOP horizontal splitter =====
  const layoutRef = useRef<HTMLDivElement>(null)
  const draggingXRef = useRef(false)

  const NORMAL_Q_W = 520
  const MIN_Q_W = 260
  const MAX_Q_W = 980
  const [qWidth, setQWidth] = useState(NORMAL_Q_W)

  // ===== Refs =====
  const taskRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const startedKey = useMemo(() => (examId ? `writing-${examId}-started` : null), [examId])
  const storageKey = useMemo(() => (examId ? `writing_responses_${examId}` : null), [examId])

  // ========= LOAD EXAM + RESTORE DRAFTS =========
  useEffect(() => {
    let mounted = true

    async function load() {
      if (!examId) {
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        const res = await getWritingExamByIdAPI(examId)
        if (!mounted) return

        const ex: WritingExam = res.data
        setExam(ex)

        // started
        const started = localStorage.getItem(`writing-${examId}-started`) === 'true'
        setHasStarted(started)

        // restore drafts
        const saved = storageKey ? localStorage.getItem(storageKey) : null
        if (saved) {
          try {
            const parsed = JSON.parse(saved) as Record<string, string>
            setResponses(parsed ?? {})
          } catch {
            setResponses({})
          }
        } else {
          setResponses({})
        }

        // init fonts default
        const fs: Record<string, number> = {}
        for (const t of ex.tasks ?? []) fs[String(t.id)] = 18
        setFontSizes(fs)

        if (ex.tasks?.[0]) setVisibleTaskId(String(ex.tasks[0].id))
      } catch {
        toast.error("Ma'lumotlarni yuklashda xatolik!")
      } finally {
        if (mounted) setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [examId, storageKey])

  // ========= TASKS SORT =========
  const tasks = useMemo(() => {
    const arr = (exam?.tasks ?? []) as Task[]
    return [...arr].sort((a, b) => {
      const ap = Number(a.part_number)
      const bp = Number(b.part_number)
      if (ap !== bp) return ap - bp
      const as = a.sub_part == null ? 999 : Number(a.sub_part)
      const bs = b.sub_part == null ? 999 : Number(b.sub_part)
      return as - bs
    })
  }, [exam])

  const part1 = useMemo(() => tasks.filter((t) => Number(t.part_number) === 1), [tasks])
  const part2 = useMemo(() => tasks.filter((t) => Number(t.part_number) === 2), [tasks])
  const part1Common = part1[0] // topic/context_text bitta bo‘lib chiqadi

  // ========= SCROLL HELPERS =========
  const scrollToTask = useCallback((taskId: string) => {
    setTimeout(() => {
      taskRefs.current[taskId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setVisibleTaskId(taskId)
    }, 60)
  }, [])

  // ========= DRAFT CHANGE (smooth typing) =========
  const lastSaveTimerRef = useRef<number | null>(null)

  const onDraftChange = useCallback(
    (id: string, val: string) => {
      // update parent cache (lightweight)
      setResponses((prev) => {
        if (prev[id] === val) return prev
        return { ...prev, [id]: val }
      })

      if (!storageKey) return

      // debounce + idle storage write
      if (lastSaveTimerRef.current) window.clearTimeout(lastSaveTimerRef.current)
      lastSaveTimerRef.current = window.setTimeout(() => {
        // IMPORTANT: use latest value snapshot
        // We compute by reading from state via functional update? easiest: store using closure by merging
        // Here we build minimal object with current cached + this change.
        // NOTE: It's ok because we write often enough; UI will not block.
        writeStorageIdle(storageKey, JSON.stringify({ ...responses, [id]: val }))
      }, 600)
    },
    [responses, storageKey]
  )

  // ========= NAV BUTTONS =========
  const NavButtons = useMemo(() => {
    return function Nav() {
      return (
        <div className="flex flex-col gap-3 pr-2">
          {tasks.map((t) => {
            const id = String(t.id)
            const active = visibleTaskId === id

            const content = (responses[id] ?? '').trim()
            const { min, max } = getLimits(t)
            const words = wc(content)
            const ok = content.length >= 10 && words >= min && words <= max

            return (
              <button
                key={id}
                type="button"
                onClick={() => scrollToTask(id)}
                className={`w-14 h-14 rounded-2xl font-black transition-all border ${
                  active
                    ? 'bg-orange-600 text-white border-orange-200 shadow-lg scale-[1.03]'
                    : 'bg-white text-orange-600 border-slate-200 hover:border-orange-200'
                } active:scale-95`}
                title={`Task ${taskLabel(t)}`}
              >
                <div className="flex flex-col items-center justify-center leading-none">
                  <span className="text-sm">{taskLabel(t)}</span>
                  <span className={`text-[9px] mt-1 ${ok ? 'opacity-90' : 'opacity-50'}`}>
                    {ok ? 'OK' : '...'}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      )
    }
  }, [tasks, visibleTaskId, responses, scrollToTask])

  // ========= MOBILE SPLITTER MOVE =========
  const handleMoveY = useCallback(
    (clientY: number) => {
      if (!isDraggingY) return
      const pct = (clientY / window.innerHeight) * 100
      setQHeightPct(clamp(pct, 20, 80))
    },
    [isDraggingY]
  )

  // ========= DESKTOP SPLITTER MOVE =========
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!draggingXRef.current || !layoutRef.current) return

      const rect = layoutRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left

      // Layout: [Answers flex-1] [Splitter 16px] [Questions qWidth] [Nav 96px]
      const NAV_W = 96
      const SPLITTER_W = 16
      const totalW = rect.width

      const rightSpace = totalW - x
      const desiredQ = rightSpace - NAV_W - SPLITTER_W
      const next = clamp(desiredQ, MIN_Q_W, MAX_Q_W)
      setQWidth(next)
    }

    const onUp = () => {
      draggingXRef.current = false
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [])

  // ========= START EXAM =========
  const startExam = useCallback(() => {
    if (!examId) return
    localStorage.setItem(`writing-${examId}-started`, 'true')
    setHasStarted(true)
  }, [examId])

  // ========= SUBMIT =========
  const doSubmit = useCallback(async () => {
    if (!examId || isSubmitting) return
    setIsSubmitting(true)
    try {
      const answers = tasks.map((t) => ({
        task_id: Number(t.id),
        content: (responses[String(t.id)] ?? '').trim(),
      }))

      const res = await submitWritingExamAPI(examId, { answers })

      if (storageKey) localStorage.removeItem(storageKey)
      if (startedKey) localStorage.removeItem(startedKey)

      router.push(`/dashboard/results/writing/view?id=${res.data.id}`)
    } catch {
      toast.error("Xatolik! Topshirishda muammo bo'ldi.")
      setIsSubmitting(false)
    }
  }, [examId, isSubmitting, tasks, responses, router, storageKey, startedKey])

  // ========= QUESTION PAPER (Part1 common prompt) =========
  const QuestionPaper = useCallback(
    ({ compact }: { compact?: boolean }) => (
      <div className={`space-y-6 ${compact ? 'p-4' : 'p-8'} bg-white`}>
        <h3 className="text-xl font-black uppercase italic text-orange-700 border-b pb-2">
          Question Paper
        </h3>

        {/* PART 1 */}
        {part1.length > 0 && (
          <div className="p-5 border-2 border-orange-100 rounded-3xl bg-orange-50/30">
            <div className="flex items-center justify-between gap-3">
              <h4 className="font-black text-orange-700 uppercase">Part 1</h4>
              <button
                type="button"
                onClick={() => scrollToTask(String(part1[0].id))}
                className="text-[10px] font-black uppercase text-orange-700 bg-white px-3 py-2 rounded-xl border border-orange-100 hover:bg-orange-50 transition"
              >
                Go to answers
              </button>
            </div>

            <p className="font-bold text-slate-800 text-sm mt-3 mb-2">{part1Common?.topic}</p>
            <p className="italic text-gray-500 text-xs mb-3 whitespace-pre-line">
              {part1Common?.context_text}
            </p>

            <div className="space-y-3">
              {part1.map((t) => {
                const { min, max } = getLimits(t)
                return (
                  <button
                    key={String(t.id)}
                    type="button"
                    onClick={() => scrollToTask(String(t.id))}
                    className="w-full text-left bg-white p-4 rounded-2xl border border-orange-100 hover:bg-orange-50 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-orange-600">Task 1.{t.sub_part}</span>
                      <span className="text-[10px] font-black text-orange-700">
                        {min}-{max} words
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mt-2">{t.instruction}</p>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* PART 2 */}
        {part2.map((t) => {
          const { min, max } = getLimits(t)
          return (
            <div key={String(t.id)} className="p-5 border-2 border-orange-100 rounded-3xl bg-orange-50/30">
              <div className="flex items-center justify-between gap-3">
                <h4 className="font-black text-orange-700 uppercase">Part 2</h4>
                <button
                  type="button"
                  onClick={() => scrollToTask(String(t.id))}
                  className="text-[10px] font-black uppercase text-orange-700 bg-white px-3 py-2 rounded-xl border border-orange-100 hover:bg-orange-50 transition"
                >
                  Go to answer
                </button>
              </div>

              <p className="font-bold text-slate-800 text-sm mt-3 mb-2">{t.topic}</p>
              <p className="italic text-gray-500 text-xs mb-3 whitespace-pre-line">{t.context_text}</p>
              <div className="bg-white p-3 rounded-xl border border-orange-100 text-xs text-slate-700">
                {t.instruction}
              </div>

              <div className="mt-3 text-[10px] font-black text-orange-700">
                Limit: {min}-{max} words
              </div>
            </div>
          )
        })}
      </div>
    ),
    [part1, part1Common, part2, scrollToTask]
  )

  // ========= RENDER GUARDS =========
  if (!examId) {
    return (
      <div className="h-screen flex items-center justify-center bg-orange-50 p-6">
        <div className="text-center bg-white p-10 rounded-3xl border border-orange-100 shadow-sm">
          <AlertCircle className="w-10 h-10 text-orange-600 mx-auto mb-3" />
          <p className="font-black text-slate-700">ID topilmadi</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    )
  }

  if (!hasStarted) {
    return (
      <div className="h-screen flex items-center justify-center bg-orange-50 p-6">
        <div className="bg-white p-12 rounded-[50px] shadow-2xl text-center max-w-lg border-b-[10px] border-orange-500">
          <div className="w-20 h-20 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <Play size={40} className="ml-1" />
          </div>
          <h1 className="text-3xl font-black mb-3 italic text-slate-800 uppercase">
            {exam?.title ?? 'Writing Test'}
          </h1>
          <p className="text-slate-500 mb-8">Tayyor bo‘lsangiz, boshlash tugmasini bosing.</p>

          <button
            onClick={startExam}
            className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black text-xl hover:bg-orange-600 shadow-lg active:scale-95 transition-all"
            type="button"
          >
            TESTNI BOSHLASH
          </button>
        </div>
      </div>
    )
  }

  // ========= MAIN =========
  return (
    <div
      className="flex flex-col h-screen bg-[#FDFCFB] overflow-hidden"
      onMouseMove={(e) => handleMoveY(e.clientY)}
      onMouseUp={() => setIsDraggingY(false)}
      onTouchMove={(e) => handleMoveY(e.touches[0].clientY)}
      onTouchEnd={() => setIsDraggingY(false)}
    >
      <WritingHeader
        initialSeconds={(Number(exam?.duration_minutes ?? 60) || 60) * 60}
        onFinish={() => setShowConfirmModal(true)}
        isSubmitting={isSubmitting}
      />

      {/* ===== DESKTOP ===== */}
      <div ref={layoutRef} className="hidden lg:flex flex-1 overflow-hidden">
        {/* ANSWERS */}
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
                    initialValue={responses[id] ?? ''}
                    fontSize={fontSizes[id] ?? 18}
                    onDraftChange={onDraftChange}
                    onFocusTask={(tid) => setVisibleTaskId(tid)}
                  />
                </div>
              )
            })}
          </div>
        </section>

        {/* SPLITTER (desktop) */}
        <div
          className="w-4 bg-orange-100 border-l border-r border-orange-200 cursor-col-resize select-none flex items-center justify-center"
          onMouseDown={() => (draggingXRef.current = true)}
          title="Resize"
        >
          <div className="h-16 w-1.5 rounded-full bg-orange-400/60" />
        </div>

        {/* QUESTIONS */}
        <section
          className="overflow-y-auto bg-slate-50 custom-scrollbar border-r"
          style={{ width: qWidth }}
        >
          <QuestionPaper />
        </section>

        {/* NAV */}
        <aside className="w-24 border-l bg-white flex items-center justify-center">
          <NavButtons />
        </aside>
      </div>

      {/* ===== MOBILE (vertical splitter) ===== */}
      <div className="lg:hidden flex flex-1 flex-col overflow-hidden relative">
        {/* QUESTIONS TOP */}
        <div style={{ height: `${qHeightPct}%` }} className="overflow-y-auto bg-slate-50 border-b-2 border-orange-200">
          <QuestionPaper compact />
        </div>

        {/* SPLITTER HANDLE */}
        <div
          onMouseDown={() => setIsDraggingY(true)}
          onTouchStart={() => setIsDraggingY(true)}
          className="h-8 bg-orange-500 flex items-center justify-center cursor-ns-resize shadow-md relative z-10 select-none"
        >
          <div className="w-16 h-1.5 bg-white/40 rounded-full" />
          <GripHorizontal className="text-white absolute right-4" size={20} />
          <span className="text-[10px] text-white font-black uppercase tracking-widest px-4">Resize</span>
          <div className="w-16 h-1.5 bg-white/40 rounded-full" />
        </div>

        {/* ANSWERS BOTTOM */}
        <div style={{ height: `${100 - qHeightPct}%` }} className="overflow-y-auto p-4 bg-white custom-scrollbar">
          <div className="space-y-8 pb-10">
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
                    initialValue={responses[id] ?? ''}
                    fontSize={16}
                    compact
                    onDraftChange={onDraftChange}
                    onFocusTask={(tid) => setVisibleTaskId(tid)}
                  />
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* CONFIRM MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] p-10 max-w-md w-full text-center shadow-2xl">
            <h3 className="text-2xl font-black mb-3 italic uppercase text-orange-700">
              Imtihonni yakunlaysizmi?
            </h3>
            <p className="text-slate-500 mb-8 text-sm">
              Javoblar serverga yuboriladi va natija hisoblanadi.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-4 bg-slate-100 rounded-2xl font-bold hover:bg-slate-200 transition"
                type="button"
              >
                Yo‘q
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false)
                  doSubmit()
                }}
                className="flex-1 py-4 bg-orange-500 text-white rounded-2xl font-black shadow-lg hover:bg-orange-600 transition"
                type="button"
              >
                HA, YUBORISH
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBMIT LOADER */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-xl z-[200] flex flex-col items-center justify-center">
          <div className="w-20 h-20 border-8 border-orange-100 border-t-orange-500 rounded-full animate-spin" />
          <h2 className="mt-6 text-xl font-black italic text-orange-700 uppercase tracking-tight">
            AI natijalarni hisoblamoqda...
          </h2>
        </div>
      )}
    </div>
  )
}