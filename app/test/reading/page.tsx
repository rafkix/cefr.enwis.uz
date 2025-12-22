"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  BookOpen,
  ArrowLeft,
  Clock,
  FileText,
  Lock,
  Search,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { UnlockModal } from "@/components/unlock-modal"

import { READING_TESTS } from "@/lib/reading-tests-data"
import { isTestUnlocked, unlockTest } from "@/lib/test-access"

export default function ReadingPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [unlockedTests, setUnlockedTests] = useState<string[]>([])
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null)
  const [showUnlockModal, setShowUnlockModal] = useState(false)

  useEffect(() => {
    const unlocked = READING_TESTS.filter((t) =>
      isTestUnlocked(t.id, t.isFree)
    ).map((t) => t.id)
    setUnlockedTests(unlocked)
  }, [])

  const handleTestClick = (testId: string) => {
    const test = READING_TESTS.find((t) => t.id === testId)
    if (!test) return

    const isUnlocked = test.isFree || unlockedTests.includes(testId)

    if (isUnlocked) {
      router.push(`/test/reading/${testId}`)
    } else {
      setSelectedTestId(testId)
      setShowUnlockModal(true)
    }
  }

  const handleUnlock = (code: string) => {
    const test = READING_TESTS.find((t) => t.id === selectedTestId)
    if (!test) return

    if (code.toUpperCase() === test.accessCode?.toUpperCase()) {
      unlockTest(test.id)
      setUnlockedTests((prev) => [...prev, test.id])
      setShowUnlockModal(false)
      router.push(`/test/reading/${test.id}`)
    } else {
      alert("Invalid access code")
    }
  }

  const filteredTests = READING_TESTS.filter((test) => {
    const q = search.toLowerCase()
    return (
      test.title.toLowerCase().includes(q) ||
      test.level?.toLowerCase().includes(q)
    )
  })

  const selectedTest = READING_TESTS.find((t) => t.id === selectedTestId)

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans pb-10 md:pb-20 overflow-x-hidden">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="container mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/test")}
              className="text-slate-500 font-black uppercase tracking-widest text-[9px] md:text-[10px] hover:text-green-600 px-2"
            >
              <ArrowLeft className="mr-1 md:mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="h-6 w-px bg-slate-100 hidden xs:block" />
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-green-600 flex items-center justify-center text-white shadow-lg shadow-green-200">
                <BookOpen size={18} className="md:w-5 md:h-5" />
              </div>
              <div className="hidden xxs:block">
                <h1 className="text-sm md:text-lg font-black tracking-tighter uppercase leading-none">
                  Reading <span className="text-green-600 italic">Vault</span>
                </h1>
                <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Library</p>
              </div>
            </div>
          </div>

          <div className="relative hidden md:block w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search passages..."
              className="pl-9 h-10 bg-slate-50/50 border-slate-100 rounded-xl text-xs font-medium focus:ring-green-500/20"
            />
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="px-4 pb-3 md:hidden">
           <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search modules..."
              className="pl-9 h-10 bg-slate-50/50 border-slate-100 rounded-xl text-xs"
            />
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-green-600">
              <ShieldCheck size={14} />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">Verified Content</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black tracking-tighter uppercase leading-tight">Academic <br className="hidden md:block" /> Library.</h2>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
            <span>{filteredTests.length} Units</span>
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-green-600 italic">CEFR Standard</span>
          </div>
        </div>

        {/* ================= TEST GRID ================= */}
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {filteredTests.map((test, index) => {
            const isUnlocked = test.isFree || unlockedTests.includes(test.id)

            return (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  onClick={() => handleTestClick(test.id)}
                  className={`
                    group relative overflow-hidden border-slate-100 p-5 md:p-8 rounded-[24px] md:rounded-[32px] cursor-pointer
                    transition-all duration-300 hover:shadow-xl hover:border-green-200
                    ${!isUnlocked ? 'bg-slate-50/50' : 'bg-white'}
                  `}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight uppercase">
                          {test.title}
                        </h3>
                        {test.isFree ? (
                          <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[8px] font-black uppercase h-5">Open Access</Badge>
                        ) : !isUnlocked ? (
                          <Badge className="bg-red-50 text-red-600 border-red-100 text-[8px] font-black uppercase h-5">Premium</Badge>
                        ) : (
                          <Badge className="bg-blue-50 text-blue-600 border-blue-100 text-[8px] font-black uppercase h-5">Unlocked</Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 md:gap-8">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-slate-400" />
                          <span className="text-[11px] font-bold text-slate-500">{test.durationMinutes} Min</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText size={14} className="text-slate-400" />
                          <span className="text-[11px] font-bold text-slate-500">{test.totalQuestions} Questions</span>
                        </div>
                        <Badge className="bg-slate-900 text-white h-5 text-[9px] font-black uppercase">{test.cefrLevel}</Badge>
                      </div>
                    </div>

                    <div className="shrink-0 pt-2 lg:pt-0">
                      {isUnlocked ? (
                        <Button className="w-full lg:w-auto h-12 md:h-14 px-8 rounded-xl md:rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-widest text-[9px] md:text-[10px] group-hover:scale-105 transition-all shadow-lg shadow-green-100">
                          Enter Passage <ChevronRight size={16} className="ml-2" />
                        </Button>
                      ) : (
                        <Button variant="destructive" className="w-full lg:w-auto h-12 md:h-14 px-8 rounded-xl md:rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-[9px] md:text-[10px] gap-2">
                          <Lock size={14} /> Unlock Module
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {filteredTests.length === 0 && (
          <div className="mt-10 md:mt-20 flex flex-col items-center gap-4 py-16 md:py-20 rounded-[32px] md:rounded-[40px] border-2 border-dashed border-slate-100 text-center">
            <Search size={32} className="text-slate-200" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No matching passages</p>
          </div>
        )}
      </main>

      {/* ================= UNLOCK MODAL ================= */}
      {selectedTest && (
        <UnlockModal
          open={showUnlockModal}
          onOpenChange={setShowUnlockModal}
          onUnlock={handleUnlock}
          testTitle={selectedTest.title}
        />
      )}
    </div>
  )
}