"use client"

import { motion } from "framer-motion"
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { SocialAuth } from "@/components/auth/social-auth/page"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* Chap tomon: Forma */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 md:px-16 lg:px-24 relative">
        <div className="max-w-md w-full mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-red-200">E</div>
            <span className="text-xl font-black tracking-tighter text-slate-900">ENWIS <span className="text-red-600">AI</span></span>
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Xush kelibsiz!</h1>
            <p className="text-slate-500 font-medium mb-10">Ma'lumotlaringizni kiriting.</p>

            <SocialAuth />

            <div className="relative mb-8 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <span className="relative bg-white px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Yoki pochta orqali</span>
            </div>

            <form className="space-y-5">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input type="email" placeholder="Email" className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-red-600/20 outline-none transition-all font-bold" />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input type="password" placeholder="Parol" className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-red-600/20 outline-none transition-all font-bold" />
              </div>
              <button className="w-full h-16 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-red-600 transition-all flex items-center justify-center gap-3 group shadow-xl">
                Kirish <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <p className="mt-10 text-center text-sm font-bold text-slate-400">
              Hisobingiz yo'qmi? <Link href="/auth/signup" className="text-red-600 font-black">Ro'yxatdan o'ting</Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* O'ng tomon: Vizual (Desktop) */}
      <div className="hidden lg:flex w-[55%] bg-slate-50 relative items-center justify-center border-l border-slate-100">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,#fee2e2_0%,transparent_50%)]" />
         <div className="relative z-10 bg-white p-12 rounded-[40px] shadow-2xl border border-white max-w-md">
            <Sparkles className="text-red-600 mb-6" size={32} />
            <h2 className="text-3xl font-black text-slate-900 leading-tight mb-4">AI orqali o'z darajangizni aniqlang.</h2>
            <p className="text-slate-500 font-medium">Minglab talabalar kabi siz ham o'z muvaffaqiyat tarixingizni bugun boshlang.</p>
         </div>
      </div>
    </div>
  )
}