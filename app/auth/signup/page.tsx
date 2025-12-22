"use client"

import { SocialAuth } from "@/components/auth/social-auth/page"
import { motion } from "framer-motion"
import { Mail, Lock, User, ArrowRight, ShieldCheck } from "lucide-react"
import Link from "next/link"


export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* Chap tomon: Forma */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 md:px-16 lg:px-24">
        <div className="max-w-md w-full mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-red-200">E</div>
            <span className="text-xl font-black tracking-tighter text-slate-900">ENWIS <span className="text-red-600">AI</span></span>
          </Link>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Yangi hisob ochish</h1>
            <p className="text-slate-500 font-medium mb-8">Global hamjamiyatga qo'shiling.</p>

            <SocialAuth />

            <form className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input type="text" placeholder="Ism familiya" className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-red-600/20 outline-none transition-all font-bold" />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input type="email" placeholder="Email" className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-red-600/20 outline-none transition-all font-bold" />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input type="password" placeholder="Parol yarating" className="w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-red-600/20 outline-none transition-all font-bold" />
              </div>
              <button className="w-full h-16 bg-red-600 text-white rounded-2xl font-black text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-100 flex items-center justify-center gap-3 group">
                Ro'yxatdan o'tish <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <p className="mt-8 text-center text-sm font-bold text-slate-400">
              Hisobingiz bormi? <Link href="/auth/login" className="text-slate-900 font-black underline underline-offset-4">Kirish</Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* O'ng tomon: Vizual (Dark) */}
      <div className="hidden lg:flex w-[55%] bg-slate-900 relative items-center justify-center p-20">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent" />
        <div className="relative z-10 text-white max-w-sm">
          <ShieldCheck className="text-red-500 mb-8" size={48} />
          <h2 className="text-5xl font-black leading-tight mb-6">Xavfsiz va aniq baholash.</h2>
          <p className="text-slate-400 text-lg">Sizning barcha ma'lumotlaringiz va natijalaringiz AI tomonidan himoyalangan.</p>
        </div>
      </div>
    </div>
  )
}