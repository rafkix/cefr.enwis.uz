"use client"

import React from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
    ArrowLeft, Calendar, User, Clock,
    Share2, Facebook, Twitter, Linkedin, Copy
} from "lucide-react"
import { newsData } from "@/lib/mockData" // Ma'lumotlarni import qilamiz

export default function NewsDetailPage() {
    const { id } = useParams()
    const router = useRouter()

    // ID bo'yicha yangilikni topish
    const news = newsData.find(item => item.id === Number(id))

    // Agar topilmasa (404)
    if (!news) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
                <h1 className="text-4xl font-black text-slate-900 mb-4">Yangilik topilmadi</h1>
                <button
                    onClick={() => router.push('/news')}
                    className="text-[#17776A] font-bold hover:underline"
                >
                    Ortga qaytish
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20">
            {/* Scroll Progress Bar (Optional) */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-[#17776A] origin-left z-50"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5 }}
            />

            <article className="mx-auto max-w-4xl px-4">

                {/* BACK BUTTON */}
                <button
                    onClick={() => router.back()}
                    className="group flex items-center gap-2 text-slate-500 font-bold hover:text-[#17776A] transition-colors mb-8"
                >
                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-[#17776A] transition-colors">
                        <ArrowLeft size={16} />
                    </div>
                    Yangiliklarga qaytish
                </button>

                {/* HEADER INFO */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider text-[#17776A] mb-4">
                        <span className="bg-[#17776A]/10 px-3 py-1 rounded-lg border border-[#17776A]/20">
                            {news.category}
                        </span>
                        <span className="text-slate-400 flex items-center gap-1">
                            <Clock size={14} /> {news.readTime}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
                        {news.title}
                    </h1>

                    <div className="flex items-center justify-between border-y border-slate-200 py-4">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
                                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
                                    <User size={16} />
                                </div>
                                {news.author}
                            </div>
                            <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                                <Calendar size={16} />
                                {news.date}
                            </div>
                        </div>

                        {/* Share Buttons */}
                        <div className="hidden md:flex items-center gap-2">
                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Facebook size={18} /></button>
                            <button className="p-2 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-all"><Twitter size={18} /></button>
                            <button className="p-2 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all"><Linkedin size={18} /></button>
                            <button className="p-2 text-slate-400 hover:text-[#17776A] hover:bg-[#17776A]/10 rounded-lg transition-all"><Copy size={18} /></button>
                        </div>
                    </div>
                </motion.div>

                {/* MAIN IMAGE */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-[32px] overflow-hidden shadow-2xl shadow-slate-200/50 mb-12"
                >
                    <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-[300px] md:h-[500px] object-cover"
                    />
                </motion.div>

                {/* CONTENT BODY */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="prose prose-lg prose-slate max-w-none 
                    prose-headings:font-black prose-headings:text-slate-900 
                    prose-p:text-slate-600 prose-p:leading-relaxed
                    prose-a:text-[#17776A] prose-a:font-bold hover:prose-a:underline
                    prose-img:rounded-2xl"
                    dangerouslySetInnerHTML={{ __html: news.content }} // HTML kontentni render qilish uchun
                />

                {/* BOTTOM SHARE (Mobile) */}
                <div className="mt-12 pt-8 border-t border-slate-200 md:hidden">
                    <p className="font-bold text-slate-900 mb-4">Ushbu maqolani ulashing:</p>
                    <div className="flex gap-4">
                        <button className="flex-1 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold flex items-center justify-center gap-2">
                            <Facebook size={20} /> Facebook
                        </button>
                        <button className="flex-1 py-3 bg-[#17776A]/10 text-[#17776A] rounded-xl font-bold flex items-center justify-center gap-2">
                            <Share2 size={20} /> Ulashish
                        </button>
                    </div>
                </div>

            </article>
        </div>
    )
}