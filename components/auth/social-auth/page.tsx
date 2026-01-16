"use client"

import React from "react"
import { Chrome, Send } from "lucide-react"
import { motion } from "framer-motion"

export function SocialAuth() {
  // Bu funksiyalar kelajakda backend bilan ulanadi
  const handleGoogleLogin = () => {
    console.log("Google orqali kirish...")
  }

  const handleTelegramLogin = () => {
    console.log("Telegram orqali kirish...")
  }

  return (
    <div className="flex flex-col gap-4 w-full mb-8">
      <div className="grid grid-cols-2 gap-4">
        {/* GOOGLE BUTTON */}
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 h-14 rounded-2xl border border-slate-100 bg-white hover:bg-slate-50 hover:border-slate-200 transition-all shadow-sm group"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <Chrome size={20} className="text-red-500 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-sm font-bold text-slate-600">Google</span>
        </motion.button>

        {/* TELEGRAM BUTTON */}
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleTelegramLogin}
          className="flex items-center justify-center gap-3 h-14 rounded-2xl bg-[#0088cc] hover:bg-[#0077b5] transition-all shadow-lg shadow-blue-100 group"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <Send size={18} className="text-white fill-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
          <span className="text-sm font-bold text-white">Telegram</span>
        </motion.button>
      </div>

      {/* AJRATUVCHI CHIZIQ (OR) */}
      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-slate-100"></div>
        <span className="flex-shrink mx-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
          Yoki pochta orqali
        </span>
        <div className="flex-grow border-t border-slate-100"></div>
      </div>
    </div>
  )
}