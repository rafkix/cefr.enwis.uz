"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Calendar, ChevronRight, Search, ArrowRight } from "lucide-react"
import { newsData } from "@/lib/mockData" // Yuqoridagi faylni import qiling

export default function NewsPage() {
    const router = useRouter()
    const [activeCategory, setActiveCategory] = useState("Barchasi")
    const [searchTerm, setSearchTerm] = useState("")

    const categories = ["Barchasi", "Yangilik", "Qo'llanma", "E'lon", "Tavsiya"]

    // Filterlash va Qidirish logikasi
    const filteredNews = newsData.filter(item => {
        const matchesCategory = activeCategory === "Barchasi" || item.category === activeCategory
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesCategory && matchesSearch
    })

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-800 selection:bg-[#17776A] selection:text-white pt-32 pb-20">
            
            <div className="mx-auto max-w-7xl px-4">
                
                {/* --- PAGE HEADER (Siz bergan Section uslubida) --- */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <span className="text-[#17776A] font-bold tracking-widest uppercase text-xs">BLOG VA YANGILIKLAR</span>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mt-3">
                            So'nggi Maqolalar
                        </h1>
                        <p className="text-slate-500 mt-4 text-lg max-w-xl">
                            CEFR va IELTS imtihonlaridagi o'zgarishlar, foydali maslahatlar va ta'lim yangiliklari.
                        </p>
                    </div>

                    {/* Search Input */}
                    <div className="w-full md:w-80 relative">
                        <input 
                            type="text" 
                            placeholder="Qidirish..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white border border-slate-200 focus:border-[#17776A] focus:ring-4 focus:ring-[#17776A]/10 outline-none transition-all shadow-sm font-medium"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    </div>
                </div>

                {/* --- CATEGORY TABS --- */}
                <div className="flex gap-2 overflow-x-auto pb-8 mb-4 scrollbar-hide">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border
                            ${activeCategory === cat 
                                ? 'bg-[#17776A] text-white border-[#17776A] shadow-lg shadow-[#17776A]/20' 
                                : 'bg-white text-slate-500 border-slate-200 hover:border-[#17776A] hover:text-[#17776A]'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* --- NEWS GRID (Siz bergan Card uslubida) --- */}
                {filteredNews.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredNews.map((news, i) => (
                            <motion.div 
                                key={news.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -10 }}
                                onClick={() => router.push(`/news/${news.id}`)}
                                className="group cursor-pointer flex flex-col h-full bg-white rounded-[32px] p-4 border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300"
                            >
                                {/* Image Container */}
                                <div className="h-60 rounded-[24px] overflow-hidden relative mb-6">
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
                                    
                                    {/* Image */}
                                    <img 
                                        src={news.image} 
                                        alt={news.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />

                                    {/* Date Badge */}
                                    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white text-xs font-bold flex items-center gap-2 z-20">
                                        <Calendar size={12} /> {news.date}
                                    </div>

                                    {/* Category Badge */}
                                    <div className="absolute bottom-4 left-4 z-20">
                                        <span className="text-[10px] font-black uppercase tracking-widest bg-[#17776A] text-white px-2 py-1 rounded-lg shadow-lg">
                                            {news.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="px-2 pb-2 flex flex-col flex-1">
                                    <h3 className="text-xl font-bold text-slate-900 leading-tight mb-3 group-hover:text-[#17776A] transition-colors line-clamp-2">
                                        {news.title}
                                    </h3>
                                    <p className="text-slate-500 text-sm line-clamp-3 mb-6 leading-relaxed">
                                        {news.excerpt}
                                    </p>
                                    
                                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-[#17776A] font-bold text-sm">
                                        <span>Batafsil o'qish</span>
                                        <div className="w-8 h-8 rounded-full bg-[#17776A]/10 flex items-center justify-center group-hover:bg-[#17776A] group-hover:text-white transition-all">
                                            <ChevronRight size={16} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    // Empty State
                    <div className="text-center py-20">
                        <div className="inline-flex justify-center items-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                            <Search className="text-slate-400" size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Hech narsa topilmadi</h3>
                        <p className="text-slate-500 mt-2">Boshqa so'z bilan qidirib ko'ring.</p>
                    </div>
                )}

                {/* Pagination (Visual) */}
                {filteredNews.length > 0 && (
                    <div className="mt-16 flex justify-center gap-2">
                        <button className="w-10 h-10 rounded-xl bg-[#17776A] text-white font-bold flex items-center justify-center">1</button>
                        <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold flex items-center justify-center hover:border-[#17776A] hover:text-[#17776A] transition-all">2</button>
                        <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold flex items-center justify-center hover:border-[#17776A] hover:text-[#17776A] transition-all"><ArrowRight size={16}/></button>
                    </div>
                )}
            </div>
        </div>
    )
}