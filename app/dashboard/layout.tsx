'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  LayoutGrid,
  FileText,
  User,
  LogOut,
  Loader2,
  BrainCircuit,
  ChevronRight,
  Bell,
  BookCheck,
  AlertTriangle,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/AuthContext'
import TelegramPopup from '@/components/TelegramPopup'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading: authLoading, logout } = useAuth()

  // ✅ Exam page aniqlash (HOOKLARDAN OLDIN bo‘lsin)
  const isExamPage =
    pathname.includes('/test/listening') ||
    pathname.includes('/test/reading') ||
    pathname.includes('/test/writing')

  // ✅ Telegram popup
  const TELEGRAM_URL = 'https://t.me/cefr_enwis'
  const [tgOpen, setTgOpen] = useState(false)

  // ✅ faqat shu sessiyada yopilganini eslab qolish
  // dashboardga kirganda yoki examdan qaytganda ochiladi (agar sessiyada yopilmagan bo‘lsa)
  useEffect(() => {
    if (isExamPage) return
    if (!pathname.startsWith('/dashboard')) return
    if (authLoading) return
    if (!user) return // login bo'lmasa popup kerakmas

    try {
      const dismissed = sessionStorage.getItem('tg_popup_dismissed_session')
      if (dismissed) return

      // dashboardga kirgan zahoti chiqsin (xohlasang delay qoldir)
      const t = window.setTimeout(() => setTgOpen(true), 300)
      return () => window.clearTimeout(t)
    } catch {
      // sessionStorage blok bo‘lsa — hech narsa qilmaymiz (popup chiqmasin)
    }
  }, [pathname, isExamPage, authLoading, user])

  const closeTg = useCallback(() => {
    setTgOpen(false)
    try {
      sessionStorage.setItem('tg_popup_dismissed_session', '1')
    } catch {}
  }, [])

  // 1. RAQAM TASDIQLANGANLIGINI TEKSHIRISH
  const isVerifiedUser = useMemo(() => {
    if (!user?.contacts) return false
    return user.contacts.some(
      (c: any) => c.contact_type === 'phone' && c.is_verified === true
    )
  }, [user])

  // 2. FAQAT LOGIN TEKSHIRUVI
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/auth/login')
    }
  }, [user, authLoading, router])

  if (authLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white text-[#17776A]">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    )
  }

  // ✅ Exam page’da popup ham, layout ham aralashmasin
  if (isExamPage) return <div className="min-h-screen bg-white">{children}</div>

  // 3. MENYU ELEMENTLARI
  const menuItems = [
    { name: 'Imtihon', href: '/dashboard/exams', icon: BookCheck, disabled: false },
    { name: 'Amaliyot', href: '/dashboard/test', icon: LayoutGrid, disabled: false },
    { name: 'Natijalar', href: '/dashboard/results', icon: FileText, disabled: false },
    { name: 'Profil', href: '/dashboard/profile', icon: User, disabled: false },
  ]

  const currentPage =
    menuItems.find((i) => pathname.startsWith(i.href))?.name || 'Boshqaruv'

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex font-sans text-slate-900">
      {/* ✅ Telegram popup */}
      <TelegramPopup open={tgOpen} onClose={closeTg} telegramUrl={TELEGRAM_URL} />

      {/* --- SIDEBAR --- */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-slate-100 fixed h-full z-40">
        <div className="h-24 flex items-center px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#17776A] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#17776A]/20">
              <BrainCircuit size={22} />
            </div>
            <span className="font-black text-2xl tracking-tighter uppercase text-[#17776A]">
              ENWIS
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 mt-4">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all cursor-pointer
                  ${
                    isActive
                      ? 'bg-[#17776A] text-white shadow-md'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
              >
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
          <button
            onClick={logout}
            className="flex items-center gap-3 px-6 py-4 w-full rounded-2xl font-bold text-sm text-red-500 bg-red-50 hover:bg-red-100 transition-all"
          >
            <LogOut size={18} />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 flex flex-col lg:ml-72 min-w-0 pb-24 lg:pb-0">
        <header className="h-16 lg:h-24 px-4 lg:px-12 sticky top-0 bg-white/80 backdrop-blur-md z-30 border-b border-slate-100/50 flex items-center justify-between">
          <h2 className="font-black text-lg lg:text-2xl tracking-tight">{currentPage}</h2>

          <div className="flex items-center gap-3">
            {!isVerifiedUser && (
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-amber-700 hover:bg-amber-100 transition-all"
              >
                <AlertTriangle size={14} className="animate-pulse" />
                <span className="text-[10px] lg:text-xs font-bold uppercase tracking-wider">
                  Tasdiqlanmagan
                </span>
              </Link>
            )}
            <button className="p-2 text-slate-500 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
              <Bell size={18} />
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-12">
          <AnimatePresence>
            {!isVerifiedUser && pathname !== '/dashboard/profile' && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8 p-4 bg-gradient-to-r from-amber-50 to-white border border-amber-100 rounded-3xl flex items-center justify-between shadow-sm shadow-amber-100/50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm">
                    <AlertTriangle size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800 tracking-tight">
                      Profilni to'ldiring
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Telefon raqamingiz tasdiqlanmagan. To'liq xavfsizlik uchun raqamni ulang.
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard/profile"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20"
                >
                  Tasdiqlash
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={pathname}>
              {children}
            </motion.div>
          </div>
        </main>
      </div>

      {/* --- MOBILE NAVIGATION --- */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-2 pb-safe pt-2 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  isActive ? 'text-[#17776A]' : 'text-slate-400'
                }`}
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