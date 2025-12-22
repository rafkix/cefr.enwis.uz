"use client"

import React from "react"
import { motion } from "framer-motion"
import { Check, Sparkles, Zap, Crown, ArrowRight, ShieldCheck, Globe } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function PricingPage() {
  const plans = [
    {
      name: "Basic",
      price: "0",
      icon: Zap,
      desc: "Perfect for exploring the platform.",
      features: ["2 Adaptive Reading Tests", "Essential Practice Material", "Limited AI Analytics"],
      highlighted: false,
      btnText: "Get Started",
    },
    {
      name: "Standard",
      price: "19",
      icon: Crown,
      desc: "Most popular for serious learners.",
      features: ["Full Reading & Listening", "Unlimited Attempts", "Real-time Score Prediction", "Detailed Insights"],
      highlighted: true,
      btnText: "Unlock Access",
    },
    {
      name: "Pro AI",
      price: "39",
      icon: Sparkles,
      desc: "Advanced coaching for results.",
      features: ["AI Writing Evaluation", "Simulated Speaking", "Neural Phonetic Feedback", "Personalized Roadmap"],
      highlighted: false,
      btnText: "Go Premium",
    },
  ]

  return (
    <div className="min-h-screen bg-[#FDFDFF] selection:bg-red-100 overflow-x-hidden">
      <Navbar />

      <main className="pt-24 md:pt-32 pb-16 relative overflow-hidden">
        {/* Dekorativ orqa fon */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-red-500/5 blur-[80px] md:blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          {/* Sarlavha */}
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 mb-5"
            >
              <Sparkles className="w-3 h-3 text-red-600 fill-red-600" />
              <span className="text-[9px] font-black uppercase tracking-widest text-red-700">Flexible Plans</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-none"
            >
              Invest in your <br />
              <span className="text-red-600 italic">global future.</span>
            </motion.h1>
            <p className="text-sm md:text-lg text-slate-500 font-medium max-w-xl mx-auto">
              Transparent pricing tailored to your pace. Join over 500,000 students mastering English with AI.
            </p>
          </div>

          {/* Narxlar Gridi */}
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex flex-col p-8 md:p-10 rounded-[35px] md:rounded-[48px] border transition-all duration-300 ${
                  plan.highlighted 
                  ? "bg-slate-950 border-slate-950 shadow-2xl lg:scale-105 z-10" 
                  : "bg-white border-slate-100 hover:border-red-100 shadow-sm"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
                    Recommended
                  </div>
                )}

                <div className="mb-8">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                    plan.highlighted ? "bg-red-600 text-white" : "bg-red-50 text-red-600"
                  }`}>
                    <plan.icon size={24} />
                  </div>
                  <h3 className={`text-2xl font-black tracking-tight mb-2 ${plan.highlighted ? "text-white" : "text-slate-900"}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs md:text-sm font-medium leading-relaxed ${plan.highlighted ? "text-slate-400" : "text-slate-500"}`}>
                    {plan.desc}
                  </p>
                </div>

                <div className="mb-8 flex items-baseline gap-1">
                  <span className={`text-5xl md:text-6xl font-black tracking-tighter ${plan.highlighted ? "text-white" : "text-slate-900"}`}>
                    ${plan.price}
                  </span>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${plan.highlighted ? "text-slate-500" : "text-slate-400"}`}>
                    /month
                  </span>
                </div>

                <ul className="mb-10 space-y-4 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${
                        plan.highlighted ? "bg-white/10 text-red-500" : "bg-red-50 text-red-600"
                      }`}>
                        <Check size={12} strokeWidth={4} />
                      </div>
                      <span className={`text-sm font-bold tracking-tight ${plan.highlighted ? "text-slate-300" : "text-slate-600"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full h-14 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 group ${
                  plan.highlighted 
                  ? "bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-900/20" 
                  : "bg-slate-900 text-white hover:bg-red-600"
                }`}>
                  {plan.btnText}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* To'lov Tizimlari va Ishonch */}
          <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-8 border-t border-slate-100 pt-12 items-center text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <ShieldCheck size={20} className="text-slate-400" />
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Secure 256-bit <br/> SSL Encryption</p>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <Globe size={20} className="text-slate-400" />
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">International <br/> Certifications</p>
            </div>
            <div className="flex justify-center lg:justify-end gap-6 opacity-30">
               <span className="font-black italic text-lg tracking-tighter">CLICK</span>
               <span className="font-black italic text-lg tracking-tighter">PAYME</span>
               <span className="font-black italic text-lg tracking-tighter">VISA</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}