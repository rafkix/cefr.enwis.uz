'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Camera, BookOpen, PenTool, Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

// API va Types
import { WritingExam } from '@/lib/types/writing'
import { getWritingExamByIdAPI, submitWritingExamAPI } from '@/lib/api/writing'
import WritingHeader from '@/components/exam/writing-header'

export default function WritingTestPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const examId = searchParams.get('id')

  const taskOrder = ['1.1', '1.2', '2']
  const taskRefs: Record<string, React.RefObject<HTMLDivElement | null>> = {
    '1.1': useRef<HTMLDivElement | null>(null),
    '1.2': useRef<HTMLDivElement | null>(null),
    '2': useRef<HTMLDivElement | null>(null),
  }

  // --- States ---
  const [exam, setExam] = useState<WritingExam | null>(null)
  const [loading, setLoading] = useState(true)
  const [responses, setResponses] = useState<Record<string, string>>({
    '1.1': '',
    '1.2': '',
    '2': '',
  })
  const [fontSizes, setFontSizes] = useState<Record<string, number>>({
    '1.1': 18,
    '1.2': 18,
    '2': 18,
  })
  const [visibleTask, setVisibleTask] = useState<string>('1.1')
  const [activeTab, setActiveTab] = useState<'question' | 'answer'>('answer')
  const [isTyping, setIsTyping] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Xatoni keltirib chiqargan state (not implemented xatosi shundan edi)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // --- 1. Ma'lumotlarni yuklash ---
  useEffect(() => {
    async function loadExam() {
      if (!examId) return
      try {
        const res = await getWritingExamByIdAPI(examId)
        setExam(res.data)
        // Boshlang'ich qiymatlarni o'rnatish
        if (res.data.tasks.length > 0) {
          setVisibleTask('1.1')
        }
      } catch (error) {
        toast.error("Imtihon ma'lumotlarini yuklashda xatolik!")
      } finally {
        setLoading(false)
      }
    }
    loadExam()
  }, [examId])

  // --- 2. Scroll monitoring ---
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 1024 || !containerRef.current) return
      const scrollPos = containerRef.current.scrollTop

      taskOrder.forEach((tid) => {
        const ref = taskRefs[tid]?.current
        if (ref && Math.abs(ref.offsetTop - scrollPos - 100) < 200) {
          setVisibleTask(tid)
        }
      })
    }
    const container = containerRef.current
    container?.addEventListener('scroll', handleScroll)
    return () => container?.removeEventListener('scroll', handleScroll)
  }, [exam])

  // --- 3. Yordamchi funksiyalar ---
  const scrollToTask = (taskId: string) => {
    setActiveTab('answer')
    setTimeout(() => {
      taskRefs[taskId]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setVisibleTask(taskId)
    }, 100)
  }

  const changeFontSize = (taskId: string, delta: number) => {
    setFontSizes((prev) => ({
      ...prev,
      [taskId]: Math.min(Math.max(prev[taskId] + delta, 12), 32),
    }))
  }

  const getWordCount = (text: string = '') =>
    text.trim().split(/\s+/).filter(Boolean).length

  const handleFinish = async () => {
    if (!exam || !examId || isSubmitting) return

    setIsSubmitting(true)
    setShowConfirmModal(false)

    try {
      const finalResponses: Record<string, string> = {}

      exam.tasks.forEach((task) => {
        const dbTaskId = task.id?.toString()
        if (dbTaskId) {
          // Front-enddagi 1.1, 1.2, 2 larni DB ID lariga map qilamiz
          if (task.partNumber === 1) finalResponses[dbTaskId] = responses['1.1'] || ''
          if (task.partNumber === 2) finalResponses[dbTaskId] = responses['1.2'] || ''
          if (task.partNumber === 3) finalResponses[dbTaskId] = responses['2'] || ''
        }
      })

      // Swagger namunasi asosida Payload (Body)
      const payload = {
        examId: examId, // DB dagi string ID (masalan: "writing-test-sample-1")
        attemptId: 0, // Integer
        userResponses: finalResponses, // Record<string, string>
      }

      // Query parametri uchun foydalanuvchi ID
      const userId = 1

      console.log("🚀 Swagger bo'yicha Payload:", payload)

      const res = await submitWritingExamAPI(payload, userId)

      toast.success('Muvaffaqiyatli topshirildi!')

      // Natija sahifasiga o'tish (Response sample dagi 'id' ni olamiz)
      const resultId = res.data?.id
      router.push(`/dashboard/results/writing/view?id=${resultId}`)
    } catch (error: any) {
      console.error('🔴 Backend xatosi:', error.response?.data)

      const detail = error.response?.data?.detail
      if (Array.isArray(detail)) {
        // Qaysi maydon xatoligini aniq ko'rsatish
        const errorMsg = detail
          .map((d: any) => `${d.loc.join('.')}: ${d.msg}`)
          .join(', ')
        toast.error(`Format xatosi: ${errorMsg}`)
      } else {
        toast.error(error.response?.data?.message || 'Xatolik yuz berdi')
      }
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-[#F3F4F6] overflow-hidden">
      {/* Headerga setShowConfirmModal o'rniga triggerni yuboramiz */}
      <WritingHeader
        initialSeconds={exam?.durationMinutes ? exam.durationMinutes * 60 : 3600}
        onFinish={() => setShowConfirmModal(true)}
        isSubmitting={isSubmitting}
      />

      {/* Loader Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center">
          <div className="bg-white p-10 rounded-[40px] shadow-2xl border-4 border-[#22D3EE] flex flex-col items-center gap-6 animate-in zoom-in duration-300">
            <Loader2 className="h-16 w-16 text-[#22D3EE] animate-spin" />
            <div className="text-center">
              <p className="text-2xl font-black text-slate-800 uppercase italic italic tracking-tighter">
                AI natijangizni tekshirmoqda...
              </p>
              <p className="text-slate-500 mt-2">Iltimos, sahifani yopmang.</p>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl border-4 border-white">
            <h3 className="text-2xl font-black text-slate-800 mb-4 uppercase italic">
              Imtihonni yakunlaysizmi?
            </h3>
            <p className="text-slate-600 mb-8 font-medium">
              Barcha javoblar qayta ishlanishi uchun yuboriladi. Bu amalni ortga
              qaytarib bo'lmaydi.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-4 bg-[#22D3EE] text-white rounded-2xl font-black uppercase italic shadow-lg shadow-cyan-200 hover:scale-105 active:scale-95 transition-all"
              >
                Ha, yakunlash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE TAB BAR */}
      <div
        className={`lg:hidden flex bg-white border-b border-gray-200 shrink-0 transition-all duration-300 ${isTyping ? 'h-0 overflow-hidden opacity-0' : 'h-auto opacity-100'}`}
      >
        <button
          onClick={() => setActiveTab('question')}
          className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold transition-all ${activeTab === 'question' ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50' : 'text-gray-400'}`}
        >
          <BookOpen size={18} /> Question
        </button>
        <button
          onClick={() => setActiveTab('answer')}
          className={`flex-1 py-4 flex items-center justify-center gap-2 font-bold transition-all ${activeTab === 'answer' ? 'text-[#22D3EE] border-b-4 border-[#22D3EE] bg-cyan-50' : 'text-gray-400'}`}
        >
          <PenTool size={18} /> Javob
        </button>
      </div>

      <main className="flex flex-1 overflow-hidden relative">
        {/* --- JAVOBLAR SECTION --- */}
        <section
          ref={containerRef}
          className={`
                        w-full lg:w-1/2 h-full overflow-y-auto p-4 lg:p-10 custom-scrollbar scroll-smooth
                        ${activeTab === 'answer' ? 'block' : 'hidden lg:block'}
                    `}
        >
          <div className="space-y-12 pb-80">
            {taskOrder.map((taskId) => (
              <div
                key={taskId}
                id={`task-${taskId}`} // Navigatsiya ishlashi uchun ID muhim
                ref={taskRefs[taskId]}
                className="rounded-3xl border-2 border-[#22D3EE] overflow-hidden shadow-lg flex flex-col resize-y min-h-[350px] bg-white group"
                style={{ height: taskId === '2' ? '550px' : '450px' }}
              >
                {/* Task Header */}
                <div className="bg-[#22D3EE] p-5 flex justify-between items-center text-white shrink-0">
                  <span className="font-black text-2xl italic uppercase tracking-tighter">
                    Task {taskId}
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-white/20 rounded-xl p-1 border border-white/30">
                      <button
                        onClick={() => changeFontSize(taskId, -2)}
                        className="px-3 hover:bg-white/20 rounded-lg font-bold transition-colors"
                      >
                        -a
                      </button>
                      <div className="w-[1px] h-4 bg-white/40 mx-1" />
                      <button
                        onClick={() => changeFontSize(taskId, 2)}
                        className="px-3 hover:bg-white/20 rounded-lg font-bold transition-colors"
                      >
                        A+
                      </button>
                    </div>
                  </div>
                </div>

                {/* Textarea */}
                <div className="flex-1 min-h-0">
                  <textarea
                    style={{ fontSize: `${fontSizes[taskId]}px` }}
                    onFocus={() => setIsTyping(true)}
                    onBlur={() => setIsTyping(false)}
                    className="w-full h-full p-8 outline-none leading-relaxed text-gray-700 font-medium transition-all bg-transparent custom-scrollbar resize-none"
                    placeholder={`Task ${taskId} uchun javobingizni shu yerga yozing...`}
                    value={responses[taskId]}
                    onChange={(e) =>
                      setResponses({ ...responses, [taskId]: e.target.value })
                    }
                  />
                </div>

                {/* Word Counter */}
                <div
                  className={`p-4 bg-slate-50 text-right font-black text-sm border-t shrink-0 ${getWordCount(responses[taskId]) === 0 ? 'text-red-400' : 'text-[#22D3EE]'}`}
                >
                  {getWordCount(responses[taskId])} TA SO'Z
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- SAVOLLAR SECTION --- */}
        <section
          className={`
    w-full lg:w-1/2 h-full overflow-y-auto p-6 lg:p-12 bg-[#F3F4F6] border-l border-gray-200 relative custom-scrollbar
    ${activeTab === 'question' ? 'block' : 'hidden lg:block'}
  `}
        >
          <div className="max-w-5xl mx-auto bg-white rounded-[20px] shadow-sm border border-gray-100 p-12 space-y-10 mb-20">
            {/* --- VIZUAL PART 1 --- */}
            <div className="text-center space-y-4">
              <h3 className="text-3xl font-black uppercase">Part 1</h3>
            </div>

            {/* Part 1 uchun umumiy kontekst (Masalan, partNumber 1 yoki 2 dan olinadi) */}
            {exam?.tasks.some((t) => t.partNumber === 1 || t.partNumber === 2) && (
              <>
                <p className="font-bold leading-tight text-xl text-slate-800">
                  {exam.tasks.find((t) => t.partNumber === 1)?.topic ||
                    exam.tasks.find((t) => t.partNumber === 2)?.topic}
                </p>
                <div className="text-lg leading-relaxed text-slate-600 whitespace-pre-wrap">
                  {/* Email matni odatda partNumber 1 yoki 2 ning contextText qismida bo'ladi */}
                  {exam.tasks.find((t) => t.partNumber === 1)?.contextText ||
                    exam.tasks.find((t) => t.partNumber === 2)?.contextText}
                </div>
              </>
            )}

            {/* TASK 1.1 va 1.2 SHU YERDA CHIQADI */}
            <div className="space-y-10">
              {/* Task 1.1 (Backendda partNumber: 1) */}
              {exam?.tasks
                .filter((t) => t.partNumber === 1)
                .map((task) => (
                  <div key={task.id} className="space-y-2">
                    <h4 className="font-black text-xl text-slate-800 uppercase">
                      Task 1.1
                    </h4>
                    <p className="italic text-lg text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {task.instruction}
                      <br />
                      <span className="not-italic font-bold text-slate-500 block mt-2">
                        Write about {task.minWords}-{task.maxWords} words.
                      </span>
                    </p>
                  </div>
                ))}

              {/* Task 1.2 (Backendda partNumber: 2) */}
              {exam?.tasks
                .filter((t) => t.partNumber === 2)
                .map((task) => (
                  <div key={task.id} className="space-y-2">
                    <h4 className="font-black text-xl text-slate-800 uppercase">
                      Task 1.2
                    </h4>
                    <p className="italic text-lg text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {task.instruction}
                      <br />
                      <span className="not-italic font-bold text-slate-500 block mt-2">
                        Write about {task.minWords}-{task.maxWords} words.
                      </span>
                    </p>
                  </div>
                ))}
            </div>

            {/* --- VIZUAL PART 2 (Backendda partNumber: 3) --- */}
            {exam?.tasks
              .filter((t) => t.partNumber === 3)
              .map((task) => (
                <div key={task.id} className="pt-10 border-t space-y-6">
                  <h3 className="text-3xl font-black uppercase text-center mb-6">
                    Part 2
                  </h3>
                  <p className="text-lg leading-relaxed text-slate-800">
                    {task.contextText} <br />
                    <span className="block my-4">
                      The question is: <b>“{task.contextText}”</b>
                    </span>
                    <span className="block italic text-slate-600">
                      {task.instruction}
                    </span>
                    <span className="font-bold block mt-4 text-slate-900 border-l-4 border-blue-500 pl-4">
                      Write {task.minWords}-{task.maxWords} words.
                    </span>
                  </p>
                </div>
              ))}

            {!exam && (
              <div className="text-center py-20 italic text-slate-400">
                Savollar yuklanmoqda...
              </div>
            )}
          </div>
        </section>

        {/* Yozayotganda (isTyping) navigatsiya tugmalari butunlay yashiriladi */}
        <section className="w-1/16">
          <div
            className={`fixed lg:absolute right-6 top-1/2 -translate-y-1/2 lg:flex flex-col gap-5 z-50 transition-all duration-300
                    ${isTyping ? 'max-lg:opacity-0 max-lg:pointer-events-none' : 'flex opacity-100'}
                `}
          >
            {taskOrder.map((id) => (
              <button
                key={id}
                onClick={() => scrollToTask(id)}
                className={`w-15 h-15 rounded-[20px] font-black shadow-lg transition-all flex flex-col items-center justify-center text-center leading-[1.1] tracking-tighter border-4 
                                ${
                                  visibleTask === id
                                    ? 'bg-blue-600 text-white scale-110 border-blue-200 shadow-blue-300'
                                    : 'bg-blue-100 text-blue-400 border-transparent hover:bg-blue-200'
                                }`}
              >
                <span className={visibleTask === id ? 'text-xl' : 'text-lg'}>{id}</span>
                {visibleTask === id && (
                  <span className="text-[10px] uppercase font-black mt-1">task</span>
                )}
              </button>
            ))}
          </div>

          {/* CAMERA */}
          <div className="hidden lg:flex absolute bottom-6 right-8 w-48 h-28 bg-[#22D3EE] rounded-2xl border-4 border-white shadow-2xl items-center justify-center overflow-hidden">
            <Camera className="text-white opacity-20" size={50} />
            <div className="absolute bottom-2 left-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-white uppercase italic tracking-tighter">
                camera
              </span>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
