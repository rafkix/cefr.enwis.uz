'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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

function isTypingNow() {
  const el = document.activeElement as HTMLElement | null
  if (!el) return false
  const tag = el.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable
}

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
const TAB_STR = '  ' // 2 space. xohlasang '\t'

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
  task: Task
  label: string
  value: string
  fontSize: number
  min: number
  max: number
  onCommit: (next: string) => void
  onFocusTask: () => void
  onBlurTask: () => void
  onFontDelta: (delta: number) => void
  attachContainerRef: (el: HTMLDivElement | null) => void
  attachTextareaRef: (el: HTMLTextAreaElement | null) => void
}

const TaskCard = React.memo(function TaskCard({
  task,
  label,
  value,
  fontSize,
  min,
  max,
  onCommit,
  onFocusTask,
  onBlurTask,
  onFontDelta,
  attachContainerRef,
  attachTextareaRef,
}: TaskCardProps) {
  const [local, setLocal] = useState(value)
  const debouncedCommit = useDebouncedCallback(onCommit, 250)

  useEffect(() => {
    setLocal(value)
  }, [value])

  const words = wc(local)
  const outOfRange = words > 0 && (words < min || words > max)
  const isOk = local.trim().length >= 10 && words >= min && words <= max

  return (
    <div
      ref={attachContainerRef}
      className="rounded-3xl border-2 border-cyan-400 overflow-hidden shadow-lg flex flex-col min-h-[320px] bg-white"
    >
      <div className="bg-cyan-400 p-4 flex justify-between items-center text-white">
        <span className="text-2xl font-black italic uppercase">Task {label}</span>

        <div className="flex items-center gap-2">
          {isOk ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-black bg-white/20 px-3 py-1 rounded-full">
              <CheckCircle2 size={14} /> OK
            </span>
          ) : null}

          {/* klaviatura bilan ham ishlaydi */}
          <div className="flex items-center bg-white/20 rounded-xl p-1">
            <button
              type="button"
              onClick={() => onFontDelta(-2)}
              className="px-3 py-2 hover:bg-white/20 rounded-lg font-black text-xs focus:outline-none focus:ring-2 focus:ring-white/70"
              aria-label="Font size decrease"
            >
              -a
            </button>
            <button
              type="button"
              onClick={() => onFontDelta(2)}
              className="px-3 py-2 hover:bg-white/20 rounded-lg font-black text-xs focus:outline-none focus:ring-2 focus:ring-white/70"
              aria-label="Font size increase"
            >
              A+
            </button>
          </div>
        </div>
      </div>

      <textarea
        ref={attachTextareaRef}
        style={{ fontSize: `${fontSize}px` }}
        onFocus={onFocusTask}
        onBlur={onBlurTask}
        className="flex-1 p-8 outline-none leading-relaxed text-gray-700 resize-none focus:outline-none"
        placeholder={`Task ${label} uchun javob yozing...`}
        value={local}
        // ✅ eng muhim joy: typing paytida SPACE/ENTER va boshqalar global hotkeylarga ketmasin
        onKeyDownCapture={(e) => {
          // typing bo'lsa, yuqoriga chiqarmaymiz
          e.stopPropagation()
          // ba’zi global listenerlar “native” bo‘lib qolsa:
          // @ts-ignore
          e.nativeEvent?.stopImmediatePropagation?.()
        }}
        onKeyDown={(e) => {
          // TAB indent/unindent
          if (e.key === 'Tab') {
            e.preventDefault()
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
          }
        }}
        onChange={(e) => {
          const next = e.target.value
          setLocal(next)
          debouncedCommit(next)
        }}
      />

      <div
        className={`p-3 text-right font-black text-sm border-t shrink-0 ${
          outOfRange
            ? 'bg-red-50 text-red-500 border-red-200'
            : 'bg-gray-50 text-cyan-600 border-gray-200'
        }`}
        aria-live="polite"
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
  const [hasStarted, setHasStarted] = useState(false)
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)

  const isExamFinished = useRef(false)

  const startedKey = useMemo(() => (examId ? `writing-${examId}-started` : null), [examId])
  const timeKey = useMemo(() => (examId ? `writing-${examId}-time` : null), [examId])
  const storageKey = useMemo(() => (examId ? `writing_responses_${examId}` : null), [examId])

  const taskContainerRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const taskTextareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({})

  // ✅ GLOBAL HOTKEY GUARD (agar boshqa joylarda global keydown bo‘lsa ham):
  // textarea fokusda bo‘lsa, capture bosqichidayoq to‘xtatamiz.
  useEffect(() => {
    const guard = (e: KeyboardEvent) => {
      if (!isTypingNow()) return
      // typing paytida (SPACE ham) boshqa global handlerlar ishlamasin
      e.stopPropagation()
      // @ts-ignore
      e.stopImmediatePropagation?.()
    }
    window.addEventListener('keydown', guard, { capture: true })
    return () => window.removeEventListener('keydown', guard, { capture: true } as any)
  }, [])

  // Load exam
  useEffect(() => {
    if (!examId) return
    ;(async () => {
      try {
        setLoading(true)
        const res = await getWritingExamByIdAPI(examId)
        setExam(res.data)
      } catch {
        toast.error("Ma'lumotlarni yuklashda xatolik!")
      } finally {
        setLoading(false)
      }
    })()
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

  const getLimits = useCallback((task: Task) => {
    const min = Number(task?.format?.min_words ?? 0)
    const max = Number(task?.format?.max_words ?? 999999)
    return { min, max }
  }, [])

  const taskLabel = useCallback((task: Task) => {
    return Number(task.part_number) === 1 ? `1.${task.sub_part}` : '2'
  }, [])

  // Sync started from localStorage
  useEffect(() => {
    if (!startedKey) return
    setHasStarted(localStorage.getItem(startedKey) === 'true')
  }, [startedKey])

  // Init responses
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

    const firstId = String(tasks[0].id)
    setActiveTaskId(firstId)
    // birinchi textarea focus
    requestAnimationFrame(() => {
      taskTextareaRefs.current[firstId]?.focus()
    })
  }, [storageKey, tasks])

  // Persist responses
  useEffect(() => {
    if (!storageKey) return
    if (!responses || Object.keys(responses).length === 0) return
    localStorage.setItem(storageKey, JSON.stringify(responses))
  }, [responses, storageKey])

  const commitAnswer = useCallback((taskId: string, next: string) => {
    setResponses((prev) => (prev[taskId] === next ? prev : { ...prev, [taskId]: next }))
  }, [])

  const changeFontSize = useCallback((taskId: string, delta: number) => {
    setFontSizes((prev) => ({
      ...prev,
      [taskId]: clamp((prev[taskId] ?? 18) + delta, 12, 32),
    }))
  }, [])

  const scrollAndFocusTask = useCallback((taskId: string) => {
    setActiveTaskId(taskId)
    taskContainerRefs.current[taskId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    requestAnimationFrame(() => taskTextareaRefs.current[taskId]?.focus())
  }, [])

  // ✅ Keyboard navigation (faqat textarea fokusda ham ishlaydi)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ctrl + Up/Down => task navigate
      if (e.ctrlKey && !e.shiftKey && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        e.preventDefault()

        const ids = tasks.map((t) => String(t.id))
        if (ids.length === 0) return

        const current = activeTaskId ?? ids[0]
        const idx = Math.max(0, ids.indexOf(current))
        const nextIdx = e.key === 'ArrowDown' ? Math.min(ids.length - 1, idx + 1) : Math.max(0, idx - 1)
        scrollAndFocusTask(ids[nextIdx])
        return
      }

      // Alt + 1..9 => jump task
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        const n = Number(e.key)
        if (!Number.isNaN(n) && n >= 1 && n <= 9) {
          const ids = tasks.map((t) => String(t.id))
          const target = ids[n - 1]
          if (target) {
            e.preventDefault()
            scrollAndFocusTask(target)
          }
        }
      }

      // Ctrl + = / - => font size for active task
      if (e.ctrlKey && (e.key === '=' || e.key === '-' || e.key === '+')) {
        const id = activeTaskId
        if (!id) return
        e.preventDefault()
        if (e.key === '-' ) changeFontSize(id, -2)
        else changeFontSize(id, 2)
      }
    }

    window.addEventListener('keydown', onKey, { capture: true })
    return () => window.removeEventListener('keydown', onKey, { capture: true } as any)
  }, [tasks, activeTaskId, scrollAndFocusTask, changeFontSize])

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
  }, [tasks, responses, getLimits, taskLabel])

  const doSubmit = useCallback(
    async () => {
      if (!examId || isSubmitting || isExamFinished.current) return
      setIsSubmitting(true)
      isExamFinished.current = true

      try {
        const finalAnswers = tasks.map((task) => {
          const id = String(task.id)
          const content = (responses[id] ?? '').trim()
          return { task_id: Number(task.id), content }
        })

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

        toast.error(`Xato: ${msg}`)
        isExamFinished.current = false
        setIsSubmitting(false)
      }
    },
    [examId, isSubmitting, tasks, responses, router, storageKey, startedKey, timeKey]
  )

  const startExam = () => {
    if (!examId) return
    const sk = `writing-${examId}-started`
    const tk = `writing-${examId}-time`

    localStorage.setItem(sk, 'true')
    if (!localStorage.getItem(tk)) {
      const totalSeconds = (Number(exam?.duration_minutes ?? 0) || 0) * 60
      localStorage.setItem(tk, String(totalSeconds))
    }

    setHasStarted(true)

    // startdan keyin fokus
    requestAnimationFrame(() => {
      const first = tasks[0] ? String(tasks[0].id) : null
      if (first) taskTextareaRefs.current[first]?.focus()
    })
  }

  // Render guards
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
        <div className="bg-white p-10 rounded-[40px] shadow-2xl text-center max-w-lg border-4 border-white">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Play size={40} className="ml-1" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-4 uppercase italic tracking-tight">
            {exam?.title || 'Writing Test'}
          </h1>
          <p className="text-slate-500 mb-8 font-medium italic">Writing bo&apos;limini boshlashga tayyormisiz?</p>

          {/* ✅ klaviatura: Enter bosib start */}
          <button
            onClick={startExam}
            className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg uppercase shadow-xl hover:bg-blue-700 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-blue-200"
            type="button"
          >
            Bo&apos;limni boshlash
          </button>

          <p className="mt-6 text-xs text-slate-500 leading-relaxed">
            Klaviatura: <b>Ctrl+↑/↓</b> tasklar orasida o‘tish, <b>Tab</b> indent, <b>Shift+Tab</b> unindent,
            <b> Ctrl +/-</b> font size.
          </p>
        </div>
      </div>
    )
  }

  const part1 = tasks.filter((t) => Number(t.part_number) === 1)
  const part2 = tasks.filter((t) => Number(t.part_number) === 2)

  const QuestionPaper = () => (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm p-10 space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-black uppercase">Question paper</h3>
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-2">Writing</p>
      </div>

      <div className="space-y-6">
        <h4 className="font-black uppercase text-slate-900">Part 1</h4>

        <div className="bg-blue-50 p-5 rounded-2xl border-l-4 border-blue-500">
          <p className="font-bold text-lg mb-2">{part1[0]?.topic ?? '—'}</p>
          <p className="text-gray-600 italic whitespace-pre-line">{part1[0]?.context_text ?? ''}</p>
        </div>

        <div className="grid gap-5">
          {part1.map((task) => {
            const { min, max } = getLimits(task)
            return (
              <div key={String(task.id)} className="p-5 border-2 border-dashed border-gray-200 rounded-2xl">
                <h4 className="font-black text-cyan-600">Task 1.{task.sub_part}</h4>
                <p className="text-lg mt-3">{task.instruction}</p>
                <span className="text-sm font-bold text-gray-400">Limit: {min}-{max} words</span>
              </div>
            )
          })}
        </div>

        {part2.map((task) => {
          const { min, max } = getLimits(task)
          return (
            <div key={String(task.id)} className="pt-8 border-t">
              <h4 className="font-black uppercase text-slate-900 mb-4">Part 2</h4>
              <div className="space-y-4">
                <p className="text-lg font-bold text-gray-800">Topic: {task.topic}</p>
                <p className="text-lg bg-gray-50 p-5 rounded-2xl italic">"{task.context_text}"</p>
                <p className="text-lg">{task.instruction}</p>
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

  const AnswerSheet = () => (
    <div className="space-y-10 pb-24">
      {tasks.map((task) => {
        const id = String(task.id)
        const label = taskLabel(task)
        const { min, max } = getLimits(task)

        return (
          <TaskCard
            key={id}
            task={task}
            label={label}
            value={responses[id] ?? ''}
            fontSize={fontSizes[id] ?? 18}
            min={min}
            max={max}
            attachContainerRef={(el) => {
              taskContainerRefs.current[id] = el
            }}
            attachTextareaRef={(el) => {
              taskTextareaRefs.current[id] = el
            }}
            onFontDelta={(delta) => changeFontSize(id, delta)}
            onFocusTask={() => setActiveTaskId(id)}
            onBlurTask={() => {}}
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
        onFinish={() => {
          if (emptyTasks.length > 0) {
            toast.error("Ba'zi tasklar to'liq emas. Yakunlashdan oldin to'ldiring.")
            // klaviatura bilan birinchi bo‘sh taskga sakrash:
            const t = emptyTasks[0]
            if (t) scrollAndFocusTask(t.id)
            return
          }
          doSubmit()
        }}
        isSubmitting={isSubmitting}
      />

      {isSubmitting && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center">
          <Loader2 className="h-16 w-16 text-cyan-500 animate-spin mb-4" />
          <p className="text-xl font-black uppercase italic">Tekshirilmoqda...</p>
        </div>
      )}

      {/* Desktop layout: left answers, right questions */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        <section className="flex-1 h-full overflow-y-auto p-10 custom-scrollbar">
          <AnswerSheet />
        </section>
        <section className="w-[860px] h-full overflow-y-auto p-10 bg-gray-100 custom-scrollbar border-l">
          <QuestionPaper />
        </section>
      </div>

      {/* Mobile: stack */}
      <div className="lg:hidden flex-1 overflow-y-auto p-3">
        <div className="mb-3">
          <QuestionPaper />
        </div>
        <AnswerSheet />
      </div>
    </div>
  )
}