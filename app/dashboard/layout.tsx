'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'
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
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/AuthContext'
import TelegramPopup from '@/components/TelegramPopup'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user, loading: authLoading, logout } = useAuth()

  const isExamPage =
    pathname.includes('/test/listening') ||
    pathname.includes('/test/reading') ||
    pathname.includes('/test/writing')

  // =========================
  // ⏳ LOADING
  // =========================
  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-[#17776A]" />
      </div>
    )
  }

  // =========================
  // 🔥 REDIRECT (SAFE)
  // =========================
  useEffect(() => {
    if (typeof window === 'undefined') return

    if (!user && pathname.startsWith('/dashboard')) {
      const currentUrl = window.location.href

      window.location.href =
        `https://auth.enwis.uz?redirect=${encodeURIComponent(currentUrl)}`
    }
  }, [user, pathname])

  // ❗ user yo‘q → redirect bo‘ladi → lekin UI crash bo‘lmasin
  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  // =========================
  // 🎯 EXAM PAGE
  // =========================
  if (isExamPage) {
    return <div className="min-h-screen bg-white">{children}</div>
  }

  // =========================
  // 📲 TELEGRAM
  // =========================
  const TELEGRAM_URL = 'https://t.me/cefr_enwis'
  const [tgOpen, setTgOpen] = useState(false)

  useEffect(() => {
    try {
      const dismissed = sessionStorage.getItem('tg_popup_dismissed_session')
      if (dismissed) return

      const t = setTimeout(() => setTgOpen(true), 300)
      return () => clearTimeout(t)
    } catch { }
  }, [])

  const closeTg = useCallback(() => {
    setTgOpen(false)
    try {
      sessionStorage.setItem('tg_popup_dismissed_session', '1')
    } catch { }
  }, [])

  // =========================
  // 📱 SAFE USER CHECK
  // =========================
  const isVerifiedUser = useMemo(() => {
    if (!user || !Array.isArray(user.contacts)) return false

    return user.contacts.some(
      (c: any) => c.contact_type === 'phone' && c.is_verified
    )
  }, [user])

  // =========================
  // 📚 MENU
  // =========================
  const menuItems = [
    { name: 'Amaliyot', href: '/dashboard/test', icon: LayoutGrid },
    { name: 'Natijalar', href: '/dashboard/results', icon: FileText },
    { name: 'Profil', href: '/dashboard/profile', icon: User },
  ]

  const currentPage =
    menuItems.find((i) => pathname.startsWith(i.href))?.name || 'Boshqaruv'

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div className="min-h-screen bg-[#FDFDFD] flex text-slate-900">
      <TelegramPopup open={tgOpen} onClose={closeTg} telegramUrl={TELEGRAM_URL} />

      {/* SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r fixed h-full z-40">
        <div className="h-24 flex items-center px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#17776A] rounded-xl flex items-center justify-center text-white">
              <BrainCircuit size={22} />
            </div>
            <span className="font-black text-2xl text-[#17776A]">ENWIS</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl ${isActive
                    ? 'bg-[#17776A] text-white'
                    : 'text-slate-500 hover:bg-slate-50'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight size={16} />}
              </Link>
            )
          })}
        </nav>

        <div className="p-6">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-500"
          >
            <LogOut size={18} />
            Chiqish
          </button>
        </div>
      </aside>

      {/* CONTENT */}
      <div className="flex-1 lg:ml-72 flex flex-col">
        <header className="h-16 lg:h-24 px-6 flex items-center justify-between border-b bg-white">
          <h2 className="font-bold text-xl">{currentPage}</h2>

          <div className="flex items-center gap-3">
            {!isVerifiedUser && (
              <Link
                href="/dashboard/profile"
                className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs"
              >
                Tasdiqlanmagan
              </Link>
            )}

            <button className="p-2 bg-slate-100 rounded-lg">
              <Bell size={18} />
            </button>
          </div>
        </header>

        <main className="p-6">
          <AnimatePresence>
            {!isVerifiedUser && pathname !== '/dashboard/profile' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 bg-amber-50 border rounded-xl flex justify-between"
              >
                <span>Telefon tasdiqlanmagan</span>
                <Link href="/dashboard/profile">Tasdiqlash</Link>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="max-w-6xl mx-auto">
            <motion.div key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}