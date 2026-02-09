"use client"

import React, { use, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, useScroll, useSpring } from "framer-motion"
import { 
    ArrowLeft, Calendar, Clock, Facebook, 
    Twitter, Share2, Bookmark, Eye, TrendingUp,
    CheckCircle2, Link as LinkIcon, Printer, 
    ChevronRight, MessageSquare, Heart,
    User
} from "lucide-react"
import { newsData, popularNews } from "@/lib/mockData"

// Next.js 15+ qoidasi: params Promise sifatida tipizatsiya qilinadi
interface PageProps {
    params: Promise<{ id: string }>
}

export default function NewsDetailPage({ params }: PageProps) {
    // 1. params'ni use() hooki orqali yechamiz (asinxron kutish)
    const resolvedParams = use(params);
    const router = useRouter();
    
    // States
    const [isCopied, setIsCopied] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Hydration xatolarini oldini olish
    useEffect(() => {
        setMounted(true);
    }, []);

    // Scroll progress bari
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const news = newsData.find(item => item.id === Number(resolvedParams.id));

    const handleCopyLink = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    if (!news) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white pt-24 text-center p-6">
                <h1 className="text-2xl font-black text-slate-900 mb-4">Maqola topilmadi</h1>
                <button onClick={() => router.push('/news')} className="text-[#17776A] font-bold flex items-center gap-2">
                    <ArrowLeft size={18} /> Yangiliklarga qaytish
                </button>
            </div>
        );
    }

    if (!mounted) return null;

    return (
        <div className="min-h-screen bg-[#FDFDFD] font-sans selection:bg-[#17776A]/10 selection:text-[#17776A]">
            {/* READING PROGRESS BAR */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-[#17776A] origin-left z-[150]"
                style={{ scaleX }}
            />

            <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-28 lg:pt-36 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* LEFT: FLOATING SOCIALS */}
                    <div className="hidden lg:flex lg:col-span-1 flex-col items-center gap-4 sticky top-40 h-fit">
                        <button className="p-3 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-blue-600 hover:shadow-md transition-all shadow-sm">
                            <Facebook size={20}/>
                        </button>
                        <button className="p-3 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-sky-500 hover:shadow-md transition-all shadow-sm">
                            <Twitter size={20}/>
                        </button>
                        <button onClick={handleCopyLink} className={`p-3 rounded-2xl bg-white border border-slate-100 transition-all shadow-sm ${isCopied ? 'text-emerald-500 border-emerald-100' : 'text-slate-400 hover:text-[#17776A]'}`}>
                            {isCopied ? <CheckCircle2 size={20}/> : <LinkIcon size={20}/>}
                        </button>
                        <div className="w-px h-10 bg-slate-100 mx-auto my-2" />
                        <button className="p-3 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-amber-500 shadow-sm transition-all">
                            <Bookmark size={20} />
                        </button>
                    </div>

                    {/* CENTER: CONTENT */}
                    <article className="lg:col-span-8">
                        <header className="mb-10">
                            <div className="flex items-center gap-4 text-[#6F7D89] text-sm mb-4">
                                <span className="font-bold border-r pr-4 border-slate-200 text-[#17776A] uppercase tracking-widest text-xs">{news.category}</span>
                                <span className="flex items-center gap-1.5"><Clock size={16}/> {news.date}</span>
                                <span className="flex items-center gap-1.5 ml-auto"><Eye size={16}/> 4,803</span>
                            </div>

                            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.15] mb-8 tracking-tight italic">
                                {news.title}
                            </h1>

                            <div className="rounded-[40px] overflow-hidden shadow-2xl mb-12 relative group">
                                <img 
                                    src={news.image} 
                                    className="w-full h-auto max-h-[550px] object-cover transition-transform duration-1000 group-hover:scale-[1.02]" 
                                    alt="Article Cover" 
                                />
                            </div>
                        </header>

                        <div 
                            className="prose prose-slate max-w-none 
                            prose-p:text-slate-600 prose-p:text-xl prose-p:leading-[1.85] prose-p:mb-10
                            prose-headings:text-slate-900 prose-headings:font-black
                            prose-blockquote:border-l-[8px] prose-blockquote:border-[#17776A] prose-blockquote:bg-slate-50 
                            prose-blockquote:py-8 prose-blockquote:px-10 prose-blockquote:rounded-r-3xl
                            prose-strong:text-slate-900 prose-img:rounded-3xl prose-a:text-[#17776A] prose-a:font-bold"
                            dangerouslySetInnerHTML={{ __html: news.content }} 
                        />

                        <div className="mt-16 pt-8 border-t border-slate-100">
                            <div className="flex items-center gap-3 text-slate-400 mb-8">
                                <User size={20} />
                                <span className="font-medium">Tayyorlagan:</span>
                                <span className="font-black text-slate-900">{news.author}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {news.tags?.map(tag => (
                                    <span key={tag} className="px-4 py-2 bg-slate-50 text-slate-500 text-[10px] font-black rounded-xl border border-slate-100 hover:bg-[#17776A] hover:text-white transition-all cursor-pointer">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </article>

                    {/* RIGHT: SIDEBAR */}
                    <aside className="lg:col-span-3 space-y-10">
                        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 sticky top-36">
                            <h3 className="flex items-center gap-2 font-black text-slate-900 mb-8 border-b border-slate-50 pb-4 uppercase text-[10px] tracking-[0.2em]">
                                <TrendingUp size={18} className="text-[#17776A]"/> Dolzarb xabarlar
                            </h3>
                            
                            <div className="space-y-10">
                                {popularNews.map((item, index) => (
                                    <div 
                                        key={item.id} 
                                        onClick={() => router.push(`/news/${item.id}`)}
                                        className="group cursor-pointer relative pl-10"
                                    >
                                        <span className="absolute left-0 top-0 text-3xl font-black text-slate-100 group-hover:text-[#17776A]/20 transition-colors">
                                            0{index + 1}
                                        </span>
                                        <p className="text-sm font-bold text-slate-800 group-hover:text-[#17776A] leading-snug transition-all">
                                            {item.title}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <button onClick={() => router.push('/news')} className="w-full mt-10 py-4 bg-slate-50 hover:bg-[#17776A] text-slate-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                                Barcha yangiliklar
                            </button>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    )
}