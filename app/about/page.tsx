"use client"

import React from "react"
import { motion } from "framer-motion"
import { 
  Target, Users, BookOpen, TrendingUp, Sparkles, 
  CheckCircle2, ShieldCheck, Globe2, Rocket, 
  Cpu, BarChart3, Fingerprint 
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "CEFR Alignment",
      description: "Assessment engine calibrated to international CEFR descriptors from A1 to C1 levels.",
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      icon: Users,
      title: "Inclusive Access",
      description: "Empowering learners across Uzbekistan with fair and accessible evaluation tools.",
      color: "text-red-600",
      bg: "bg-red-50",
    },
    {
      icon: BookOpen,
      title: "Academic Integrity",
      description: "Tasks engineered using modern psychometric methodologies and exam structures.",
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      icon: TrendingUp,
      title: "Growth Analytics",
      description: "Actionable feedback that transforms scores into a roadmap for mastery.",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
  ]

  return (
    <div className="min-h-screen bg-[#FDFDFF] selection:bg-red-100 selection:text-red-600 overflow-x-hidden">
      <Navbar />

      <main className="pt-20 md:pt-28">
        {/* ================= 1. HERO SECTION ================= */}
        <section className="py-12 md:py-20 overflow-hidden relative border-b border-slate-50">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center lg:text-left"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 mb-5">
                  <Sparkles className="w-3 h-3 text-red-600 fill-red-600" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-red-700">Our Mission</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-[1.1] md:leading-[0.95]">
                  Defining the standard of <br className="hidden md:block" />
                  <span className="text-red-600 italic">English Excellence.</span>
                </h1>

                <p className="text-base md:text-lg text-slate-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
                  The ENWIS Multi-Level ecosystem provides a transparent, fair, and globally recognized assessment system for modern learners.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-lg mx-auto lg:mx-0">
                  {["Objective AI Scoring", "Real-world Tasks", "Instant Analytics", "Global Standards"].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center text-white shrink-0">
                         <CheckCircle2 size={12} />
                      </div>
                      <span className="text-slate-900 font-bold text-xs md:text-sm uppercase tracking-tight">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* IMAGE CONTAINER - Moslashuvchan o'lcham */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative flex justify-center lg:justify-end"
              >
                <div className="relative h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] lg:h-[450px] lg:w-[450px]">
                  <div className="absolute inset-0 bg-gradient-to-tr from-red-600 to-orange-400 rounded-[40px] md:rounded-[60px] rotate-3 opacity-10 animate-pulse" />
                  <div className="absolute inset-4 bg-white border border-slate-100 shadow-xl rounded-[35px] md:rounded-[50px] overflow-hidden">
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                        <ShieldCheck size={60} className="text-red-600 mb-2 md:w-20 md:h-20" />
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Secure Testing</span>
                     </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ================= 2. WHY MULTI-LEVEL SECTION ================= */}
        <section className="bg-slate-950 py-16 md:py-24 relative overflow-hidden">
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-16">
               <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-6 uppercase">
                 Why <span className="text-red-600">Multi-Level?</span>
               </h2>
               <p className="text-sm md:text-lg text-slate-400 font-medium leading-relaxed italic">
                 Identify your precise language ability across the entire CEFR spectrum in a single 
                 session. No more guesswork, just data-driven results.
               </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6 md:gap-8 text-center">
               {[
                 { icon: Cpu, label: "AI Grading" },
                 { icon: Fingerprint, label: "Secure ID" },
                 { icon: BarChart3, label: "Detailed Reports" }
               ].map((f, i) => (
                  <div key={i} className="p-6 rounded-[30px] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                     <f.icon size={24} className="text-red-600 mx-auto mb-4" />
                     <h4 className="text-sm font-black text-white uppercase tracking-tighter">{f.label}</h4>
                  </div>
               ))}
            </div>
          </div>
        </section>

        {/* ================= 3. VALUES SECTION ================= */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center lg:text-left mb-16">
               <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4">Our Values.</h2>
               <div className="h-1.5 w-20 bg-red-600 mx-auto lg:mx-0 rounded-full" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value, i) => (
                <motion.div
                  key={value.title}
                  whileHover={{ y: -5 }}
                  className="p-8 rounded-[35px] bg-white border border-slate-100 hover:border-red-100 hover:shadow-xl transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl ${value.bg} ${value.color} flex items-center justify-center mb-6`}>
                    <value.icon size={24} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-3 uppercase tracking-tight">{value.title}</h3>
                  <p className="text-slate-500 text-sm font-medium leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}