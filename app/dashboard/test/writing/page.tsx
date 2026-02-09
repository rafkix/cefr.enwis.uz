"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Pencil,
  ArrowLeft,
  Clock,
  FileText,
  Lock,
  Search,n
  Sparkles,
  ChevronRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { UnlockModal } from "@/components/UnlockModal"

// writingSets ma'lumotlari lib papkasidan olinadi
import { writingSets } from "@/lib/exams/writing/data"

export default function WritingPage() {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [showUnlock, setShowUnlock] = useState(false)
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null)

  const filteredTests = writingSets.filter((test) =>
    test.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleOpenTest = (id: string, isFree: boolean) => {
    if (isFree) {
      router.push(`/test/writing/${id}`)
    } else {
      setSelectedTestId(id)
      setShowUnlock(true)
    }
  }

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
              className="text-slate-500 font-black uppercase tracking-widest text-[9px] md:text-[10px] hover:text-orange-600 px-2"
            >
              <ArrowLeft className="mr-1 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
              Back
            </Button>
            
            <div className="h-6 md:h-8 w-px bg-slate-100 hidden xs:block" />
            
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-lg">
                <Pencil size={16} className="md:w-5 md:h-5" />
              </div>
              <div className="hidden xxs:block">
                <h1 className="text-sm md:text-lg font-black tracking-tighter uppercase leading-none">
                  Writing <span className="text-orange-600 italic">Lab</span>
                </h1>
                <p className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Ready</p>
              </div>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="relative hidden md:block w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter tests..."
              className="pl-9 h-10 bg-slate-50/50 border-slate-100 rounded-xl text-xs font-medium"
            />
          </div>
        </div>

        {/* Mobile Search Bar - Only visible on small screens */}
        <div className="px-4 pb-3 md:hidden">
           <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search writing modules..."
              className="pl-9 h-10 bg-slate-50/50 border-slate-100 rounded-xl text-xs font-medium"
            />
          </div>
        </div>
      </header>

      {/* ================= CONTENT ================= */}
      <main className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-orange-600">
              <Sparkles size={14} fill="currentColor" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">Curated Modules</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black tracking-tighter uppercase leading-tight">
              Practice <br className="hidden md:block" /> Sessions.
            </h2>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
            <span>{filteredTests.length} Units</span>
            <div className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="text-orange-600 italic">CEFR Standard</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {filteredTests.map((test, index) => {
            const isLocked = !test.isFree

            return (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  onClick={() => handleOpenTest(test.id, test.isFree)}
                  className={`
                    group relative overflow-hidden border-slate-100 p-5 md:p-8 rounded-[24px] md:rounded-[32px] cursor-pointer
                    transition-all duration-300 hover:shadow-xl hover:border-orange-200
                    ${isLocked ? 'bg-slate-50/50' : 'bg-white'}
                  `}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight uppercase">
                          {test.title}
                        </h3>
                        {test.isFree ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100 text-[8px] font-black uppercase">Free</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-100 text-[8px] font-black uppercase tracking-tighter">Premium</Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4 md:gap-6">
                        <div className="flex items-center gap-2">
                          <Clock size={14} className="text-slate-400" />
                          <span className="text-[11px] font-bold text-slate-500 uppercase">{test.durationMinutes} Min</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText size={14} className="text-slate-400" />
                          <span className="text-[11px] font-bold text-slate-500 uppercase">{test.tasks.length} Tasks</span>
                        </div>
                        <Badge className="bg-slate-900 text-white h-5 text-[9px] font-black">{test.cefrLevel}</Badge>
                      </div>
                    </div>

                    <div className="shrink-0 pt-2 lg:pt-0">
                      {isLocked ? (
                        <Button variant="outline" className="w-full lg:w-auto h-12 md:h-14 px-6 md:px-8 rounded-xl md:rounded-2xl border-slate-200 text-slate-400 font-black uppercase tracking-widest text-[9px] md:text-[10px] gap-2">
                          <Lock size={14} /> Unlock Access
                        </Button>
                      ) : (
                        <Button className="w-full lg:w-auto h-12 md:h-14 px-6 md:px-8 rounded-xl md:rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest text-[9px] md:text-[10px] group-hover:translate-x-1 transition-all">
                          Start Session <ChevronRight size={16} className="ml-2" />
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
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No matching results</p>
          </div>
        )}
      </main>

      {/* Unlock Modal remains same */}
      {selectedTestId && (
        <UnlockModal
          isOpen={showUnlock}
          onClose={() => setShowUnlock(false)}
          testId={selectedTestId}
          testType="writing"
        />
      )}
    </div>
  )
}