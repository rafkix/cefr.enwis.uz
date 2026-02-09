"use client"

import React, { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, useScroll, useMotionValueEvent } from "framer-motion"
import { BrainCircuit, ArrowRight, Menu, X } from "lucide-react"

export function Header() {
    const router = useRouter()
    const pathname = usePathname() // Qaysi sahifada turganini bilish uchun
    
    // Scroll effekti uchun state
    const { scrollY } = useScroll()
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 20)
    })

    // Menyu linklari
    const navLinks = [
        { name: "Asosiy", href: "/" },
        { name: "Testlar", href: "/test" },
        { name: "Tariflar", href: "/#pricing" }, // Home page dagi sectionga boradi
        { name: "Yangiliklar", href: "/news" },
        { name: "Bog'lanish", href: "/contact" },
    ]

    return (
        <>
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-5'}`}>
                <div 
                    className={`mx-auto max-w-7xl px-6 h-16 flex items-center justify-between transition-all duration-500
                    ${isScrolled 
                        ? 'bg-white/80 backdrop-blur-xl border border-white/50 shadow-lg rounded-2xl mx-4 md:mx-auto' 
                        : 'bg-transparent border-transparent shadow-none'
                    }`}
                >
                    {/* LOGO */}
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push("/")}>
                        <div className="relative">
                            {/* <div className="absolute inset-0 bg-[#17776A] blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
                            <div className="relative w-10 h-10 bg-gradient-to-br from-[#17776A] to-teal-600 rounded-xl flex items-center justify-center text-white shadow-inner">
                                <BrainCircuit size={20} />
                            </div> */}
                            <img src="/logo.png" alt="" className="relative w-12 h-12  items-center justify-center"/>
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-black text-xl tracking-tight text-slate-900">ENWIS</span>
                            <span className="text-[10px] font-bold text-[#17776A] uppercase tracking-widest mt-0.5">AI Platform</span>
                        </div>
                    </div>

                    {/* DESKTOP MENU */}
                    <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-full border border-slate-200/60">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                href={link.href}
                                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all
                                ${pathname === link.href 
                                    ? 'bg-white text-[#17776A] shadow-sm' 
                                    : 'text-slate-600 hover:text-[#17776A] hover:bg-white/50'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => router.push("/auth/register")}
                            className="hidden md:flex group items-center gap-2 bg-[#17776A] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#17776A]/20 hover:bg-[#125d53] transition-all active:scale-95"
                        >
                            Kirish <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        {/* Mobile Menu Button */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* MOBILE MENU OVERLAY */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden animate-in fade-in slide-in-from-top-10">
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-xl font-bold text-slate-800 py-3 border-b border-slate-100"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <button 
                            onClick={() => router.push("/auth/phone")}
                            className="mt-4 w-full bg-[#17776A] text-white py-4 rounded-xl font-bold text-lg"
                        >
                            Tizimga kirish
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}