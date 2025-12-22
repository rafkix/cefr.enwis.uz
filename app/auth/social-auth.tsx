"use client"

import { Chrome, Send } from "lucide-react"

export function SocialAuth() {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      {/* Google */}
      <button className="flex items-center justify-center gap-3 h-14 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all font-bold text-sm text-slate-600">
        <Chrome size={20} className="text-red-500" /> Google
      </button>
      
      {/* Telegram */}
      <button className="flex items-center justify-center gap-3 h-14 rounded-2xl bg-[#0088cc] hover:bg-[#0077b5] transition-all font-bold text-sm text-white shadow-lg shadow-blue-100">
        <Send size={18} fill="currentColor" /> Telegram
      </button>
    </div>
  )
}