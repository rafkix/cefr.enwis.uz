'use client'

import { useEffect, useState, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronLeft,
  Loader2,
  Calendar,
  Target,
  AlertCircle,
  ArrowLeft,
  Heart,
  CreditCard,
  ExternalLink,
  Brain,
  Download,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Award,
  Layers,
} from 'lucide-react'
import {
  downloadWritingResultPdfAPI,
  getWritingResultDetailAPI,
} from '@/lib/api/writing'

// --- TYPES ---
interface WritingCriteria {
  taskAchievement: number
  grammar: number
  vocabulary: number
  coherence: number
  mechanics: number
}

interface EvaluationDetail {
  score: number
  wordCount: number
  feedback: string
  criteria: WritingCriteria
  suggestions: string[]
}

interface WritingResultData {
  id: number
  userId: number
  examId: string
  overallScore: number
  rawScore: number
  evaluations: Record<string, EvaluationDetail>
  userResponses: Record<string, string>
  createdAt: string
}

export default function WritingResultPage() {
  const searchParams = useSearchParams()
  const resultId = searchParams.get('id')
  const router = useRouter()

  const [data, setData] = useState<WritingResultData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [visibleFeedbacks, setVisibleFeedbacks] = useState<Record<string, boolean>>({})

  useEffect(() => {
    async function fetchResult() {
      if (!resultId) return
      try {
        setLoading(true)
        const res = await getWritingResultDetailAPI(Number(resultId))
        const result = res?.data ?? res
        if (result && result.evaluations) {
          setData(result)
        } else {
          setError(true)
        }
      } catch (err) {
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchResult()
  }, [resultId])

  // --- PDF YUKLASH FUNKSIYASI ---
  const downloadPDF = async () => {
    if (!data) return
    setIsDownloading(true)

    try {
      const response = await downloadWritingResultPdfAPI(data.id)

      // Blob yaratish
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)

      // Dinamik fayl nomi: TestName_UserID_ResultID.pdf
      const fileName = `${data.examId}_user${data.userId}_res${data.id}.pdf`

      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()

      // Tozalash
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      console.error('PDF Download Error:', err)
      alert(
        'PDF yuklashda xatolik yuz berdi. Backendda CORS yoki ruxsat sozlamalarini tekshiring.'
      )
    } finally {
      setIsDownloading(false)
    }
  }

  const toggleFeedback = (key: string) => {
    setVisibleFeedbacks((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const evalKeys = useMemo(
    () => (data ? Object.keys(data.evaluations).sort() : []),
    [data]
  )

  const formatTaskName = (key: string) => {
    if (key === 'task1.1') return 'Part 1 (Task 1.1)'
    if (key === 'task1.2') return 'Part 1 (Task 1.2)'
    if (key === 'task2') return 'Part 2'
    return key.toUpperCase()
  }

  if (loading) return <LoadingSpinner />
  if (error || !data) return <ErrorView router={router} />

  return (
    <div className="max-w-5xl mx-auto pb-32 px-4 pt-8">
      {/* Navigation & Actions */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-400 hover:text-orange-600 font-bold text-[10px] uppercase tracking-[0.2em] transition-colors"
        >
          <ChevronLeft size={16} /> Orqaga qaytish
        </button>
        <button
          onClick={downloadPDF}
          disabled={isDownloading}
          className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl ${
            isDownloading
              ? 'bg-slate-700 text-slate-300 cursor-not-allowed'
              : 'bg-slate-900 text-white hover:bg-orange-600 active:scale-95'
          }`}
        >
          {isDownloading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Tayyorlanmoqda...
            </>
          ) : (
            <>
              <Download size={14} />
              PDF Hisobot
            </>
          )}
        </button>
      </div>

      {/* Header Section */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl overflow-hidden">
        <div className="bg-slate-900 p-8 sm:p-10 text-white relative">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
            <div className="text-center md:text-left">
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 mb-4">
                <span className="bg-orange-500 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider">
                  AI Evaluation System
                </span>
                <span className="bg-white/10 px-3 py-1 rounded-lg text-[9px] font-black uppercase flex items-center gap-1">
                  <Calendar size={10} className="text-orange-400" />{' '}
                  {new Date(data.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tighter mb-2 uppercase italic leading-none">
                Writing <span className="text-orange-500">Report</span>
              </h1>
              <p className="text-slate-400 font-medium text-xs tracking-widest uppercase">
                EXAM ID: <span className="text-white font-mono">{data.examId}</span>
              </p>
            </div>
            <div className="flex items-center gap-6 bg-white/5 p-6 rounded-[35px] border border-white/10">
              <div className="text-center px-4 border-r border-white/10">
                <p className="text-[9px] font-black uppercase opacity-60 mb-1 tracking-widest">
                  Raw Score
                </p>
                <p className="text-3xl font-black">{data.rawScore}</p>
              </div>
              <div className="text-center">
                <p className="text-[9px] font-black uppercase text-orange-400 mb-1 tracking-widest">
                  Band
                </p>
                <p className="text-6xl font-black text-white">{data.overallScore}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100 bg-white">
          <StatItem
            icon={<Layers size={18} className="text-orange-500" />}
            label="Task Count"
            value={evalKeys.length}
          />
          <StatItem
            icon={<Brain size={18} className="text-blue-500" />}
            label="Analysis"
            value="Smart AI"
          />
          <StatItem
            icon={<Target size={18} className="text-emerald-500" />}
            label="Status"
            value="Done"
          />
          <StatItem
            icon={<Award size={18} className="text-rose-500" />}
            label="Level"
            value="B2/C1"
          />
        </div>
      </div>

      {/* User Responses List */}
      <div className="space-y-12 py-10">
        {evalKeys.map((key, index) => {
          const task = data.evaluations[key]
          const isFeedbackVisible = visibleFeedbacks[key]
          const responseMapping: Record<string, string> = {
            'task1.1': '1',
            'task1.2': '2',
            task2: '3',
          }
          const userText =
            data.userResponses[responseMapping[key]] ||
            data.userResponses[key] ||
            'Javob topilmadi.'

          return (
            <div
              key={key}
              className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden transition-all"
            >
              <div className="p-8 sm:p-10 relative">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex flex-col items-center justify-center font-black">
                      <span className="text-[8px] opacity-50">TASK</span>
                      <span className="text-lg">0{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">
                        {formatTaskName(key)}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {task.wordCount} words
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFeedback(key)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md ${
                      isFeedbackVisible
                        ? 'bg-orange-600 text-white'
                        : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                    }`}
                  >
                    <Brain size={14} />{' '}
                    {isFeedbackVisible ? 'Hide Analysis' : 'Show AI Feedback'}
                    {isFeedbackVisible ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-orange-100 rounded-full"></div>
                  <p className="text-slate-600 text-base leading-[1.8] font-medium whitespace-pre-wrap pl-6">
                    {userText}
                  </p>
                </div>
              </div>

              {isFeedbackVisible && (
                <div className="bg-slate-50 border-t border-slate-100 p-8 sm:p-10 animate-in slide-in-from-top-4 duration-500">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-6">
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <Sparkles size={14} className="text-orange-500" /> AI Detailed
                        Feedback
                      </div>
                      <div className="bg-white p-8 rounded-[32px] shadow-sm border border-orange-100 text-slate-700 text-sm italic leading-relaxed">
                        "{task.feedback}"
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between font-black text-[10px] text-slate-400 uppercase tracking-widest">
                        <span>Criteria Scores</span>
                        <span className="bg-slate-900 text-white px-2 py-1 rounded text-xs">
                          Band {task.score}
                        </span>
                      </div>
                      <div className="bg-white p-6 rounded-[32px] border border-slate-100 space-y-5">
                        {Object.entries(task.criteria).map(([name, val]) => (
                          <div key={name}>
                            <div className="flex justify-between text-[9px] font-black uppercase mb-1.5 px-1 text-slate-500">
                              <span>{name.replace(/([A-Z])/g, ' $1')}</span>
                              <span className="text-slate-900">{val}/9</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-orange-500"
                                style={{ width: `${(val / 9) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Donation Card */}
      <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center animate-pulse">
            <Heart className="text-rose-500 fill-rose-500" size={24} />
          </div>
          <div>
            <h4 className="font-black text-slate-800 leading-tight uppercase text-sm">
              Loyiha rivojiga hissa qo'shing
            </h4>
            <p className="text-xs text-slate-400 font-medium">
              Sizning qo'llab-quvvatlovingiz biz uchun muhim
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 flex items-center gap-4 group hover:border-orange-400 transition-all">
            <CreditCard className="text-orange-500" size={24} />
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-slate-400 uppercase mb-1">
                Uzcard
              </span>
              <span className="text-sm font-mono font-black text-slate-700">
                6262 5708 0051 9183
              </span>
              <span className="text-[10px] text-slate-500 font-bold mt-1">
                Diyorbek Abdumutlalibov
              </span>
            </div>
          </div>
          <Link
            href="https://idonate.uz/d/rafkix"
            target="_blank"
            className="bg-orange-700 px-6 py-4 rounded-2xl flex items-center justify-center gap-3 text-white font-black uppercase text-xs tracking-widest hover:bg-orange-500 transition-all shadow-lg group"
          >
            <span>Donat qilish (iDonate)</span>
            <ExternalLink
              size={16}
              className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </div>
  )
}

// --- SUB COMPONENTS ---

function LoadingSpinner() {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center">
      <Loader2 className="w-14 h-14 animate-spin text-orange-600 mb-6" />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">
        AI Writing Analysis...
      </p>
    </div>
  )
}

function ErrorView({ router }: { router: any }) {
  return (
    <div className="h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-6" />
        <h2 className="text-2xl font-black text-slate-900 uppercase mb-4">
          Ma'lumot topilmadi
        </h2>
        <button
          onClick={() => router.push('/dashboard/results')}
          className="bg-orange-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 mx-auto hover:bg-orange-600 transition-colors"
        >
          <ArrowLeft size={20} /> Orqaga qaytish
        </button>
      </div>
    </div>
  )
}

function StatItem({ icon, label, value }: { icon: any; label: string; value: any }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center hover:bg-slate-50 transition-colors">
      <div className="mb-3 opacity-90">{icon}</div>
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">
        {label}
      </span>
      <span className="text-xl font-black text-slate-900 tracking-tighter italic">
        {value}
      </span>
    </div>
  )
}
