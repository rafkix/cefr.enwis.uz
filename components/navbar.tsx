"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown, BookOpen, Mic, Headset, PenTool, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isExamOpen, setIsExamOpen] = useState(false)

  // Simplified existing links
  const links = [
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
  ]

  // Exam sub-modules
  const examModules = [
    { name: "Listening", icon: Headset, desc: "Audio comprehension", href: "/test/listening" },
    { name: "Reading", icon: BookOpen, desc: "Text analysis", href: "/test/reading" },
    { name: "Writing", icon: PenTool, desc: "AI-graded essays", href: "/test/writing" },
    { name: "Speaking", icon: Mic, desc: "Voice recognition", href: "/test/speaking" },
  ]

  return (
    <header className="fixed top-0 w-full z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-red-500/20 group-hover:rotate-6 transition-transform">
            E
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">
            ENWIS <span className="text-red-600">AI</span>
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          {/* CEFR EXAM DROPDOWN */}
          <div 
            className="relative"
            onMouseEnter={() => setIsExamOpen(true)}
            onMouseLeave={() => setIsExamOpen(false)}
          >
            <button className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${isExamOpen ? "text-red-600" : "text-slate-500"}`}>
              CEFR Exam <ChevronDown size={14} className={`transition-transform duration-300 ${isExamOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {isExamOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full -left-4 pt-4 w-72"
                >
                  <div className="bg-white border border-slate-100 rounded-3xl shadow-2xl shadow-slate-200/50 p-3 grid gap-1">
                    {examModules.map((module) => (
                      <Link 
                        key={module.name}
                        href={module.href}
                        className="flex items-center gap-4 p-4 rounded-2xl hover:bg-red-50 group transition-all"
                      >
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:text-red-600 shadow-sm transition-colors">
                          <module.icon size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{module.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{module.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${
                pathname === link.href ? "text-red-600" : "text-slate-500 hover:text-red-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA BUTTONS */}
        <div className="hidden md:flex items-center gap-3">
          <Button 
            variant="ghost" 
            className="text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-red-600"
            onClick={() => router.push("/auth/login")}
          >
            Sign In
          </Button>
          <Button 
            className="bg-slate-900 text-white hover:bg-red-600 rounded-xl px-6 h-11 text-[11px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 transition-all active:scale-95"
            onClick={() => router.push("/test")}
          >
            Get Started
          </Button>
        </div>

        {/* MOBILE TOGGLE */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* MOBILE MENU PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-20 inset-x-0 bg-white border-b border-slate-100 overflow-hidden md:hidden"
          >
            <div className="p-6 space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Exam Modules</p>
                <div className="grid grid-cols-2 gap-4">
                  {examModules.map((m) => (
                    <Link key={m.name} href={m.href} onClick={() => setIsOpen(false)} className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-50">
                      <m.icon size={20} className="text-red-600" />
                      <span className="text-sm font-black">{m.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Company</p>
                <div className="flex flex-col gap-4">
                  {links.map((link) => (
                    <Link key={link.label} href={link.href} onClick={() => setIsOpen(false)} className="text-xl font-black text-slate-900">
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                <Button className="w-full h-14 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest" onClick={() => { setIsOpen(false); router.push("/test"); }}>
                  Start Free Test
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}