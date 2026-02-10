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

    // Kontaktlarni yuklash
    const loadContacts = useCallback(async () => {
        if (!user) return;
        try {
            setContactsLoading(true)
            const res = await getMyContactsAPI()
            const data = res.data?.contacts || res.data || []
            setContacts(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error("Kontakt yuklashda xato:", err)
        } finally {
            setContactsLoading(false)
        }
    }, [user])

    useEffect(() => {
        loadContacts()
    }, [loadContacts])

    // Ruxsatni tekshirish
    const isAccessAllowed = useMemo(() => {
        if (authLoading) return true;
        
        const hasSocialIdentity = user?.identities?.some((id: any) => 
            ["GOOGLE", "TELEGRAM"].includes(id.provider)
        );

        const hasVerifiedPhone = contacts.some((c: any) => 
            c.contact_type === "phone" && c.is_verified === true
        );

        return !!(hasSocialIdentity || hasVerifiedPhone);
    }, [user, contacts, authLoading])

    const handleOpenBot = () => {
        window.open("https://t.me/EnwisAuthBot?start=verify_phone", "_blank");
    }

    // Har safar sahifa o'zgarganda mobil menyuni yopish
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])

    const menuItems = useMemo(() => [
        { name: "Imtihon", href: "/dashboard/exams", icon: BookCheck },
        { name: "Amaliyot", href: "/dashboard/test", icon: LayoutGrid },
        { name: "Natijalar", href: "/dashboard/result", icon: FileText },
        { name: "Profil", href: "/dashboard/profile", icon: User },
    ], [])

    if (authLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-white">
                <Loader2 className="w-10 h-10 animate-spin text-[#17776A]" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex font-sans text-slate-900 overflow-x-hidden">
            
            {/* --- MOBILE SIDEBAR & OVERLAY --- */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Qorong'u fon (Backdrop) */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[50] lg:hidden"
                        />
                        
                        {/* Mobil menyu (Drawer) */}
                        <motion.aside 
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-[280px] bg-white z-[60] shadow-2xl flex flex-col lg:hidden"
                        >
                            <div className="h-20 flex items-center justify-between px-6 border-b border-slate-50">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 bg-[#17776A] rounded-lg flex items-center justify-center text-white">
                                        <BrainCircuit size={18} />
                                    </div>
                                    <span className="font-black text-xl tracking-tight uppercase">ENWIS</span>
                                </div>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400">
                                    <X size={20} />
                                </button>
                            </div>

                            <nav className="flex-1 px-4 py-6 space-y-2">
                                {menuItems.map((item) => {
                                    const active = pathname.startsWith(item.href);
                                    return (
                                        <Link 
                                            key={item.href} 
                                            href={isAccessAllowed ? item.href : "#"}
                                            className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all
                                            ${!isAccessAllowed ? "opacity-50" : ""}
                                            ${active ? "bg-[#17776A] text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"}`}
                                        >
                                            <item.icon size={20} />
                                            <span>{item.name}</span>
                                            {!isAccessAllowed && <Lock size={14} className="ml-auto" />}
                                        </Link>
                                    )
                                })}
                            </nav>

                            <div className="p-4 border-t border-slate-50">
                                <button onClick={logout} className="flex items-center gap-3 px-6 py-4 w-full rounded-2xl font-bold text-sm text-red-500 bg-red-50">
                                    <LogOut size={18} /> Chiqish
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* --- DESKTOP SIDEBAR --- */}
            <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 fixed h-full z-40">
                <div className="h-24 flex items-center px-8 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#17776A] rounded-xl flex items-center justify-center text-white font-bold">
                            <BrainCircuit size={22} />
                        </div>
                        <span className="font-black text-2xl tracking-tighter uppercase">ENWIS</span>
                    </div>
                </div>
                <nav className="flex-1 px-4 space-y-1.5 pt-4">
                    {menuItems.map((item) => (
                        <Link key={item.href} href={isAccessAllowed ? item.href : "#"}
                            className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm
                            ${pathname.startsWith(item.href) ? "bg-[#17776A] text-white shadow-lg shadow-[#17776A]/20" : "text-slate-500 hover:bg-slate-50"}`}>
                            <item.icon size={20} /> <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>
                <div className="p-6">
                    <button onClick={logout} className="flex items-center gap-3 px-6 py-4 w-full rounded-2xl font-bold text-sm text-red-500 bg-red-50 hover:bg-red-100 transition-all">
                        <LogOut size={18} /> <span>Chiqish</span>
                    </button>
                </div>
            </aside>

            {/* --- MAIN AREA --- */}
            <div className="flex-1 flex flex-col lg:ml-72 min-w-0">
                <header className="h-20 lg:h-24 px-4 lg:px-12 sticky top-0 bg-white/80 backdrop-blur-md z-30 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setIsMobileMenuOpen(true)} 
                            className="lg:hidden p-2.5 text-slate-600 bg-slate-50 rounded-xl active:scale-90 transition-transform"
                        >
                            <Menu size={24} />
                        </button>
                        <h2 className="font-black text-lg lg:text-2xl text-slate-900 tracking-tight truncate max-w-[150px] sm:max-w-none">
                            {menuItems.find(item => pathname.startsWith(item.href))?.name || "Dashboard"}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-right hidden xs:block">
                            <p className="text-[12px] font-black leading-none truncate max-w-[100px]">{user?.profile?.full_name?.split(' ')[0]}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">@{user?.profile?.username}</p>
                        </div>
                        <div className="w-10 h-10 bg-[#17776A] rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-[#17776A]/20">
                            {user?.profile?.full_name?.charAt(0).toUpperCase() || "U"}
                        </div>
                    </div>
                </header>

                <main className="p-4 lg:p-12 flex-1">
                    <div className="max-w-5xl mx-auto">
                        <AnimatePresence mode="wait">
                            {isAccessAllowed ? (
                                <motion.div 
                                    key="content" 
                                    initial={{ opacity: 0, y: 10 }} 
                                    animate={{ opacity: 1, y: 0 }} 
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    {children}
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="lock" 
                                    initial={{ opacity: 0, scale: 0.95 }} 
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center justify-center min-h-[60vh]"
                                >
                                    <div className="w-full max-w-sm p-6 lg:p-10 bg-white border border-slate-100 rounded-[32px] shadow-2xl shadow-slate-200/50 text-center">
                                        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                            <Smartphone size={32} />
                                        </div>
                                        <h1 className="text-xl lg:text-2xl font-black text-slate-900 mb-3">Raqamni tasdiqlang</h1>
                                        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                                            Platformadan foydalanish uchun telefon raqamingizni Telegram orqali bog'lashingiz shart.
                                        </p>
                                        <button 
                                            onClick={handleOpenBot}
                                            className="w-full py-4 bg-[#0088cc] text-white rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg shadow-[#0088cc]/20 active:scale-95 transition-all"
                                        >
                                            <Send size={18} /> TASDIQLASH
                                        </button>
                                        <p className="mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                            TASDIQLAGANDAN SO'NG SAHIFANI YANGILANG
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    )
}