"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
    LayoutGrid, FileText, User, LogOut, Menu, X, Loader2, BrainCircuit, ChevronRight, Bell, BookCheck, AlertTriangle
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useAuth } from "@/lib/AuthContext"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const { user, loading: authLoading, logout } = useAuth()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const hasPhone = user?.contacts.phone || user?.contacts?.some(c => c.value);
    const isExamPage = pathname.includes("/test/listening") || pathname.includes("/test/reading") || pathname.includes("/test/writing")

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.replace("/auth/login")
                return
            }
            if (!hasPhone && pathname !== "/dashboard/profile") {
                router.replace("/dashboard/profile?complete=true")
            }
        }
    }, [user, authLoading, hasPhone, pathname, router])

    if (authLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-white text-[#17776A]">
                <Loader2 className="w-10 h-10 animate-spin" />
            </div>
        )
    }

    if (isExamPage) return <div className="min-h-screen bg-white">{children}</div>

    const menuItems = [
        { name: "Imtihon", href: "/dashboard/exams", icon: BookCheck, disabled: !hasPhone },
        { name: "Amaliyot", href: "/dashboard/test", icon: LayoutGrid, disabled: !hasPhone },
        { name: "Natijalar", href: "/dashboard/results", icon: FileText, disabled: !hasPhone },
        { name: "Profil", href: "/dashboard/profile", icon: User, disabled: false },
    ]

    const currentPage = menuItems.find(i => pathname.startsWith(i.href))?.name || "Boshqaruv"

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex font-sans text-slate-900">
            
            {/* Desktop Sidebar (Faqat Kompyuterda) */}
            <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 fixed h-full z-40">
                <div className="h-24 flex items-center px-8">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#17776A] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#17776A]/20">
                            <BrainCircuit size={22} />
                        </div>
                        <span className="font-black text-2xl tracking-tighter uppercase text-[#17776A]">ENWIS</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1.5 mt-4">
                    {menuItems.map((item) => {
                        const isActive = pathname.startsWith(item.href)
                        const isLocked = item.disabled && !hasPhone;
                        return (
                            <Link key={item.href} href={isLocked ? "#" : item.href}
                                className={`group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all
                                ${isActive ? "bg-[#17776A] text-white shadow-md" : "text-slate-500 hover:bg-slate-50"}
                                ${isLocked ? "opacity-40 cursor-not-allowed" : ""}`}>
                                <div className="flex items-center gap-3.5">
                                    <item.icon size={20} />
                                    <span className="font-bold text-sm">{item.name}</span>
                                </div>
                                {isActive && <ChevronRight size={16} />}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-6">
                    <button onClick={logout} className="flex items-center gap-3 px-6 py-4 w-full rounded-2xl font-bold text-sm text-red-500 bg-red-50 hover:bg-red-100 transition-all">
                        <LogOut size={18} />
                        <span>Chiqish</span>
                    </button>
                </div>
            </aside>

            {/* Asosiy Content qismi */}
            <div className="flex-1 flex flex-col lg:ml-72 min-w-0 pb-24 lg:pb-0">
                {/* Header */}
                <header className="h-16 lg:h-24 px-4 lg:px-12 sticky top-0 bg-white/80 backdrop-blur-md z-30 border-b border-slate-100/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="font-black text-lg lg:text-2xl tracking-tight">{currentPage}</h2>
                    </div>

                    <div className="flex items-center gap-3">
                        {!hasPhone && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 rounded-full text-amber-700 animate-pulse">
                                <AlertTriangle size={14} />
                                <span className="text-[10px] font-bold">Tugallanmagan</span>
                            </div>
                        )}
                        <button className="p-2 text-slate-500 bg-slate-50 rounded-lg">
                            <Bell size={18} />
                        </button>
                    </div>
                </header>

                <main className="p-4 lg:p-12">
                    {/* Telefon raqami yo'qligi haqida banner */}
                    {!hasPhone && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-4">
                            <div className="p-2 bg-white rounded-xl text-red-500 shadow-sm">
                                <AlertTriangle size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-red-900">Raqam biriktirilmagan!</h4>
                                <p className="text-xs text-red-700 mt-0.5">Imtihon topshirish uchun profilga o'tib raqamingizni tasdiqlang.</p>
                            </div>
                        </div>
                    )}

                    <div className="max-w-6xl mx-auto">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={pathname}>
                            {children}
                        </motion.div>
                    </div>
                </main>
            </div>

            {/* Mobil Bottom Navigation (Faqat Telefonda) */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-2 pb-safe pt-2 z-50">
                <div className="flex items-center justify-around max-w-md mx-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname.startsWith(item.href)
                        const isLocked = item.disabled && !hasPhone;

                        return (
                            <Link 
                                key={item.href} 
                                href={isLocked ? "#" : item.href}
                                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all
                                ${isActive ? "text-[#17776A]" : "text-slate-400"}
                                ${isLocked ? "opacity-30 grayscale" : ""}`}
                            >
                                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                                <span className="text-[10px] font-bold tracking-tight">{item.name}</span>
                                {isActive && (
                                    <motion.div layoutId="bottomTab" className="w-1 h-1 bg-[#17776A] rounded-full mt-0.5" />
                                )}
                            </Link>
                        )
                    })}
                </div>
            </nav>
        </div>
    )
}