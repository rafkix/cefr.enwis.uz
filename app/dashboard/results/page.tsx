'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calendar,
  CheckCircle2,
  Loader2,
  FileText,
  Headphones,
  BookOpen,
  Activity,
  Trophy,
  Target,
  ArrowUpRight,
  PenTool,
} from 'lucide-react'

// API xizmatlari
import { getMyListeningResultsAPI } from '@/lib/api/listening'
import { getMyReadingResultsAPI } from '@/lib/api/reading'
import { getMyWritingResultsAPI } from '@/lib/api/writing'

// --- TYPES ---
type Section = 'LISTENING' | 'READING' | 'WRITING'
type ActiveTab = 'all' | 'listening' | 'reading' | 'writing'

interface ResultItem {
  id: string
  exam_id: string
  section: Section
  created_at: string
  raw_score: number
  total_questions: number
  cefr_level: string
  standard_score: number // 75 ball shkalasi (yoki writing scaled_score)
}

// --- HELPERS ---
const safeArray = (res: any) => {
  if (Array.isArray(res)) return res
  if (Array.isArray(res?.data)) return res.data
  return []
}

const toNum = (v: any, fallback = 0) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

const parseDate = (s: string) => {
  const t = new Date(s).getTime()
  return Number.isFinite(t) ? t : 0
}

const formatDate = (dateString: string) => {
  if (!dateString) return '—'
  try {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return '—'
  }
}

