"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { 
    LayoutGrid, FileText, User, LogOut, Menu, X, Loader2, BrainCircuit, ChevronRight, Bell, Settings
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

// 1. To'g'ri API funksiyasini import qilamiz
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

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token")
            
            // Agar token bo'lmasa, srazu authga
            if (!token) {
                router.replace("/auth/phone")
                return
            }

            try {
                // 2. fetch o'rniga meAPI() ishlatamiz (axios interceptor headerlarni o'zi qo'shadi)
                const response = await meAPI()
                
                // Axios response ma'lumotlari response.data ichida bo'ladi
                setUserData(response.data)
            } catch (err: any) {
                console.error("User fetch error:", err)
                // 3. Agar 401 (Unauthorized) bo'lsa tokenni o'chirib login sahifasiga qaytaramiz
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

    // Exam page bo'lsa layoutni o'chirib faqat contentni o'zini chiqaramiz
    if (isExamPage) {
        return <div className="min-h-screen bg-white">{children}</div>
    }

    const menuItems = [
        { name: "Imtihonlar", href: "/dashboard/test", icon: LayoutGrid },
        { name: "Natijalar", href: "/dashboard/result", icon: FileText },
        { name: "Profil", href: "/dashboard/profile", icon: User },
    ]

    const currentPage = menuItems.find(i => pathname.startsWith(i.href))?.name || "Boshqaruv Paneli"

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex font-sans selection:bg-[#17776A]/10 text-slate-900">
            {/* Sidebar qismi (Ozgarishsiz qoladi) */}
            <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 fixed h-full z-20">
                <div className="h-24 flex items-center px-8">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-[#17776A] rounded-xl flex items-center justify-center text-white shadow-lg">
                            <BrainCircuit size={22} />
                        </div>
                        <span className="font-black text-2xl tracking-tighter uppercase">ENWIS</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1.5">
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

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:ml-72 transition-all">
                <header className="h-20 lg:h-24 px-6 lg:px-12 sticky top-0 bg-white/70 backdrop-blur-xl z-10 border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-2.5 bg-slate-100 rounded-xl"><Menu size={22}/></button>
                        <div>
                            <h2 className="font-black text-xl lg:text-2xl tracking-tight text-slate-900">{currentPage}</h2>
                            <p className="hidden md:block text-[10px] text-slate-400 font-bold uppercase">Xush kelibsiz, {userData?.full_name?.split(' ')[0] || 'Foydalanuvchi'}!</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 lg:gap-6">
                        <button className="relative p-3 bg-slate-50 rounded-2xl text-slate-500"><Bell size={20} /></button>
                        <div className="w-px h-8 bg-slate-100 hidden sm:block"></div>
                        
                        {/* 4. Profil qismida dinamik ma'lumotlar */}
                        <Link href="/dashboard/profile" className="flex items-center gap-3 group">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-sm font-black text-slate-900 group-hover:text-[#17776A] transition-colors">
                                    {userData?.full_name || 'Ism kiritilmagan'}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">
                                    {userData?.phone || 'Raqam yoq'}
                                </span>
                            </div>
                            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-slate-100 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
                                {userData?.full_name ? (
                                    <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData.full_name}`} alt="User" />
                                ) : (
                                    <User size={20} className="text-[#17776A]" />
                                )}
                            </div>
                        </Link>
                    </div>
                </header>

                <main className="p-6 lg:p-12">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
                        {children}
                    </motion.div>
                </main>
            </div>
            {/* Mobile Sidebar overlay (ozgarishsiz qoladi) */}
        </div>
    )
}