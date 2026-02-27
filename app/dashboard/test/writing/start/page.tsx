'use client'

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'
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

/** Parent’ni har harfda update qilmaslik uchun */
function useDebouncedCallback<T extends (...args: any[]) => void>(cb: T, delay = 250) {
  const t = useRef<number | null>(null)
  const latest = useRef(cb)

  useEffect(() => {
    latest.current = cb
  }, [cb])

  return useCallback(
    (...args: Parameters<T>) => {
      if (t.current) window.clearTimeout(t.current)
      t.current = window.setTimeout(() => latest.current(...args), delay)
    },
    [delay]
  )
}

/** TAB ni textarea ichida indent/unindent qilish */
const TAB_STR = '  ' // 2 space. xohlasang '\t' qil

function applyTabIndent(el: HTMLTextAreaElement, value: string, shiftKey: boolean) {
  const start = el.selectionStart ?? 0
  const end = el.selectionEnd ?? 0

  // cursor-only
  if (start === end) {
    if (!shiftKey) {
      const next = value.slice(0, start) + TAB_STR + value.slice(end)
      const pos = start + TAB_STR.length
      return { next, nextStart: pos, nextEnd: pos }
    }

    const before = value.slice(Math.max(0, start - TAB_STR.length), start)
    if (before === TAB_STR) {
      const next = value.slice(0, start - TAB_STR.length) + value.slice(end)
      const pos = start - TAB_STR.length
      return { next, nextStart: pos, nextEnd: pos }
    }

    return { next: value, nextStart: start, nextEnd: end }
  }

  // selection: satrlar bo'yicha indent/unindent
  const lineStart = value.lastIndexOf('\n', start - 1) + 1
  const lineEndIdx = value.indexOf('\n', end)
  const lineEnd = lineEndIdx === -1 ? value.length : lineEndIdx

  const block = value.slice(lineStart, lineEnd)
  const lines = block.split('\n')

  if (!shiftKey) {
    const indented = lines.map((ln) => TAB_STR + ln).join('\n')
    const next = value.slice(0, lineStart) + indented + value.slice(lineEnd)

    const added = TAB_STR.length * lines.length
    return {
      next,
      nextStart: start + TAB_STR.length,
      nextEnd: end + added,
    }
  }

  // shift+tab
  let removedTotal = 0
  const unindented = lines
    .map((ln) => {
      if (ln.startsWith(TAB_STR)) {
        removedTotal += TAB_STR.length
        return ln.slice(TAB_STR.length)
      }
      return ln
    })
    .join('\n')

  const next = value.slice(0, lineStart) + unindented + value.slice(lineEnd)

  const firstRemoved = lines[0].startsWith(TAB_STR) ? TAB_STR.length : 0
  const nextStart = Math.max(lineStart, start - firstRemoved)
  const nextEnd = Math.max(nextStart, end - removedTotal)

  return { next, nextStart, nextEnd }
}

type TaskCardProps = {
  compact?: boolean
  label: string
  value: string
  fontSize: number
  min: number
  max: number
  onCommit: (next: string) => void
  onFocusTask: () => void
  onBlurTask: () => void
  onFontDelta: (delta: number) => void
  attachRef: (el: HTMLDivElement | null) => void
}

