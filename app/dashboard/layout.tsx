"use client"

import { useCallback, useEffect, useState, useMemo } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
    LayoutGrid, FileText, User, LogOut, Menu, X, Loader2, BrainCircuit, ChevronRight, BookCheck, Lock, ShieldAlert, Send, Smartphone
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useAuth } from "@/lib/AuthContext"
import { getMyContactsAPI } from "@/lib/api/user"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
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

    const isPhoneVerified = useMemo(() => {
        if (contactsLoading) return true;
        return contacts.some(c => c.contact_type === 'phone' && c.is_verified === true)
    }, [contacts, contactsLoading])

    const handleOpenBot = () => {
        window.open("https://t.me/EnwisAuthBot?start=verify_phone", "_blank");
    }

    // Mobil menyuni pathname o'zgarganda yopish
    useEffect(() => { setIsMobileMenuOpen(false) }, [pathname])

    const menuItems = useMemo(() => {
        if (!isPhoneVerified) return [];
        return [
            { name: "Imtihon", href: "/dashboard/exams", icon: BookCheck },
            { name: "Amaliyot", href: "/dashboard/test", icon: LayoutGrid },
            { name: "Natijalar", href: "/dashboard/result", icon: FileText },
            { name: "Profil", href: "/dashboard/profile", icon: User },
        ]
    }, [isPhoneVerified])

    if (authLoading || (contactsLoading && contacts.length === 0)) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-white">
                <Loader2 className="w-10 h-10 animate-spin text-[#17776A]" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex font-sans text-slate-900">
            
            {/* --- SIDEBAR (Desktop) --- */}
            <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 fixed h-full z-40">
                <div className="h-24 flex items-center px-8 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#17776A] rounded-xl flex items-center justify-center text-white">
                            <BrainCircuit size={22} />
                        </div>
                        <span className="font-black text-2xl tracking-tighter uppercase">ENWIS</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-1.5 pt-4">
                    {menuItems.map((item) => (
                        <Link key={item.href} href={item.href}
                            className={`group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all
                            ${pathname.startsWith(item.href) ? "bg-[#17776A] text-white" : "text-slate-500 hover:bg-slate-50"}`}>
                            <div className="flex items-center gap-3.5 font-bold text-sm">
                                <item.icon size={20} /> <span>{item.name}</span>
                            </div>
                        </Link>
                    ))}
                    {!isPhoneVerified && (
                        <div className="px-4 py-6 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200 mx-2">
                            <Lock className="mx-auto mb-2 text-slate-400" size={20} />
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cheklangan</p>
                        </div>
                    )}
                </nav>

                <div className="p-6">
                    <button onClick={logout} className="flex items-center gap-3 px-6 py-4 w-full rounded-2xl font-bold text-sm text-red-500 bg-red-50 hover:bg-red-100 transition-all">
                        <LogOut size={18} /> <span>Chiqish</span>
                    </button>
                </div>
            </aside>

            {/* --- MOBILE SIDEBAR --- */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[50] lg:hidden" />
                        <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                            className="fixed inset-y-0 left-0 w-72 bg-white z-[60] lg:hidden flex flex-col shadow-2xl">
                            <div className="h-20 flex items-center justify-between px-6 border-b">
                                <span className="font-black text-xl text-[#17776A]">ENWIS</span>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400"><X size={24} /></button>
                            </div>
                            <nav className="flex-1 p-4 space-y-2">
                                {menuItems.map((item) => (
                                    <Link key={item.href} href={item.href}
                                        className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold
                                        ${pathname.startsWith(item.href) ? "bg-[#17776A] text-white" : "text-slate-500"}`}>
                                        <item.icon size={22} /> <span>{item.name}</span>
                                    </Link>
                                ))}
                                {!isPhoneVerified && (
                                    <div className="p-6 text-center bg-rose-50 rounded-2xl border border-rose-100">
                                        <Lock className="mx-auto mb-2 text-rose-400" size={20} />
                                        <p className="text-xs font-bold text-rose-600 uppercase">Tasdiqlash kutilmoqda</p>
                                    </div>
                                )}
                            </nav>
                            <div className="p-4 border-t">
                                <button onClick={logout} className="flex items-center gap-3 px-6 py-4 w-full rounded-2xl font-bold text-red-500 bg-red-50">
                                    <LogOut size={18} /> <span>Chiqish</span>
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* --- MAIN AREA --- */}
            <div className="flex-1 flex flex-col lg:ml-72 min-w-0">
                <header className="h-20 lg:h-24 px-4 lg:px-12 sticky top-0 bg-white/80 backdrop-blur-md z-30 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl">
                            <Menu size={24} />
                        </button>
                        <h2 className="font-black text-lg lg:text-2xl text-slate-900 tracking-tight">Dashboard</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-black line-clamp-1">{user?.profile?.full_name}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest">@{user?.profile?.username}</p>
                        </div>
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#17776A] rounded-xl lg:rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-[#17776A]/20">
                            {user?.profile?.full_name?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                <main className="p-4 lg:p-12 relative flex-1">
                    <div className="max-w-4xl mx-auto">
                        
                        {isPhoneVerified ? (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                {children}
                            </motion.div>
                        ) : (
                            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
                                <motion.div 
                                    initial={{ scale: 0.9, opacity: 0 }} 
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-full max-w-md p-6 lg:p-10 bg-white border border-slate-100 rounded-[30px] lg:rounded-[40px] shadow-2xl shadow-slate-200/50"
                                >
                                    <div className="w-16 h-16 lg:w-20 lg:h-20 bg-rose-100 text-rose-600 rounded-2xl lg:rounded-3xl flex items-center justify-center mx-auto mb-6">
                                        <Smartphone size={32} />
                                    </div>
                                    
                                    <h1 className="text-xl lg:text-2xl font-black text-slate-900 mb-3">Hisobni tasdiqlang</h1>
                                    <p className="text-slate-500 text-sm lg:text-base font-medium mb-8 leading-relaxed">
                                        Tizim funksiyalaridan foydalanish uchun telefon raqamingizni Telegram bot orqali tasdiqlang.
                                    </p>

                                    <button 
                                        onClick={handleOpenBot}
                                        className="w-full py-4 lg:py-5 bg-[#0088cc] text-white rounded-2xl lg:rounded-3xl font-black text-base lg:text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 hover:bg-[#0077b5] active:scale-95 transition-all"
                                    >
                                        <Send size={20} /> BOTNI OCHISH
                                    </button>

                                    <div className="mt-8 pt-6 border-t border-slate-50">
                                        <div className="flex items-center justify-center gap-2 text-rose-500">
                                            <ShieldAlert size={16} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Kirish cheklangan</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}