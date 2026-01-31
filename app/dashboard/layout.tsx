"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
    LayoutGrid, FileText, User, LogOut, Menu, X, Loader2, BrainCircuit, ChevronRight, Bell, BookCheck
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { meAPI } from "@/lib/api/auth"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const pathname = usePathname()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [userData, setUserData] = useState<any>(null)

    const isExamPage = pathname.includes("/test/listening/") || pathname.includes("/test/reading/")

    // 1. Foydalanuvchi ma'lumotlarini yuklash va Seansni tekshirish (2 kunlik mantiq bilan)
    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token")
            const loginAt = localStorage.getItem("login_at")
            const TWO_DAYS = 2 * 24 * 60 * 60 * 1000;

            if (!token || !loginAt || (new Date().getTime() - parseInt(loginAt) > TWO_DAYS)) {
                localStorage.clear()
                router.replace("/auth/phone")
                return
            }

            try {
                const response = await meAPI()
                setUserData(response.data)
            } catch (err: any) {
                if (err.response?.status === 401) {
                    localStorage.clear()
                    router.replace("/auth/phone")
                }
            } finally {
                setIsLoading(false)
            }
        }
        fetchUser()
    }, [router])

    // Sahifa o'zgarganda mobil menyuni yopish
    useEffect(() => {
        setIsMobileMenuOpen(false)
    }, [pathname])

    const handleLogout = () => {
        localStorage.clear()
        router.push("/auth/phone")
    }

    if (isLoading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-white">
                <Loader2 className="w-10 h-10 animate-spin text-[#17776A]" />
            </div>
        )
    }

    if (isExamPage) {
        return <div className="min-h-screen bg-white">{children}</div>
    }

    const menuItems = [
        { name: "Imthon", href: "/dashboard/exams", icon: BookCheck },
        { name: "Amaliyot", href: "/dashboard/test", icon: LayoutGrid },
        { name: "Natijalar", href: "/dashboard/result", icon: FileText },
        { name: "Profil", href: "/dashboard/profile", icon: User },
    ]

    const currentPage = menuItems.find(i => pathname.startsWith(i.href))?.name || "Boshqaruv"

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex font-sans selection:bg-[#17776A]/10 text-slate-900 overflow-x-hidden">

            {/* Desktop Sidebar (Faqat katta ekranlarda) */}
            <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 fixed h-full z-40">
                <div className="h-24 flex items-center px-8">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#17776A] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#17776A]/20">
                            <BrainCircuit size={22} />
                        </div>
                        <span className="font-black text-2xl tracking-tighter uppercase">ENWIS</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname.startsWith(item.href)
                        return (
                            <Link key={item.href} href={item.href}
                                className={`group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300
                                ${isActive ? "bg-[#17776A] text-white shadow-md shadow-[#17776A]/20" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>
                                <div className="flex items-center gap-3.5">
                                    <item.icon size={20} />
                                    <span className="font-bold text-sm tracking-tight">{item.name}</span>
                                </div>
                                {isActive && <ChevronRight size={16} />}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-6">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-6 py-4 w-full rounded-2xl font-bold text-sm text-red-500 bg-red-50 hover:bg-red-100 transition-all">
                        <LogOut size={18} />
                        <span>Chiqish</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar (Drawer) */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Qora fon (Overlay) */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[50] lg:hidden"
                        />
                        {/* Menyu paneli */}
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-80 bg-white z-[60] lg:hidden flex flex-col shadow-2xl"
                        >
                            <div className="h-20 flex items-center justify-between px-8 border-b border-slate-50">
                                <Link href="/" className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-[#17776A] rounded-lg flex items-center justify-center text-white">
                                        <BrainCircuit size={20} />
                                    </div>
                                    <span className="font-black text-xl tracking-tighter uppercase">ENWIS</span>
                                </Link>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400">
                                    <X size={24} />
                                </button>
                            </div>

                            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                                {menuItems.map((item) => {
                                    const isActive = pathname.startsWith(item.href)
                                    return (
                                        <Link key={item.href} href={item.href}
                                            className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-base transition-all
                                            ${isActive ? "bg-[#17776A] text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"}`}>
                                            <item.icon size={22} />
                                            <span>{item.name}</span>
                                        </Link>
                                    )
                                })}
                            </nav>

                            <div className="p-6 border-t border-slate-50">
                                <button onClick={handleLogout} className="flex items-center gap-4 px-6 py-4 w-full rounded-2xl font-bold text-red-500 bg-red-50">
                                    <LogOut size={20} />
                                    <span>Chiqish</span>
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:ml-72 min-w-0">
                {/* Header: Mobil va Desktop uchun optimallashgan */}
                <header className="h-20 lg:h-24 px-4 lg:px-12 sticky top-0 bg-white/80 backdrop-blur-md z-30 border-b border-slate-100/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                            <Menu size={24} />
                        </button>
                        <div className="flex flex-col">
                            <h2 className="font-black text-lg lg:text-2xl tracking-tight text-slate-900 truncate max-w-[150px] sm:max-w-none">
                                {currentPage}
                            </h2>
                            <p className="hidden md:block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                Xush kelibsiz, {userData?.full_name?.split(' ')[0] || 'Foydalanuvchi'}!
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-6">
                        <button className="relative p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>

                        <div className="w-px h-8 bg-slate-100 hidden sm:block"></div>

                        {/* Profil qismi: Mobil ekranlarda faqat rasm qolishi mumkin */}
                        <Link href="/dashboard/profile" className="flex items-center gap-2 lg:gap-3 group shrink-0">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-sm font-black text-slate-900 group-hover:text-[#17776A] transition-colors line-clamp-1">
                                    {userData?.full_name || 'Foydalanuvchi'}
                                </span>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                                    {userData?.phone || 'Profil'}
                                </span>
                            </div>
                            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-slate-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center group-hover:border-[#17776A]/20 transition-all">
                                {userData?.full_name ? (
                                    <img
                                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData.full_name}&backgroundColor=17776A&fontColor=ffffff`}
                                        alt="User"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User size={20} className="text-[#17776A]" />
                                )}
                            </div>
                        </Link>
                    </div>
                </header>

                {/* Asosiy Content: Mobil paddinglar bilan */}
                <main className="p-4 lg:p-12 min-h-[calc(100vh-5rem)]">
                    <div className="max-w-6xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={pathname} // Har bir sahifa almashganda animatsiya bo'ladi
                        >
                            {children}
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    )
}