"use client"

import { useCallback, useEffect, useState, useMemo } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
    LayoutGrid, FileText, User, LogOut, Menu, X, Loader2, 
    BrainCircuit, BookCheck, Lock, Send, Smartphone
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useAuth } from "@/lib/AuthContext"
import { getMyContactsAPI } from "@/lib/api/user"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const { user, loading: authLoading, logout } = useAuth()
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [contacts, setContacts] = useState<any[]>([])
    const [contactsLoading, setContactsLoading] = useState(true)

    const loadContacts = useCallback(async () => {
        try {
            setContactsLoading(true)
            const res = await getMyContactsAPI()
            const data = res.data?.contacts || res.data || []
            setContacts(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error("Kontakt xatosi:", err)
        } finally {
            setContactsLoading(false)
        }
    }, [])

    useEffect(() => {
        if (user) loadContacts()
    }, [user, loadContacts])

    // Tasdiqlanganlik holatini tekshirish
    const isVerified = useMemo(() => {
        if (contactsLoading) return true; // Yuklash vaqtida xalaqit bermaslik
        const hasPhone = contacts.some(c => c.contact_type === 'phone' && c.is_verified === true);
        const hasEmail = contacts.some(c => c.contact_type === 'email' && c.is_verified === true);
        const hasSocial = contacts.some(c => ['google', 'telegram', 'social'].includes(c.contact_type));
        return hasPhone || hasEmail || hasSocial;
    }, [contacts, contactsLoading])

    // Qaysi sahifalar bloklanishi kerakligini aniqlash
    const isRestrictedPage = useMemo(() => {
        const restrictedPaths = ["/dashboard/exams", "/dashboard/test", "/dashboard/process"];
        return restrictedPaths.some(path => pathname.startsWith(path));
    }, [pathname])

    const handleOpenBot = () => {
        window.open("https://t.me/EnwisAuthBot?start=verify_phone", "_blank");
    }

    const menuItems = [
        { name: "Imtihon", href: "/dashboard/exams", icon: BookCheck, restricted: true },
        { name: "Amaliyot", href: "/dashboard/test", icon: LayoutGrid, restricted: true },
        { name: "Natijalar", href: "/dashboard/result", icon: FileText, restricted: false },
        { name: "Profil", href: "/dashboard/profile", icon: User, restricted: false },
    ]

    if (authLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-white">
                <Loader2 className="w-10 h-10 animate-spin text-[#17776A]" />
            </div>
        )
    }

    return (
        <div className="h-screen w-full bg-[#FDFDFD] flex overflow-hidden font-sans text-slate-900">
            
            {/* SIDEBAR (Desktop) */}
            <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 shrink-0 h-full relative z-40">
                <div className="h-24 flex items-center px-8 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#17776A] rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-900/20">
                            <BrainCircuit size={22} />
                        </div>
                        <span className="font-black text-2xl tracking-tighter uppercase">ENWIS</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1.5 pt-4 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => {
                        const active = pathname.startsWith(item.href);
                        const locked = !isVerified && item.restricted;
                        return (
                            <Link key={item.href} href={item.href}
                                className={`group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all
                                ${active ? "bg-[#17776A] text-white shadow-md shadow-teal-900/10" : "text-slate-500 hover:bg-slate-50"}`}>
                                <div className="flex items-center gap-3.5 font-bold text-sm">
                                    <item.icon size={20} className={active ? "text-white" : "text-slate-400 group-hover:text-[#17776A]"} /> 
                                    <span>{item.name}</span>
                                </div>
                                {locked && <Lock size={14} className="opacity-40" />}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-6 shrink-0 border-t border-slate-50">
                    <button onClick={logout} className="flex items-center gap-3 px-6 py-4 w-full rounded-2xl font-bold text-sm text-red-500 bg-red-50 hover:bg-red-100 transition-all active:scale-95">
                        <LogOut size={18} /> <span>Chiqish</span>
                    </button>
                </div>
            </aside>

            {/* MOBILE OVERLAY */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 lg:hidden"
                        />
                        <motion.div 
                            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                            className="fixed inset-y-0 left-0 w-72 bg-white z-[60] lg:hidden p-6 flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <span className="font-black text-xl tracking-tighter text-[#17776A]">ENWIS</span>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-slate-50 rounded-lg text-slate-400"><X size={20} /></button>
                            </div>
                            <nav className="flex-1 space-y-2">
                                {menuItems.map((item) => (
                                    <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center justify-between p-4 rounded-xl font-bold text-sm ${pathname.startsWith(item.href) ? "bg-[#17776A] text-white" : "text-slate-500"}`}>
                                        <div className="flex items-center gap-3"><item.icon size={18} /> {item.name}</div>
                                        {!isVerified && item.restricted && <Lock size={12} />}
                                    </Link>
                                ))}
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                
                {/* HEADER */}
                <header className="h-20 lg:h-24 px-6 lg:px-12 sticky top-0 bg-white/80 backdrop-blur-md z-30 border-b border-slate-100 shrink-0 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2.5 text-slate-600 hover:bg-slate-50 rounded-xl">
                            <Menu size={24} />
                        </button>
                        <h2 className="font-black text-lg lg:text-xl text-slate-900 tracking-tight">
                            {menuItems.find(i => pathname.startsWith(i.href))?.name || "Dashboard"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block leading-tight">
                            <p className="text-sm font-black text-slate-900">{user?.profile?.full_name}</p>
                            <p className="text-[10px] text-teal-600 font-bold uppercase tracking-widest">@{user?.profile?.username}</p>
                        </div>
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-[#17776A] to-teal-800 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-teal-900/20">
                            {user?.profile?.full_name?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* SCROLLABLE CONTENT */}
                <main className="flex-1 overflow-y-auto bg-[#F8FAFC] custom-scrollbar">
                    <div className="max-w-6xl mx-auto p-4 lg:p-10 min-h-full flex flex-col">
                        <AnimatePresence mode="wait">
                            {isRestrictedPage && !isVerified ? (
                                <motion.div 
                                    key="lock-screen"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="flex-1 flex flex-col items-center justify-center text-center py-12"
                                >
                                    <div className="w-full max-w-md p-10 bg-white border border-slate-100 rounded-[45px] shadow-2xl shadow-slate-200/40">
                                        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[30px] flex items-center justify-center mx-auto mb-8">
                                            <Smartphone size={40} />
                                        </div>
                                        <h1 className="text-2xl font-black text-slate-900 mb-4">Kirish cheklangan</h1>
                                        <p className="text-slate-500 text-sm mb-10 leading-relaxed">
                                            Imtihon va amaliyot bo'limlaridan foydalanish uchun telefon raqamingizni Telegram bot orqali tasdiqlashingiz shart.
                                        </p>
                                        <button 
                                            onClick={handleOpenBot}
                                            className="w-full py-5 bg-[#0088cc] text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-xl hover:bg-[#0077b5] transition-all active:scale-95"
                                        >
                                            <Send size={20} /> BOT ORQALI TASDIQLASH
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key={pathname}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-full flex-1"
                                >
                                    {children}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    )
}