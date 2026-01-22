"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Mic,
  ArrowLeft,
  Clock,
  Search,
  Sparkles,
  ChevronRight,
  Lock,
  Radio,
  BarChart3,
  Waves
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { UnlockModal } from "@/components/UnlockModal"

const speakingTests = [
  { id: "sp-1", title: "Daily Life & Routines", level: "B1/B2", duration: "12-15", parts: 3, isFree: true },
  { id: "sp-2", title: "Global Environment AI", level: "C1", duration: "15-18", parts: 3, isFree: false },
]

export default function SpeakingPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null)

  const filteredTests = speakingTests.filter((test) =>
    test.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleTestClick = (testId: string, isFree: boolean) => {
    if (isFree) {
      router.push(`/test/speaking/${testId}`)
    } else {
      setSelectedTestId(testId)
      setShowUnlockModal(true)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans pb-10 md:pb-20 overflow-x-hidden">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="container mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/test")}
              className="text-slate-500 font-black uppercase tracking-widest text-[9px] md:text-[10px] hover:text-red-600 px-2"
            >
              <ArrowLeft className="mr-1 md:mr-2 h-4 w-4" />
              Back
            </Button>
            <div className="h-6 w-px bg-slate-100 hidden xs:block" />
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-200">
                <Mic size={18} className="md:w-5 md:h-5" />
              </div>
              <div className="hidden xxs:block">
                <h1 className="text-sm md:text-lg font-black tracking-tighter uppercase leading-none">
                  Speaking <span className="text-red-600 italic">Lab</span>
                </h1>
                <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Voice AI</p>
              </div>
            </div>
          </div>

          <div className="relative hidden md:block w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search topics..."
              className="pl-9 h-10 bg-slate-50/50 border-slate-100 rounded-xl text-xs font-medium focus:ring-red-500/20"
            />
          </div>
        </div>
        {/* Mobile Search */}
        <div className="px-4 pb-3 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search topics..."
              className="pl-9 h-10 bg-slate-50/50 border-slate-100 rounded-xl text-xs"
            />
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-5xl">
        {/* HERO TITLE */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-600">
              <Radio size={16} className="animate-pulse" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">Assessment Engine</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-[0.95]">
              Master <br /> Your <span className="text-red-600">Voice.</span>
            </h2>
          </div>
          <div className="hidden lg:flex items-center gap-8 bg-white border border-slate-100 p-4 rounded-3xl shadow-sm">
            <div className="text-center px-4 border-r border-slate-50">
               <p className="text-[9px] font-black text-slate-400 uppercase">Latency</p>
               <p className="text-xs font-black text-emerald-500 tracking-tighter">{"< 200ms"}</p>
            </div>
            <div className="text-center px-4">
               <p className="text-[9px] font-black text-slate-400 uppercase">AI Grade</p>
               <p className="text-xs font-black text-slate-900 tracking-tighter">Precision</p>
            </div>
          </div>
        </div>

        {/* LIST OF TESTS */}
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {filteredTests.map((test, index) => {
            const isLocked = !test.isFree
            return (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  onClick={() => handleTestClick(test.id, test.isFree)}
                  className={`
                    group relative overflow-hidden border-slate-100 p-5 md:p-8 rounded-[24px] md:rounded-[36px] cursor-pointer
                    transition-all duration-300 hover:shadow-xl hover:border-red-200
                    ${isLocked ? 'bg-slate-50/50' : 'bg-white'}
                  `}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1 space-y-4 md:space-y-5">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg md:text-2xl font-black text-slate-900 tracking-tight uppercase">
                          {test.title}
                        </h3>
                        {test.isFree ? (
                          <Badge className="bg-emerald-500 text-white text-[8px] font-black tracking-widest border-none">OPEN</Badge>
                        ) : (
                          <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-900 text-white text-[8px] font-black uppercase">
                            <Lock size={8} /> PRO
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-4 md:gap-8">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-slate-400" />
                          <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">Duration</p>
                            <p className="text-[11px] font-bold text-slate-700">{test.duration}m</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <BarChart3 size={14} className="text-slate-400" />
                          <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">Level</p>
                            <p className="text-[11px] font-bold text-slate-700">{test.level}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Waves size={14} className="text-slate-400" />
                          <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase leading-none mb-1">Format</p>
                            <p className="text-[11px] font-bold text-slate-700">{test.parts} Parts</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 pt-2 lg:pt-0">
                      {isLocked ? (
                        <Button className="w-full lg:w-auto h-12 md:h-16 px-6 md:px-10 rounded-xl md:rounded-[24px] bg-slate-900 text-white font-black uppercase tracking-widest text-[9px] md:text-[10px] gap-2">
                          Unlock <ChevronRight size={14} />
                        </Button>
                      ) : (
                        <Button className="w-full lg:w-auto h-12 md:h-16 px-6 md:px-10 rounded-xl md:rounded-[24px] bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-[9px] md:text-[10px] group-hover:scale-105 transition-all shadow-lg shadow-red-100">
                          Start Session <ChevronRight size={14} className="ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </main>

      {selectedTestId && (
        <UnlockModal
          open={showUnlockModal}
          onClose={() => setShowUnlockModal(false)}
          testId={selectedTestId}
          testType="speaking"
        />
      )}
    </div>
  )
}