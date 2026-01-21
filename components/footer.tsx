"use client"

import React from "react"
import Link from "next/link"
import { 
    LayoutGrid, ShieldCheck, AlertTriangle, 
    Facebook, Instagram, Linkedin, Mail, Phone, MapPin, 
    Youtube,
    Send
} from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-400 py-16 border-t border-slate-800">
            {/* max-w-7xl o'rniga max-w-[1536px] va px-4 o'rniga px-6 md:px-12 lg:px-20 */}
            <div className="mx-auto max-w-[1536px] px-6 md:px-12 lg:px-20 grid md:grid-cols-4 gap-12">
                
                {/* 1. BRAND INFO */}
                <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <img src="/logo.png" alt="Logo" className="relative w-20 h-20 items-center justify-center"/>
                        <span className="text-3xl font-black text-white tracking-tight">ENWIS.UZ</span>
                    </div>
                    <p className="max-w-md leading-relaxed text-slate-500 mb-8 text-lg">
                        Markaziy Osiyodagi eng ilg'or sun'iy intellektga asoslangan bilimni baholash tizimi. 
                        Ingliz tilini o'rganish va baholashda yangi standart.
                    </p>
                    
                    {/* DISCLAIMER */}
                    <div className="p-5 bg-slate-800/40 rounded-2xl border border-slate-700/50 inline-flex items-start gap-4">
                        <AlertTriangle className="text-orange-500 shrink-0 mt-1" size={18} />
                        <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                            Ushbu loyiha mustaqil ta'lim platformasi bo'lib, Bilim va malakalarni baholash agentligi (UZBMB) bilan rasmiy aloqaga ega emas.
                        </p>
                    </div>
                </div>
                
                {/* 2. PLATFORMA */}
                <div className="lg:pl-10">
                    <h4 className="text-white font-bold mb-6 text-xl tracking-tight">Platforma</h4>
                    <ul className="space-y-4 text-sm font-medium">
                        <li><Link href="/test" className="hover:text-[#17776A] transition-colors flex items-center gap-2">Test topshirish</Link></li>
                        <li><Link href="#pricing" className="hover:text-[#17776A] transition-colors flex items-center gap-2">Tariflar</Link></li>
                        <li><Link href="/news" className="hover:text-[#17776A] transition-colors flex items-center gap-2">Yangiliklar</Link></li>
                        <li><Link href="/about" className="hover:text-[#17776A] transition-colors flex items-center gap-2">Biz haqimizda</Link></li>
                    </ul>
                </div>

                {/* 3. BOG'LANISH */}
                <div>
                    <h4 className="text-white font-bold mb-6 text-xl tracking-tight">Bog'lanish</h4>
                    <ul className="space-y-5 text-sm font-medium">
                        <li className="flex items-start gap-3 group">
                            <MapPin size={20} className="text-[#17776A] shrink-0 transition-transform group-hover:scale-110" />
                            <span className="leading-relaxed">Farg'ona sh., Qirguli mavzesi, 108-uy</span>
                        </li>
                        <li className="flex items-center gap-3 group">
                            <Phone size={20} className="text-[#17776A] shrink-0 transition-transform group-hover:scale-110" />
                            <span className="text-slate-300 font-bold">+998 (88) 542-08-18</span>
                        </li>
                        <li className="flex items-center gap-3 group">
                            <Mail size={20} className="text-[#17776A] shrink-0 transition-transform group-hover:scale-110" />
                            <span>enwisuz@gmail.com</span>
                        </li>
                        
                        {/* SOCIALS */}
                        <li className="flex gap-5 mt-6 pt-6 border-t border-slate-800">
                            <a href="https://instagram.com/enwis_uz" target="_blank" rel="noreferrer" className="p-2 bg-slate-800 rounded-lg hover:bg-[#17776A] hover:text-white transition-all duration-300">
                                <Instagram size={20}/>
                            </a>
                            <a href="https://www.youtube.com/@enwis_uz" target="_blank" rel="noreferrer" className="p-2 bg-slate-800 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300">
                                <Youtube size={20}/>
                            </a>
                            <a href="https://t.me/enwis_uz" target="_blank" rel="noreferrer" className="p-2 bg-slate-800 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300">
                                <Send size={20}/>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            
            {/* BOTTOM BAR */}
            <div className="mx-auto max-w-[1536px] px-6 md:px-12 lg:px-20 pt-8 mt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-medium text-slate-500">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={16} className="text-[#17776A]" />
                    <p>&copy; 2026 ENWIS Inc. Barcha huquqlar himoyalangan.</p>
                </div>
                <div className="flex gap-8">
                    <Link href="/public-offer" className="hover:text-white transition-colors underline-offset-4 hover:underline">Maxfiylik siyosati</Link>
                    <Link href="/terms" className="hover:text-white transition-colors underline-offset-4 hover:underline">Foydalanish shartlari</Link>
                </div>
            </div>
        </footer>
    )
}