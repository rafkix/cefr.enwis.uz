"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  Headphones,
  BookOpen,
  Pencil,
  Mic,
  ArrowLeft,
  Clock,
  ChevronRight,
  LayoutDashboard,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"

// SkillCard component optimized for mobile touch and desktop hover
const EnhancedSkillCard = ({ skill, onClick }: { skill: any, onClick: () => void }) => {
  const colors = {
    purple: "hover:border-purple-500/50 bg-purple-50/30 text-purple-600",
    green: "hover:border-green-500/50 bg-green-50/30 text-green-600",
    orange: "hover:border-orange-500/50 bg-orange-50/30 text-orange-600",
    red: "hover:border-red-500/50 bg-red-50/30 text-red-600",
  }

  const iconColors = {
    purple: "bg-purple-600 shadow-purple-200",
    green: "bg-green-600 shadow-green-200",
    orange: "bg-orange-600 shadow-orange-200",
    red: "bg-red-600 shadow-red-200",
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }} // Mobile touch feedback
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-[24px] md:rounded-[32px] border border-slate-100 bg-white p-6 md:p-8 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 ${colors[skill.color as keyof typeof colors]}`}
    >
      <div className="flex items-start justify-between mb-4 md:mb-6">
        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${iconColors[skill.color as keyof typeof iconColors]}`}>
          <skill.icon size={24} className="md:w-7 md:h-7" />
        </div>
        {skill.badge && (
          <span className="px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-slate-900 text-white text-[8px] md:text-[10px] font-black tracking-widest uppercase">
            {skill.badge}
          </span>
        )}
      </div>

      <div className="space-y-1 md:space-y-2">
        <h3 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{skill.title}</h3>
        <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] md:text-xs uppercase tracking-wider">
          <Clock size={14} className="text-slate-400" />
          {skill.time}
        </div>
      </div>

      <div className="mt-6 md:mt-8 flex flex-wrap gap-1.5 md:gap-2">
        {skill.parts.map((part: string) => (
          <span key={part} className="px-2.5 py-1 md:px-3 md:py-1 rounded-lg bg-white border border-slate-100 text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-tighter group-hover:border-slate-200 transition-colors">
            {part}
          </span>
        ))}
      </div>

      <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-slate-50 flex items-center justify-between">
        <span className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-widest">Start Training</span>
        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
          <ChevronRight size={18} />
        </div>
      </div>
    </motion.div>
  )
}

export default function PracticeHomePage() {
  const router = useRouter()

  const skills = [
    {
      title: "Listening FAST",
      time: "00:37:00",
      parts: ["Part 1", "Part 2", "Part 3", "Part 4", "Part 5", "Part 6"],
      icon: Headphones,
      route: "/test/listening",
      badge: "AI Evaluated",
      color: "purple",
    },
    {
      title: "Reading Demo",
      time: "01:00:00",
      parts: ["Part 1", "Part 2", "Part 3", "Part 4", "Part 5"],
      icon: BookOpen,
      route: "/test/reading",
      color: "green",
    },
    {
      title: "Writing Analysis",
      time: "01:00:00",
      parts: ["Task 1.1", "Task 1.2", "Task 2"],
      icon: Pencil,
      route: "/test/writing",
      badge: "Neural Grade",
      color: "orange",
    },
    {
      title: "Speaking Pro",
      time: "00:15:00",
      parts: ["Part 1.1", "Part 1.2", "Part 2", "Part 3"],
      icon: Mic,
      route: "/test/speaking",
      badge: "Live Pitch",
      color: "red",
    },
  ]

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans pb-10 md:pb-20 overflow-x-hidden">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <Button
            variant="ghost"
            className="flex items-center gap-1.5 md:gap-2 text-slate-500 font-bold hover:text-red-600 transition-colors px-2 md:px-4"
            onClick={() => router.push("/")}
          >
            <ArrowLeft size={16} />
            <span className="text-[10px] md:text-[11px] font-black uppercase tracking-widest">Exit Exam</span>
          </Button>

          <div className="flex items-center gap-2 md:gap-3 bg-slate-50 px-3 py-1 md:px-4 md:py-1.5 rounded-full md:rounded-2xl border border-slate-100 shadow-inner">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] text-slate-900">
              Exam Mode Active
            </span>
          </div>

          <div className="w-10 md:w-[100px] hidden sm:block" />
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-10 md:pt-16 pb-6 md:pb-10">
        {/* Background blobs for visual depth - smaller on mobile */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-0 left-1/4 w-32 md:w-64 h-32 md:h-64 bg-red-500/5 blur-[60px] md:blur-[100px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-32 md:w-64 h-32 md:h-64 bg-blue-500/5 blur-[60px] md:blur-[100px] rounded-full" />
        </div>

        <div className="mx-auto max-w-4xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-100 shadow-sm mb-4 md:mb-6"
          >
            <Sparkles size={12} className="text-red-600 fill-red-600" />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-900">Select Module</span>
          </motion.div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-tight mb-4 px-2">
            Skill <span className="text-red-600 italic">Assessment</span>
          </h1>
          <p className="text-slate-500 font-medium text-sm md:text-lg max-w-xl mx-auto italic leading-relaxed px-4">
            Focus on individual CEFR modules to boost your overall band score using our neural algorithms.
          </p>
        </div>
      </section>

      {/* ================= MAIN CONTENT ================= */}
      <main className="mx-auto max-w-6xl px-4 md:px-6 py-6 md:py-10">
        {/* Grid: 1 column on mobile, 2 columns on tablets+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {skills.map((skill) => (
            <EnhancedSkillCard
              key={skill.title}
              skill={skill}
              onClick={() => router.push(skill.route)}
            />
          ))}
        </div>

        {/* ================= FOOTER NOTE ================= */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 md:mt-20 flex flex-col items-center gap-4 md:gap-6 p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-dashed border-slate-200 text-center"
        >
          <LayoutDashboard className="text-slate-200" size={32}/>
          <div className="max-w-md">
            <h4 className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-[0.2em] mb-2">Need a full mock exam?</h4>
            <p className="text-slate-400 text-[10px] md:text-xs font-bold leading-relaxed">
              If you want to simulate a real exam environment with all modules combined, 
              head over to our <span className="text-red-600 underline cursor-pointer decoration-2 underline-offset-4">Full Mock Simulation</span>.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  )
}   