"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { Mail, MapPin, Phone, Send, Sparkles, MessageSquare, Clock } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Xabaringiz qabul qilindi! Tezgacha javob beramiz.")
  }

  return (
    <div className="min-h-screen bg-white selection:bg-red-100 overflow-x-hidden">
      <Navbar />

      <main className="relative pt-24 md:pt-32 pb-16 overflow-hidden">
        {/* Orqa fon bezaklari */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,#fee2e2_0%,transparent_50%)] opacity-50" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:30px_30px] md:bg-[size:40px_40px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          {/* Sarlavha qismi */}
          <div className="text-center lg:text-left mb-10 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 mb-4"
            >
              <Sparkles className="w-3 h-3 text-red-600 fill-red-600" />
              <span className="text-[9px] font-black uppercase tracking-widest text-red-700">Contact Us</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 leading-[1.1] md:leading-[0.9]">
              How can we <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">
                help you today?
              </span>
            </h1>
            <p className="text-base md:text-lg text-slate-500 font-medium max-w-2xl mx-auto lg:mx-0">
              Have questions about our AI assessment or premium plans? Our support team is ready to assist you.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 md:gap-12 items-start">
            
            {/* CHAP USTUN: ALOQA MA'LUMOTLARI */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-5 space-y-6"
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {[
                  { icon: Mail, label: "Email Us", val: "support@enwis.ai", color: "text-blue-600 bg-blue-50" },
                  { icon: Phone, label: "Call Us", val: "+998 71 123 45 67", color: "text-green-600 bg-green-50" },
                  { icon: MapPin, label: "Location", val: "Tashkent, Uzbekistan", color: "text-red-600 bg-red-50" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 rounded-[24px] bg-slate-50 border border-transparent hover:border-slate-100 hover:bg-white hover:shadow-lg transition-all duration-300">
                    <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center shrink-0`}>
                      <item.icon size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{item.label}</p>
                      <p className="text-sm md:text-base font-bold text-slate-900 truncate">{item.val}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ish vaqti kartasi */}
              <div className="p-6 md:p-8 rounded-[32px] bg-slate-950 text-white relative overflow-hidden group">
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <Clock size={20} className="text-red-500" />
                    <h3 className="text-lg font-black italic tracking-tight">Business Hours</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-white/5 pb-2">
                      <span className="text-slate-400 uppercase text-[9px] tracking-widest">Mon - Fri</span>
                      <span className="font-bold">09:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between text-red-500 pt-1">
                      <span className="font-black uppercase text-[9px] tracking-widest">Weekend</span>
                      <span className="font-black">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* O'NG USTUN: ALOQA FORMURASI */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-7 bg-white p-6 md:p-10 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-xl"
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                    <input 
                      type="text"
                      required
                      placeholder="Your name"
                      className="w-full h-14 px-5 rounded-xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-red-600/20 outline-none transition-all font-bold text-slate-900 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                    <input 
                      type="email"
                      required
                      placeholder="email@example.com"
                      className="w-full h-14 px-5 rounded-xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-red-600/20 outline-none transition-all font-bold text-slate-900 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Message</label>
                  <textarea 
                    required
                    placeholder="How can we help?"
                    className="w-full min-h-[140px] md:min-h-[160px] p-5 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-red-600/20 outline-none transition-all font-bold text-slate-900 text-sm resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full h-14 bg-red-600 text-white rounded-xl font-black text-base shadow-lg shadow-red-200 hover:bg-red-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
                >
                  Send Inquiry
                  <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </motion.div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}