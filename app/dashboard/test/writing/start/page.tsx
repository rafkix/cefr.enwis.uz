'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, AlertCircle } from 'lucide-react'
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

export default function WritingTestPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const examId = searchParams.get('id')

  const [exam, setExam] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  // responses/ fonts by TASK_ID (stabil)
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [fontSizes, setFontSizes] = useState<Record<string, number>>({})

  const [visibleTaskId, setVisibleTaskId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'question' | 'answer'>('answer')
  const [isTyping, setIsTyping] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const taskRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // ---------- Load exam ----------
  useEffect(() => {
    async function loadExam() {
      if (!examId) return
      try {
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
    // sort: Part1 sub_part 1,2 then Part2
    return [...t].sort((a, b) => {
      const ap = Number(a.part_number)
      const bp = Number(b.part_number)
      if (ap !== bp) return ap - bp
      const as = a.sub_part == null ? 999 : Number(a.sub_part)
      const bs = b.sub_part == null ? 999 : Number(b.sub_part)
      return as - bs
    })
  }, [exam])

  // ---------- LocalStorage key ----------
  const storageKey = useMemo(() => {
    if (!examId) return null
    return `writing_responses_${examId}`
  }, [examId])

  // ---------- Init responses from storage OR defaults ----------
  useEffect(() => {
    if (!storageKey || tasks.length === 0) return

    // default state from tasks
    const defaults: Record<string, string> = {}
    const defaultFonts: Record<string, number> = {}
    for (const t of tasks) {
      const id = String(t.id)
      defaults[id] = ''
      defaultFonts[id] = 18
    }

    // load from storage
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Record<string, string>
        // merge (only known task ids)
        for (const id of Object.keys(defaults)) {
          if (typeof parsed?.[id] === 'string') defaults[id] = parsed[id]
        }
      } catch (e) {
        console.error('Localstorage parse error', e)
      }
    }

    setResponses(defaults)
    setFontSizes(defaultFonts)

    // first task visible
    if (!visibleTaskId && tasks[0]) setVisibleTaskId(String(tasks[0].id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, tasks.length])

  // ---------- Persist responses ----------
  useEffect(() => {
    if (!storageKey) return
    // avoid saving empty object before init
    if (!responses || Object.keys(responses).length === 0) return
    localStorage.setItem(storageKey, JSON.stringify(responses))
  }, [responses, storageKey])

  // ---------- Helpers ----------
  const scrollToTask = (taskId: string) => {
    setActiveTab('answer')
    setTimeout(() => {
      taskRefs.current[taskId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setVisibleTaskId(taskId)
    }, 100)
  }

  const changeFontSize = (taskId: string, delta: number) => {
    setFontSizes((prev) => ({
      ...prev,
      [taskId]: clamp((prev[taskId] ?? 18) + delta, 12, 32),
    }))
  }

  const getLimits = (task: Task) => {
    const min = Number(task?.format?.min_words ?? 0)
    const max = Number(task?.format?.max_words ?? 999999)
    return { min, max }
  }

  const validateTask = (task: Task, content: string) => {
    const text = (content ?? '').trim()
    if (text.length < 10) {
      throw new Error(`Task ${Number(task.part_number)}.${task.sub_part ?? ''} to'ldirilmagan (min 10 belgi)!`)
    }

    const { min, max } = getLimits(task)
    const words = wc(text)

    if (words < min) {
      throw new Error(`Task ${Number(task.part_number)}.${task.sub_part ?? ''}: kamida ${min} so‘z yozing (hozir: ${words})`)
    }
    if (words > max) {
      throw new Error(`Task ${Number(task.part_number)}.${task.sub_part ?? ''}: ${max} so‘zdan oshirmang (hozir: ${words})`)
    }
  }

  const handleFinish = async () => {
    if (!exam || !examId || isSubmitting) return

    setIsSubmitting(true)
    setShowConfirmModal(false)

    try {
      const finalAnswers = tasks.map((task) => {
        const id = String(task.id)
        const content = (responses[id] ?? '').trim()

        validateTask(task, content)

        return {
          task_id: Number(task.id),
          content,
        }
      })

      const payload = { answers: finalAnswers }
      console.log('SUBMIT PAYLOAD:', payload)

      const res = await submitWritingExamAPI(examId, payload)

      // success
      if (storageKey) localStorage.removeItem(storageKey)
      toast.success('Muvaffaqiyatli topshirildi!')
      router.push(`/dashboard/results/writing/view?id=${res.data.id}`)
    } catch (error: any) {
      const detail =
        error?.response?.data?.error?.detail ||
        error?.response?.data?.detail ||
        error?.response?.data?.message

      const msg = error?.message || (typeof detail === 'string' ? detail : JSON.stringify(detail)) || 'Xatolik yuz berdi'

      // already submitted UX
      if (String(msg).toLowerCase().includes('already submitted')) {
        toast.error("Bu imtihon allaqachon topshirilgan!")
        // agar sizda result list page bo'lsa shu yerga yuboring:
        router.push(`/dashboard/results/writing`)
      } else {
        toast.error(`Xato: ${msg}`)
      }

      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-cyan-500 w-10 h-10" />
      </div>
    )
  }

  // Question section data
  const part1 = tasks.filter((t) => Number(t.part_number) === 1)
  const part2 = tasks.filter((t) => Number(t.part_number) === 2)

  return (
    <div className="flex flex-col h-screen bg-[#F3F4F6] overflow-hidden">
      <WritingHeader
        initialSeconds={(Number(exam?.duration_minutes ?? 0) || 0) * 60}
        onFinish={() => setShowConfirmModal(true)}
        isSubmitting={isSubmitting}
      />

      {/* Submit Loader */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center">
          <Loader2 className="h-16 w-16 text-cyan-500 animate-spin mb-4" />
          <p className="text-xl font-black uppercase italic">AI tekshirmoqda...</p>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-black mb-4 uppercase italic">Yakunlaysizmi?</h3>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-4 bg-gray-100 rounded-2xl font-bold"
              >
                Yo'q
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-4 bg-cyan-400 text-white rounded-2xl font-black italic shadow-lg"
              >
                HA
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex flex-1 overflow-hidden">
        {/* ANSWER SECTION */}
        <section
          ref={containerRef}
          className={`w-full lg:w-1/2 h-full overflow-y-auto p-4 lg:p-10 custom-scrollbar ${
            activeTab === 'answer' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="space-y-12 pb-80">
            {tasks.map((task) => {
              const id = String(task.id)
              const label =
                Number(task.part_number) === 1
                  ? `1.${task.sub_part}`
                  : '2'

              const text = responses[id] ?? ''
              const words = wc(text)
              const { min, max } = getLimits(task)
              const outOfRange = words > 0 && (words < min || words > max)

              return (
                <div
                  key={id}
                  ref={(el) => {
                    taskRefs.current[id] = el
                  }}
                  className="rounded-3xl border-2 border-cyan-400 overflow-hidden shadow-lg flex flex-col min-h-[400px] bg-white"
                >
                  <div className="bg-cyan-400 p-5 flex justify-between items-center text-white">
                    <span className="font-black text-2xl italic uppercase">Task {label}</span>
                    <div className="flex items-center bg-white/20 rounded-xl p-1">
                      <button onClick={() => changeFontSize(id, -2)} className="px-3 hover:bg-white/20 rounded-lg">
                        -a
                      </button>
                      <button onClick={() => changeFontSize(id, 2)} className="px-3 hover:bg-white/20 rounded-lg">
                        A+
                      </button>
                    </div>
                  </div>

                  <textarea
                    style={{ fontSize: `${fontSizes[id] ?? 18}px` }}
                    onFocus={() => setIsTyping(true)}
                    onBlur={() => setIsTyping(false)}
                    className="flex-1 p-8 outline-none leading-relaxed text-gray-700 resize-none"
                    placeholder={`Task ${label} uchun javob yozing...`}
                    value={text}
                    onChange={(e) => setResponses((prev) => ({ ...prev, [id]: e.target.value }))}
                  />

                  <div
                    className={`p-4 text-right font-black text-sm border-t shrink-0 transition-colors duration-300 ${
                      outOfRange ? 'bg-red-50 text-red-500 border-red-200' : 'bg-gray-50 text-cyan-500 border-gray-200'
                    }`}
                  >
                    {outOfRange ? (
                      <span className="flex items-center justify-end gap-2 animate-pulse">
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
            })}
          </div>
        </section>

        {/* QUESTION SECTION */}
        <section
          className={`w-full lg:w-1/2 h-full overflow-y-auto p-6 lg:p-12 bg-gray-100 border-l custom-scrollbar ${
            activeTab === 'question' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm p-10 space-y-8">
            <div className="text-center">
              <h3 className="text-3xl font-black uppercase">Part 1</h3>
            </div>

            <div className="bg-blue-50 p-6 rounded-2xl border-l-4 border-blue-500">
              <p className="font-bold text-xl mb-2">{part1[0]?.topic}</p>
              <p className="text-gray-600 italic">{part1[0]?.context_text}</p>
            </div>

            <div className="grid gap-8">
              {part1.map((task) => {
                const { min, max } = getLimits(task)
                return (
                  <div key={String(task.id)} className="p-6 border-2 border-dashed border-gray-200 rounded-2xl">
                    <h4 className="font-black text-cyan-600 mb-2">Task 1.{task.sub_part}</h4>
                    <p className="text-lg mb-4">{task.instruction}</p>
                    <span className="text-sm font-bold text-gray-400">Limit: {min}-{max} words</span>
                  </div>
                )
              })}
            </div>

            {part2.map((task) => {
              const { min, max } = getLimits(task)
              return (
                <div key={String(task.id)} className="pt-10 border-t mt-10">
                  <h3 className="text-3xl font-black uppercase text-center mb-6">Part 2</h3>
                  <div className="space-y-4">
                    <p className="text-xl font-bold text-gray-800">Topic: {task.topic}</p>
                    <p className="text-lg bg-gray-50 p-6 rounded-2xl italic">"{task.context_text}"</p>
                    <p className="text-lg">{task.instruction}</p>
                    <div className="bg-cyan-50 p-4 rounded-xl inline-block font-bold text-cyan-700">
                      Write {min}-{max} words.
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* NAVIGATION BUTTONS */}
        <div className={`fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50 ${isTyping ? 'max-lg:hidden' : 'flex'}`}>
          {tasks.map((task) => {
            const id = String(task.id)
            const label = Number(task.part_number) === 1 ? `1.${task.sub_part}` : '2'
            const isActive = visibleTaskId === id

            return (
              <button
                key={id}
                onClick={() => scrollToTask(id)}
                className={`w-14 h-14 rounded-2xl font-black transition-all border-4 ${
                  isActive ? 'bg-blue-600 text-white border-blue-200' : 'bg-white text-blue-400 border-transparent shadow-md'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </main>

      {/* MOBILE TABS */}
      <div className={`lg:hidden flex bg-white border-t shrink-0 ${isTyping ? 'hidden' : 'flex'}`}>
        <button
          onClick={() => setActiveTab('question')}
          className={`flex-1 py-4 font-bold ${
            activeTab === 'question' ? 'text-blue-600 bg-blue-50 border-t-4 border-blue-600' : 'text-gray-400'
          }`}
        >
          SAVOL
        </button>
        <button
          onClick={() => setActiveTab('answer')}
          className={`flex-1 py-4 font-bold ${
            activeTab === 'answer' ? 'text-cyan-500 bg-cyan-50 border-t-4 border-cyan-50' : 'text-gray-400'
          }`}
        >
          JAVOB
        </button>
      </div>
    </div>
  )
}