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
            <div className="mx-auto max-w-7xl px-4 grid md:grid-cols-4 gap-12">
                
                {/* 1. BRAND INFO */}
                <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <img src="/logo.png" alt="" className="relative w-20 h-20  items-center justify-center"/>
                        <span className="text-2xl font-black text-white tracking-tight">ENWIS.UZ</span>
                    </div>
                    <p className="max-w-md leading-relaxed text-slate-500 mb-8">
                        Markaziy Osiyodagi eng ilg'or sun'iy intellektga asoslangan bilimni baholash tizimi. 
                        Ingliz tilini o'rganish va baholashda yangi standart.
                    </p>
                    
                    {/* DISCLAIMER */}
                    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 inline-flex items-start gap-3">
                        <AlertTriangle className="text-orange-500 shrink-0 mt-0.5" size={16} />
                        <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                            Ushbu loyiha mustaqil ta'lim platformasi bo'lib, Bilim va malakalarni baholash agentligi (UZBMB) bilan rasmiy aloqaga ega emas.
                        </p>
                    </div>
                </div>
                
                {/* 2. PLATFORMA */}
                <div>
                    <h4 className="text-white font-bold mb-6 text-lg">Platforma</h4>
                    <ul className="space-y-4 text-sm font-medium">
                        <li><Link href="/test" className="hover:text-[#17776A] transition-colors">Test topshirish</Link></li>
                        <li><Link href="#pricing" className="hover:text-[#17776A] transition-colors">Tariflar</Link></li>
                        <li><Link href="/news" className="hover:text-[#17776A] transition-colors">Yangiliklar</Link></li>
                    </ul>
                </div>

                {/* 3. BOG'LANISH */}
                <div>
                    <h4 className="text-white font-bold mb-6 text-lg">Bog'lanish</h4>
                    <ul className="space-y-4 text-sm font-medium">
                        <li className="flex items-start gap-3">
                            <MapPin size={18} className="text-[#17776A] shrink-0" />
                            <span>Farg'ona sh., Qirguli mavzesi, 108</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone size={18} className="text-[#17776A] shrink-0" />
                            <span>+998 (88) 542-08-18</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail size={18} className="text-[#17776A] shrink-0" />
                            <span>enwisuz@gmail.com</span>
                        </li>
                        
                        {/* SOCIALS */}
                        <li className="flex gap-4 mt-4 pt-4 border-t border-slate-800">
                            <a href="https://instagram.com/enwis_uz" className="hover:text-white transition-colors"><Instagram size={20}/></a>
                            <a href="https://www.youtube.com/@enwis_uz" className="hover:text-white transition-colors"><Youtube size={20}/></a>
                            <a href="https://t.me/enwis_uz" className="hover:text-white transition-colors"><Send size={20}/></a>
                        </li>
                    </ul>
                </div>
            </div>
            
            {/* BOTTOM BAR */}
            <div className="mx-auto max-w-7xl px-4 pt-8 mt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-medium text-slate-500">
                <p>&copy; 2026 ENWIS Inc. Barcha huquqlar himoyalangan.</p>
                <div className="flex gap-6">
                    <Link href="/public-offer" className="hover:text-white transition-colors">Maxfiylik siyosati</Link>
                    <Link href="/terms" className="hover:text-white transition-colors">Foydalanish shartlari</Link>
                </div>
            </div>
        </footer>
    )
}