const TaskCard = React.memo(function TaskCard({
  compact,
  label,
  value,
  fontSize,
  min,
  max,
  onCommit,
  onFocusTask,
  onBlurTask,
  onFontDelta,
  attachRef,
}: TaskCardProps) {
  const [local, setLocal] = useState(value)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const debouncedCommit = useDebouncedCallback(onCommit, 250)

  const words = wc(local)
  const outOfRange = words > 0 && (words < min || words > max)
  const isOk = local.trim().length >= 10 && words >= min && words <= max

  return (
    <div
      ref={attachRef}
      className="rounded-3xl border-2 border-cyan-400 overflow-hidden shadow-lg flex flex-col min-h-[320px] bg-white"
    >
      <div className="bg-cyan-400 p-4 flex justify-between items-center text-white">
        <span className={`${compact ? 'text-lg' : 'text-2xl'} font-black italic uppercase`}>
          Task {label}
        </span>

        <div className="flex items-center gap-2">
          {isOk ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-black bg-white/20 px-3 py-1 rounded-full">
              <CheckCircle2 size={14} /> OK
            </span>
          ) : null}

          <div className="flex items-center bg-white/20 rounded-xl p-1">
            <button
              onClick={() => onFontDelta(-2)}
              className="px-3 py-2 hover:bg-white/20 rounded-lg font-black text-xs"
              type="button"
            >
              -a
            </button>
            <button
              onClick={() => onFontDelta(2)}
              className="px-3 py-2 hover:bg-white/20 rounded-lg font-black text-xs"
              type="button"
            >
              A+
            </button>
          </div>
        </div>
      </div>

      <textarea
        style={{ fontSize: `${fontSize}px` }}
        onFocus={onFocusTask}
        onBlur={onBlurTask}
        className={`flex-1 ${compact ? 'p-5' : 'p-8'} outline-none leading-relaxed text-gray-700 resize-none`}
        placeholder={`Task ${label} uchun javob yozing...`}
        value={local}
        onKeyDown={(e) => {
          if (e.key !== 'Tab') return
          e.preventDefault() // ✅ fokus ketmasin

          const el = e.currentTarget
          setLocal((prev) => {
            const { next, nextStart, nextEnd } = applyTabIndent(el, prev, e.shiftKey)

            requestAnimationFrame(() => {
              try {
                el.setSelectionRange(nextStart, nextEnd)
              } catch {}
            })

            debouncedCommit(next)
            return next
          })
        }}
        onChange={(e) => {
          const next = e.target.value
          setLocal(next)
          debouncedCommit(next)
        }}
      />

      <div
        className={`p-3 text-right font-black ${compact ? 'text-xs' : 'text-sm'} border-t shrink-0 ${
          outOfRange
            ? 'bg-red-50 text-red-500 border-red-200'
            : 'bg-gray-50 text-cyan-500 border-gray-200'
        }`}
      >
        {outOfRange ? (
          <span className="flex items-center justify-end gap-2">
            <AlertCircle size={14} />
            {words < min
              ? `KAMIDA ${min} SO'Z (${words}/${min})`
              : `KO'PI ${max} SO'Z (${words}/${max})`}
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

  const [isTyping, setIsTyping] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [visibleTaskId, setVisibleTaskId] = useState<string | null>(null)

  const startedKey = useMemo(() => (examId ? `writing-${examId}-started` : null), [examId])
  const timeKey = useMemo(() => (examId ? `writing-${examId}-time` : null), [examId])
  const uiKey = useMemo(() => (examId ? `writing_ui_${examId}` : null), [examId])

  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (!examId) return
    const key = `writing-${examId}-started`

    const onStorage = (e: StorageEvent) => {
      if (e.key === key) setHasStarted(e.newValue === 'true')
    }

    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [examId])

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [forceSubmit, setForceSubmit] = useState(false)
  const isExamFinished = useRef(false)

  const layoutRef = useRef<HTMLDivElement>(null)
  const taskRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const [mobileView, setMobileView] = useState<'both' | 'question' | 'answer'>('both')

  const NORMAL_Q_W = 860
  const MINI_Q_W = 260
  const MIN_Q_W = 220
  const MAX_Q_W = 1800

  const [qWidth, setQWidth] = useState<number>(NORMAL_Q_W)
  const [isMiniQ, setIsMiniQ] = useState(false)
  const [dragging, setDragging] = useState(false)

  const mobileLayoutRef = useRef<HTMLDivElement>(null)
  const [mDragging, setMDragging] = useState(false)

  const MOBILE_Q_NORMAL = 320
  const MOBILE_Q_MIN = 120
  const MOBILE_Q_MAX = 900
  const [mQHeight, setMQHeight] = useState<number>(MOBILE_Q_NORMAL)

  const [mExpand, setMExpand] = useState<'normal' | 'question' | 'answer'>('normal')

  useEffect(() => {
    const up = () => setMDragging(false)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)
    return () => {
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [])

  useEffect(() => {
    if (!startedKey) return
    const started = localStorage.getItem(startedKey) === 'true'
    setHasStarted(started)
  }, [startedKey])

  useEffect(() => {
    async function loadExam() {
      if (!examId) return
      try {
        setLoading(true)
        const res = await getWritingExamByIdAPI(examId)
        setExam(res.data)
      } catch {
        toast.error("Ma'lumotlarni yuklashda xatolik!")
      } finally {
        setLoading(false)
      }
    }
    loadExam()
  }, [examId])

  const tasks: Task[] = useMemo(() => {
    const t = (exam?.tasks ?? []) as Task[]
    return [...t].sort((a, b) => {
      const ap = Number(a.part_number)
      const bp = Number(b.part_number)
      if (ap !== bp) return ap - bp
      const as = a.sub_part == null ? 999 : Number(a.sub_part)
      const bs = b.sub_part == null ? 999 : Number(b.sub_part)
      return as - bs
    })
  }, [exam])

  const storageKey = useMemo(() => {
    if (!examId) return null
    return `writing_responses_${examId}`
  }, [examId])

  useEffect(() => {
    if (!storageKey || tasks.length === 0) return

    const defaults: Record<string, string> = {}
    const defaultFonts: Record<string, number> = {}

    for (const t of tasks) {
      const id = String(t.id)
      defaults[id] = ''
      defaultFonts[id] = 18
    }

    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Record<string, string>
        for (const id of Object.keys(defaults)) {
          if (typeof parsed?.[id] === 'string') defaults[id] = parsed[id]
        }
      } catch {}
    }

    setResponses(defaults)
    setFontSizes(defaultFonts)
    if (!visibleTaskId && tasks[0]) setVisibleTaskId(String(tasks[0].id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, tasks.length])

  useEffect(() => {
    if (!storageKey) return
    if (!responses || Object.keys(responses).length === 0) return
    localStorage.setItem(storageKey, JSON.stringify(responses))
  }, [responses, storageKey])

  useEffect(() => {
    if (!uiKey) return
    const saved = localStorage.getItem(uiKey)
    if (!saved) return
    try {
      const parsed = JSON.parse(saved) as {
        qWidth?: number
        mQHeight?: number
        mobileView?: 'both' | 'question' | 'answer'
        mExpand?: 'normal' | 'question' | 'answer'
      }

      if (typeof parsed.qWidth === 'number') setQWidth(clamp(parsed.qWidth, MIN_Q_W, MAX_Q_W))
      if (typeof parsed.mQHeight === 'number') setMQHeight(clamp(parsed.mQHeight, MOBILE_Q_MIN, MOBILE_Q_MAX))
      if (parsed.mobileView) setMobileView(parsed.mobileView)
      if (parsed.mExpand) setMExpand(parsed.mExpand)
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uiKey])

  useEffect(() => {
    if (!uiKey) return
    localStorage.setItem(uiKey, JSON.stringify({ qWidth, mQHeight, mobileView, mExpand }))
  }, [uiKey, qWidth, mQHeight, mobileView, mExpand])

  const getLimits = (task: Task) => {
    const min = Number(task?.format?.min_words ?? 0)
    const max = Number(task?.format?.max_words ?? 999999)
    return { min, max }
  }

  const taskLabel = (task: Task) => (Number(task.part_number) === 1 ? `1.${task.sub_part}` : '2')

  const scrollToTask = (taskId: string) => {
    setTimeout(() => {
      taskRefs.current[taskId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setVisibleTaskId(taskId)
    }, 60)
  }

  const changeFontSize = (taskId: string, delta: number) => {
    setFontSizes((prev) => ({
      ...prev,
      [taskId]: clamp((prev[taskId] ?? 18) + delta, 12, 32),
    }))
  }

  const commitAnswer = useCallback((taskId: string, next: string) => {
    setResponses((prev) => (prev[taskId] === next ? prev : { ...prev, [taskId]: next }))
  }, [])

  const emptyTasks = useMemo(() => {
    const empties: { id: string; label: string; words: number; min: number }[] = []
    for (const t of tasks) {
      const id = String(t.id)
      const content = (responses[id] ?? '').trim()
      const words = wc(content)
      const { min } = getLimits(t)
      if (content.length < 10 || words < min) empties.push({ id, label: taskLabel(t), words, min })
    }
    return empties
  }, [tasks, responses])

  const canSubmitNormally = emptyTasks.length === 0

  const doSubmit = useCallback(
    async (allowForce: boolean) => {
      if (!examId || isSubmitting || isExamFinished.current) return

      setIsSubmitting(true)
      isExamFinished.current = true

      try {
        const finalAnswers = tasks.map((task) => {
          const id = String(task.id)
          const content = (responses[id] ?? '').trim()
          return { task_id: Number(task.id), content }
        })

        if (!allowForce) {
          for (const t of tasks) {
            const id = String(t.id)
            const content = (responses[id] ?? '').trim()
            if (content.length < 10) throw new Error(`Task ${taskLabel(t)} to'ldirilmagan (min 10 belgi)!`)

            const { min, max } = getLimits(t)
            const words = wc(content)
            if (words < min) throw new Error(`Task ${taskLabel(t)}: kamida ${min} so‘z (hozir: ${words})`)
            if (words > max) throw new Error(`Task ${taskLabel(t)}: ${max} so‘zdan oshirmang (hozir: ${words})`)
          }
        }

        const res = await submitWritingExamAPI(examId, { answers: finalAnswers })

        if (storageKey) localStorage.removeItem(storageKey)
        if (startedKey) localStorage.removeItem(startedKey)
        if (timeKey) localStorage.removeItem(timeKey)

        toast.success('Muvaffaqiyatli topshirildi!')
        router.push(`/dashboard/results/writing/view?id=${res.data.id}`)
      } catch (error: any) {
        const detail =
          error?.response?.data?.error?.detail || error?.response?.data?.detail || error?.response?.data?.message
        const msg =
          error?.message || (typeof detail === 'string' ? detail : JSON.stringify(detail)) || 'Xatolik yuz berdi'

        if (String(msg).toLowerCase().includes('already submitted')) {
          toast.error('Bu imtihon allaqachon topshirilgan!')
          router.push(`/dashboard/results/writing`)
        } else {
          toast.error(`Xato: ${msg}`)
        }

        isExamFinished.current = false
        setIsSubmitting(false)
      }
    },
    [examId, isSubmitting, storageKey, startedKey, timeKey, tasks, responses, router]
  )

  const handleFinishClick = () => {
    setForceSubmit(false)
    setShowConfirmModal(true)
  }

  const handleConfirmFinish = async () => {
    setShowConfirmModal(false)

    if (canSubmitNormally) return doSubmit(false)

    if (!forceSubmit) {
      toast.error("Ba'zi tasklar to'liq yozilmagan. Baribir yakunlash uchun checkboxni belgilang yoki to'ldiring.")
      setShowConfirmModal(true)
      return
    }

    return doSubmit(true)
  }

  const startExam = () => {
    if (!examId) return

    const startedKey2 = `writing-${examId}-started`
    const timeKey2 = `writing-${examId}-time`

    const elem = document.documentElement
    if (elem.requestFullscreen) elem.requestFullscreen().catch(() => {})

    localStorage.setItem(startedKey2, 'true')

    if (!localStorage.getItem(timeKey2)) {
      const totalSeconds = (Number(exam?.duration_minutes ?? 0) || 0) * 60
      localStorage.setItem(timeKey2, String(totalSeconds))
    }

    setHasStarted(true)
  }

  useEffect(() => {
    if (!hasStarted) return

    const preventDefault = (e: BeforeUnloadEvent) => {
      if (!isExamFinished.current) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    window.history.pushState(null, '', window.location.href)
    const handlePopState = () => {
      if (!isExamFinished.current) window.history.pushState(null, '', window.location.href)
    }

    window.addEventListener('beforeunload', preventDefault)
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('beforeunload', preventDefault)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [hasStarted])

  const toggleQuestionSize = () => {
    setIsMiniQ((p) => {
      const next = !p
      setQWidth(next ? MINI_Q_W : NORMAL_Q_W)
      return next
    })
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (!layoutRef.current) return
    setDragging(true)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || !layoutRef.current) return

    const rect = layoutRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left

    const NAV_W = 96
    const SPLITTER_W = 18

    const totalW = rect.width
    const rightSpace = totalW - x
    const desiredQ = rightSpace - NAV_W - SPLITTER_W

    const nextQ = clamp(desiredQ, MIN_Q_W, MAX_Q_W)
    setQWidth(nextQ)
    setIsMiniQ(nextQ <= MINI_Q_W + 5)
  }

  const onPointerUp = () => setDragging(false)

  const mobileToggleExpand = () => {
    setMExpand((prev) => (prev === 'normal' ? 'question' : prev === 'question' ? 'answer' : 'normal'))
  }

  const onMobilePointerDown = (e: React.PointerEvent) => {
    if (!mobileLayoutRef.current) return
    setMDragging(true)
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onMobilePointerMove = (e: React.PointerEvent) => {
    if (!mDragging || !mobileLayoutRef.current) return
    const rect = mobileLayoutRef.current.getBoundingClientRect()
    const y = e.clientY - rect.top
    const SPLITTER_H = 14
    const desired = y - SPLITTER_H / 2
    const nextH = clamp(desired, MOBILE_Q_MIN, MOBILE_Q_MAX)
    setMQHeight(nextH)
    if (mExpand !== 'normal') setMExpand('normal')
  }

  const onMobilePointerUp = () => setMDragging(false)

  useEffect(() => {
    if (!mDragging) return
    const prevent = (e: TouchEvent) => e.preventDefault()
    document.addEventListener('touchmove', prevent, { passive: false })
    return () => document.removeEventListener('touchmove', prevent as any)
  }, [mDragging])

  const mobileQuestionHeight =
    mExpand === 'question' ? '72vh' : mExpand === 'answer' ? '18vh' : `${mQHeight}px`
  const mobileAnswerMinHeight = mExpand === 'question' ? '18vh' : mExpand === 'answer' ? '72vh' : 'auto'

  if (!examId) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <p className="font-black text-slate-700">ID topilmadi</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-cyan-500 w-10 h-10" />
      </div>
    )
  }

  if (!hasStarted) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-10 rounded-[40px] shadow-2xl text-center max-w-lg border-4 border-white animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Play size={40} className="ml-1" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-4 uppercase italic tracking-tight">
            {exam?.title || 'Writing Test'}
          </h1>
          <p className="text-slate-500 mb-8 font-medium italic">Writing bo&apos;limini boshlashga tayyormisiz?</p>
          <button
            onClick={startExam}
            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg uppercase shadow-xl hover:bg-blue-700 active:scale-95 transition-all"
            type="button"
          >
            Bo&apos;limni boshlash
          </button>
        </div>
      </div>
    )
  }

  const part1 = tasks.filter((t) => Number(t.part_number) === 1)
  const part2 = tasks.filter((t) => Number(t.part_number) === 2)

  const QuestionPaper = ({ compact }: { compact?: boolean }) => (
    <div className={`max-w-4xl mx-auto bg-white rounded-3xl shadow-sm ${compact ? 'p-5' : 'p-10'} space-y-8`}>
      <div className="text-center">
        <h3 className={`${compact ? 'text-xl' : 'text-3xl'} font-black uppercase`}>Question paper</h3>
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2">Writing</p>
      </div>

      <div className="space-y-6">
        <h4 className="font-black uppercase text-slate-900">Part 1</h4>

        <div className="bg-blue-50 p-5 rounded-2xl border-l-4 border-blue-500">
          <p className="font-bold text-lg mb-2">{part1[0]?.topic}</p>
          <p className="text-gray-600 italic whitespace-pre-line">{part1[0]?.context_text}</p>
        </div>

        <div className="grid gap-5">
          {part1.map((task) => {
            const { min, max } = getLimits(task)
            return (
              <div key={String(task.id)} className="p-5 border-2 border-dashed border-gray-200 rounded-2xl">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-black text-cyan-600">Task 1.{task.sub_part}</h4>
                  <button
                    onClick={() => {
                      setMobileView('answer')
                      scrollToTask(String(task.id))
                    }}
                    className="text-[11px] font-black uppercase text-cyan-700 bg-cyan-50 px-3 py-2 rounded-xl hover:bg-cyan-100 transition"
                    type="button"
                  >
                    Answer
                  </button>
                </div>
                <p className={`${compact ? 'text-sm' : 'text-lg'} mt-3`}>{task.instruction}</p>
                <span className="text-sm font-bold text-gray-400">Limit: {min}-{max} words</span>
              </div>
            )
          })}
        </div>

        <div className="pt-2" />

        {part2.map((task) => {
          const { min, max } = getLimits(task)
          return (
            <div key={String(task.id)} className="pt-8 border-t">
              <h4 className="font-black uppercase text-slate-900 mb-4">Part 2</h4>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-lg font-bold text-gray-800">Topic: {task.topic}</p>
                  <button
                    onClick={() => {
                      setMobileView('answer')
                      scrollToTask(String(task.id))
                    }}
                    className="text-[11px] font-black uppercase text-cyan-700 bg-cyan-50 px-3 py-2 rounded-xl hover:bg-cyan-100 transition"
                    type="button"
                  >
                    Answer
                  </button>
                </div>

                <p className={`${compact ? 'text-sm' : 'text-lg'} bg-gray-50 p-5 rounded-2xl italic`}>
                  "{task.context_text}"
                </p>
                <p className={`${compact ? 'text-sm' : 'text-lg'}`}>{task.instruction}</p>
                <div className="bg-cyan-50 p-4 rounded-xl inline-block font-bold text-cyan-700">
                  Write {min}-{max} words.
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const AnswerSheet = ({ compact }: { compact?: boolean }) => (
    <div className="space-y-10 pb-24">
      {tasks.map((task) => {
        const id = String(task.id)
        const label = taskLabel(task)
        const { min, max } = getLimits(task)

        return (
          <TaskCard
            key={id}
            compact={compact}
            label={label}
            value={responses[id] ?? ''}
            fontSize={fontSizes[id] ?? 18}
            min={min}
            max={max}
            attachRef={(el) => {
              taskRefs.current[id] = el
            }}
            onFontDelta={(delta) => changeFontSize(id, delta)}
            onFocusTask={() => {
              setIsTyping(true)
              setVisibleTaskId(id)
            }}
            onBlurTask={() => setIsTyping(false)}
            onCommit={(next) => commitAnswer(id, next)}
          />
        )
      })}
    </div>
  )

  return (
    <div className="flex flex-col h-screen bg-[#F3F4F6] overflow-hidden">
      <WritingHeader
        initialSeconds={(Number(exam?.duration_minutes ?? 0) || 0) * 60}
        onFinish={handleFinishClick}
        isSubmitting={isSubmitting}
      />

      {isSubmitting && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center">
          <Loader2 className="h-16 w-16 text-cyan-500 animate-spin mb-4" />
          <p className="text-xl font-black uppercase italic">AI tekshirmoqda...</p>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-lg w-full shadow-2xl">
            <h3 className="text-2xl font-black mb-3 uppercase italic">Yakunlaysizmi?</h3>

            {!canSubmitNormally && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100">
                <p className="font-black text-red-600 uppercase text-xs mb-3">To‘liq yozilmagan tasklar:</p>

                <div className="flex flex-wrap gap-2">
                  {emptyTasks.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setShowConfirmModal(false)
                        setMobileView('answer')
                        scrollToTask(t.id)
                      }}
                      className="px-3 py-2 rounded-xl bg-white border border-red-200 text-red-600 font-black text-xs hover:bg-red-100/40 transition"
                      type="button"
                    >
                      Task {t.label} ({t.words}/{t.min})
                    </button>
                  ))}
                </div>

                <label className="mt-4 flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={forceSubmit}
                    onChange={(e) => setForceSubmit(e.target.checked)}
                    className="mt-1 w-4 h-4"
                  />
                  <span className="text-xs font-bold text-red-700 leading-relaxed">
                    Baribir yakunlayman (to‘liq yozilmagan bo‘lsa ham).
                  </span>
                </label>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-4 bg-gray-100 rounded-2xl font-bold hover:bg-gray-200 transition"
                type="button"
              >
                Yo&apos;q
              </button>
              <button
                onClick={handleConfirmFinish}
                className="flex-1 py-4 bg-cyan-400 text-white rounded-2xl font-black italic shadow-lg hover:bg-cyan-500 transition"
                type="button"
              >
                HA
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE */}
      <div className="lg:hidden flex-1 overflow-hidden p-3">
        <div className="bg-white border border-slate-100 rounded-2xl p-2 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMobileView('both')}
              className={`px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition ${
                mobileView === 'both' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600'
              }`}
            >
              Ikki bo‘lim
            </button>
            <button
              type="button"
              onClick={() => setMobileView('question')}
              className={`px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 transition ${
                mobileView === 'question' ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-600'
              }`}
            >
              <LayoutPanelTop size={16} /> Savol
            </button>
            <button
              type="button"
              onClick={() => setMobileView('answer')}
              className={`px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 transition ${
                mobileView === 'answer' ? 'bg-cyan-500 text-white' : 'bg-slate-50 text-slate-600'
              }`}
            >
              <LayoutPanelLeft size={16} /> Javob
            </button>
          </div>

          <button
            type="button"
            onClick={mobileToggleExpand}
            className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 active:scale-95 transition"
            title="Savol/Javob kattalashtirish"
          >
            {mExpand === 'normal' ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
          </button>
        </div>

        {mobileView === 'both' && (
          <div ref={mobileLayoutRef} className="mt-3 h-[calc(100%-60px)] flex flex-col overflow-hidden">
            <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white" style={{ height: mobileQuestionHeight }}>
              <div className="h-full overflow-y-auto custom-scrollbar p-2">
                <QuestionPaper compact />
              </div>
            </div>

            <div
              className="relative my-2 h-[14px] rounded-xl bg-gray-100 border border-slate-200 flex items-center justify-center select-none"
              onPointerDown={onMobilePointerDown}
              onPointerMove={onMobilePointerMove}
              onPointerUp={onMobilePointerUp}
            >
              <div className={`w-14 h-[6px] rounded-full ${mDragging ? 'bg-blue-500' : 'bg-slate-300'}`} />
            </div>

            <div className="flex-1 overflow-hidden rounded-3xl border border-slate-100 bg-white" style={{ minHeight: mobileAnswerMinHeight }}>
              <div className="h-full overflow-y-auto custom-scrollbar p-3">
                <div className="text-center py-2">
                  <h3 className="text-xl font-black uppercase">Answer sheet</h3>
                </div>
                <AnswerSheet compact />
              </div>
            </div>
          </div>
        )}

        {mobileView === 'question' && (
          <div className="mt-3 h-[calc(100%-60px)] overflow-hidden rounded-3xl border border-slate-100 bg-white">
            <div className="h-full overflow-y-auto custom-scrollbar p-2">
              <QuestionPaper compact />
            </div>
          </div>
        )}

        {mobileView === 'answer' && (
          <div className="mt-3 h-[calc(100%-60px)] overflow-hidden rounded-3xl border border-slate-100 bg-white">
            <div className="h-full overflow-y-auto custom-scrollbar p-3">
              <div className="text-center py-2">
                <h3 className="text-xl font-black uppercase">Answer sheet</h3>
              </div>
              <AnswerSheet compact />
            </div>
          </div>
        )}
      </div>

      {/* DESKTOP */}
      <div ref={layoutRef} className="hidden lg:flex flex-1 overflow-hidden relative">
        <section className="flex-1 h-full overflow-y-auto p-10 custom-scrollbar">
          <AnswerSheet />
        </section>

        <div
          className="relative h-full bg-gray-100 border-l border-r select-none"
          style={{ width: 18 }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              toggleQuestionSize()
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-2xl bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-200 transition"
            title={isMiniQ ? 'Kattalashtirish' : 'Kichraytirish'}
          >
            <ChevronsLeftRight size={18} />
          </button>
        </div>

        <section className="h-full overflow-y-auto p-10 bg-gray-100 custom-scrollbar border-r" style={{ width: qWidth }}>
          <QuestionPaper />
        </section>

        <aside
          className={`h-full bg-[#F3F4F6] w-24 border-l flex items-center justify-center transition ${
            isTyping ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="flex flex-col gap-3 pr-2">
            {tasks.map((task) => {
              const id = String(task.id)
              const label = taskLabel(task)
              const isActive = visibleTaskId === id

              const content = (responses[id] ?? '').trim()
              const { min, max } = getLimits(task)
              const words = wc(content)
              const ok = content.length >= 10 && words >= min && words <= max

              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollToTask(id)}
                  className={`w-14 h-14 rounded-2xl font-black transition-all border ${
                    isActive ? 'bg-blue-600 text-white border-blue-200' : 'bg-white text-blue-500 border-slate-200'
                  } hover:scale-[1.02] active:scale-95`}
                  title={`Task ${label}`}
                >
                  <div className="flex flex-col items-center justify-center leading-none">
                    <span className="text-sm">{label}</span>
                    {ok ? <span className="text-[9px] mt-1 opacity-90">OK</span> : <span className="text-[9px] mt-1 opacity-60">...</span>}
                  </div>
                </button>
              )
            })}
          </div>
        </aside>
      </div>
    </div>
  )
}