const getTheme = (section: Section) => {
  switch (section) {
    case 'READING':
      return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', icon: BookOpen }
    case 'LISTENING':
      return { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', icon: Headphones }
    default:
      return { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', icon: PenTool }
  }
}

const getLevelStyle = (level: string) => {
  const l = (level || '').toUpperCase()
  if (l.includes('C1')) return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' }
  if (l.includes('B2')) return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' }
  if (l.includes('B1')) return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' }
  if (l.includes('A2')) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' }
  if (l.includes('A1')) return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' }
  return { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200' }
}

/**
 * ✅ DEDUPE:
 * - mode = 'latest': har bir (section+exam_id) bo‘yicha faqat eng oxirgi natijani qoldiradi
 * - mode = 'all': hammasini ko‘rsatadi
 */
const dedupeLatest = (items: ResultItem[]) => {
  const m = new Map<string, ResultItem>()
  for (const r of items) {
    const key = `${r.section}-${r.exam_id}`
    const prev = m.get(key)
    if (!prev || parseDate(r.created_at) > parseDate(prev.created_at)) m.set(key, r)
  }
  return Array.from(m.values())
}

export default function ResultPage() {
  const [results, setResults] = useState<ResultItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<ActiveTab>('all')

  // UI uchun: xohlasang "latest" qoldiramiz. "all" bo‘lsa attempt history ko‘rinasan.
  const [mode, setMode] = useState<'latest' | 'all'>('latest')

  useEffect(() => {
    const fetchAllResults = async () => {
      try {
        setLoading(true)

        const [listeningRes, readingRes, writingRes] = await Promise.all([
          getMyListeningResultsAPI().catch(() => ({ data: [] })),
          getMyReadingResultsAPI().catch(() => ({ data: [] })),
          getMyWritingResultsAPI().catch(() => ({ data: [] })),
        ])

        const rawListening = safeArray(listeningRes)
        const rawReading = safeArray(readingRes)
        const rawWriting = safeArray(writingRes)

        const listening: ResultItem[] = rawListening.map((item: any) => ({
          id: String(item.id ?? item.result_id ?? ''),
          exam_id: String(item.test_id ?? item.exam_id ?? "Noma'lum"),
          section: 'LISTENING',
          created_at: String(item.created_at ?? item.createdAt ?? ''),
          raw_score: toNum(item.raw_score, 0),
          total_questions: 35,
          cefr_level: String(item.cefr_level ?? '—'),
          standard_score: Math.round(toNum(item.standard_score, 0)),
        }))

        const reading: ResultItem[] = rawReading.map((item: any) => ({
          id: String(item.id ?? item.result_id ?? ''),
          exam_id: String(item.test_id ?? item.exam_id ?? "Noma'lum"),
          section: 'READING',
          created_at: String(item.created_at ?? item.createdAt ?? ''),
          raw_score: toNum(item.raw_score, 0),
          total_questions: 35,
          cefr_level: String(item.cefr_level ?? '—'),
          standard_score: Math.round(toNum(item.standard_score, 0)),
        }))

        // ✅ MUHIM: Writing mapping backend formatiga mos!
        const writing: ResultItem[] = rawWriting.map((item: any) => ({
          id: String(item.id ?? ''),
          exam_id: String(item.exam_id ?? 'Writing Test'),
          section: 'WRITING',
          created_at: String(item.created_at ?? ''),
          raw_score: toNum(item.raw_score, 0),
          total_questions: Array.isArray(item.answers) ? item.answers.length : 40, // hozir 3 ta task bo‘lishi mumkin
          cefr_level: String(item.cefr_level ?? '—'),
          standard_score: Math.round(toNum(item.scaled_score, 0)), // 75 ball shkaladagi natija shu bo‘lsin
        }))

        const combined = [...listening, ...reading, ...writing].filter((x) => x.id)

        // sort latest first
        combined.sort((a, b) => parseDate(b.created_at) - parseDate(a.created_at))

        setResults(combined)
      } catch (error) {
        console.error("Ma'lumotlarni yuklashda xatolik:", error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    fetchAllResults()
  }, [])

  const viewResults = useMemo(() => {
    const base = mode === 'latest' ? dedupeLatest(results) : results
    const filtered = base.filter((item) =>
      activeTab === 'all' ? true : item.section.toLowerCase() === activeTab
    )
    return filtered
  }, [results, activeTab, mode])

  const totalAttempts = useMemo(() => viewResults.length, [viewResults])

  const avgScore = useMemo(() => {
    if (!viewResults.length) return 0
    const sum = viewResults.reduce((acc, curr) => acc + (curr.standard_score || 0), 0)
    return Math.round(sum / viewResults.length)
  }, [viewResults])

  const sectionCounts = useMemo(() => {
    const counts: Record<Section, number> = { LISTENING: 0, READING: 0, WRITING: 0 }
    for (const r of viewResults) counts[r.section]++
    return counts
  }, [viewResults])

  const totalForPercent = totalAttempts || 1

  return (
    <div className="min-h-screen pb-10 font-sans text-slate-800 pt-6 bg-slate-50/30">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* --- NATIJALAR RO'YXATI --- */}
          <div className="xl:col-span-3 space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Natijalar</h2>
                  <p className="text-sm text-slate-500 font-medium">Imtihon topshirish tarixingiz</p>
                </div>

                <div className="flex gap-2 items-center">
                  {/* Mode toggle: latest vs all */}
                  <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
                    {[
                      { key: 'latest', label: "Oxirgisi" },
                      { key: 'all', label: "Hammasi" },
                    ].map((m) => (
                      <button
                        key={m.key}
                        onClick={() => setMode(m.key as any)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all
                          ${mode === m.key ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}
                        `}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {/* Tabs */}
                  <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
                    {(['all', 'listening', 'reading', 'writing'] as ActiveTab[]).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap
                          ${
                            activeTab === tab
                              ? 'bg-slate-900 text-white shadow-md'
                              : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                          }`}
                      >
                        {tab === 'all' ? 'Barchasi' : tab}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100">
                  <Loader2 className="animate-spin text-slate-400 w-8 h-8 mb-2" />
                  <span className="text-xs font-medium text-slate-400">Natijalar yuklanmoqda...</span>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {viewResults.length > 0 ? (
                    viewResults.map((item, index) => {
                      const theme = getTheme(item.section)
                      const levelStyle = getLevelStyle(item.cefr_level)
                        
                      return (
                        <motion.div
                          layout
                          key={`${item.section}-${item.id}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ delay: index * 0.03 }}
                          className="group bg-white rounded-[20px] p-5 border border-slate-100 hover:border-slate-300 shadow-sm hover:shadow-md transition-all"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                            <div className="flex items-center gap-5 flex-1 min-w-0 w-full">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${theme.bg} ${theme.text}`}>
                                <theme.icon size={24} />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase">
                                    #{item.exam_id}
                                  </span>
                                  <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                    <Calendar size={12} /> {formatDate(item.created_at)}
                                  </span>
                                </div>

                                <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
                                  {item.section} TEST
                                </h3>
                              </div>
                            </div>

                            <div className="hidden md:flex flex-col items-center px-6 border-l border-slate-100 shrink-0">
                              <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                                {item.section === 'WRITING' ? 'Writing Ball' : "To'g'ri javoblar"}
                              </span>
                              <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                                <CheckCircle2 size={16} className="text-emerald-500" />
                                {item.raw_score} / {item.total_questions}
                              </span>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto border-t sm:border-t-0 border-slate-100 pt-4 sm:pt-0">
                              <div className="text-right min-w-[60px]">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Ball</p>
                                <p className={`text-xl font-black ${theme.text}`}>{item.standard_score}</p>
                              </div>

                              <div
                                className={`flex items-center justify-center w-20 h-10 rounded-xl border font-bold text-sm ${levelStyle.bg} ${levelStyle.text} ${levelStyle.border}`}
                              >
                                {item.cefr_level || '—'}
                              </div>

                              <Link
                                href={`/dashboard/results/${item.section.toLowerCase()}/view?id=${item.id}`}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-900 hover:text-white transition-all"
                              >
                                <ArrowUpRight size={20} />
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )
                    })
                  ) : (
                    <div className="text-center py-20 bg-white rounded-[24px] border border-dashed border-slate-300">
                      <FileText size={40} className="mx-auto mb-4 text-slate-200" />
                      <p className="text-slate-500 font-medium">Hozircha ushbu bo'limda natijalar mavjud emas</p>
                    </div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* --- STATISTIKA PANEL --- */}
          <div className="xl:col-span-1 space-y-6">
            <div className="sticky top-8 space-y-6">
              <div className="bg-slate-900 rounded-[24px] p-6 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <Activity size={20} />
                    </div>
                    <span className="font-bold text-sm">Umumiy statistika</span>
                  </div>

                  <div className="space-y-5">
                    <div className="flex justify-between items-center border-b border-white/10 pb-4">
                      <p className="text-slate-400 text-xs font-medium">Jami urinishlar</p>
                      <p className="text-2xl font-bold flex items-center gap-2">
                        <Trophy size={18} className="text-yellow-500" /> {totalAttempts}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-slate-400 text-xs font-medium">O'rtacha natija</p>
                      <p className="text-2xl font-bold flex items-center gap-2">
                        <Target size={18} className="text-blue-400" /> {avgScore}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
              </div>

              <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-6">
                  Bo'limlar bo'yicha faollik
                </h3>

                <div className="space-y-6">
                  {[
                    { label: 'Reading', type: 'READING' as const, icon: BookOpen, color: 'bg-blue-500', iconColor: 'text-blue-500' },
                    { label: 'Listening', type: 'LISTENING' as const, icon: Headphones, color: 'bg-purple-500', iconColor: 'text-purple-500' },
                    { label: 'Writing', type: 'WRITING' as const, icon: PenTool, color: 'bg-orange-500', iconColor: 'text-orange-500' },
                  ].map((stat) => {
                    const count = sectionCounts[stat.type]
                    const percent = (count / totalForPercent) * 100

                    return (
                      <div key={stat.label}>
                        <div className="flex justify-between mb-2 text-sm">
                          <span className="font-medium text-slate-600 flex items-center gap-2">
                            <stat.icon size={16} className={stat.iconColor} /> {stat.label}
                          </span>
                          <span className="font-bold text-slate-900">{count}</span>
                        </div>

                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            className={`${stat.color} h-full`}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Kichik eslatma: mode */}
              <div className="bg-white p-5 rounded-[20px] border border-slate-200 text-xs text-slate-500">
                <p className="font-bold text-slate-700 mb-1">Eslatma</p>
                <p>
                  <span className="font-semibold">Oxirgisi</span> — har bir test uchun eng so‘nggi natija.
                  <br />
                  <span className="font-semibold">Hammasi</span> — barcha urinishlar (attempt history).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}