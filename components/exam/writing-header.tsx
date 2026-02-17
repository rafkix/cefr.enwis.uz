'use client'

import { useEffect, useState, memo } from 'react'
import { authService } from '@/lib/api/auth'

interface WritingHeaderProps {
  initialSeconds?: number
  onFinish: () => void
  isSubmitting: boolean
}

const SECTION_CONFIG = {
  writing: { label: 'Yozish qismi', icon: '/writing.png' },
}

const WritingHeader = memo(
  ({ initialSeconds = 3600, onFinish, isSubmitting }: WritingHeaderProps) => {
    const [timeRemaining, setTimeRemaining] = useState(initialSeconds)
    const [fullName, setFullName] = useState<string>('')

    // Foydalanuvchi ismini olish
    useEffect(() => {
      authService
        .getMe()
        .then((res) => setFullName(res.profile.full_name))
        .catch(() => setFullName('Candidate'))
    }, [])

    // Taymer
    useEffect(() => {
      if (timeRemaining <= 0) {
        onFinish()
        return
      }
      const timer = setInterval(() => setTimeRemaining((prev) => prev - 1), 1000)
      return () => clearInterval(timer)
    }, [timeRemaining, onFinish])

    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    const activeConfig = SECTION_CONFIG['writing']
    // Ikonka turini aniqlaymiz
    const IconContent = activeConfig.icon

    return (
      <header className="w-full bg-[#F3F4F6] py-3 px-6 md:px-12 flex items-center justify-between border-b border-gray-200 shadow-sm">
        {/* 1. Chap tomonda: Bo'lim nomi */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center  text-orange-500">
            {typeof IconContent === 'string' ? (
              <img src={IconContent} alt="section icon" className="h-12 w-12" />
            ) : (
              // @ts-ignore - Lucide icon component
              <IconContent className="h-10 w-10" />
            )}
          </div>
          <p className="hidden text-xs font-black uppercase tracking-widest text-gray-500 sm:inline-block leading-none">
            Yozish qismi
          </p>

          <h2 className="hidden text-xs font-black uppercase tracking-widest text-gray-900 sm:inline-block leading-none">
            {fullName}
          </h2>
        </div>

        {/* 3. O'ng tomonda: Taymer va Yakunlash */}
        <div className="flex-1 flex items-center justify-end gap-3 md:gap-6">
          {/* Timer tugmasi ko'rinishida */}
          <div className="bg-[#22D3EE] text-white px-8 py-2 rounded-lg shadow-md">
            <span className="text-xl md:text-2xl font-bold tabular-nums">
              {timeRemaining > 0 ? formatTime(timeRemaining) : 'timer'}
            </span>
          </div>

          {/* Yakunlash tugmasi */}
          <button
            onClick={onFinish}
            disabled={isSubmitting}
            className="bg-[#00fdc9] hover:bg-red-500 text-white px-6 py-2 rounded-lg shadow-md font-bold text-lg md:text-xl transition-all active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? '...' : 'Yakunlash'}
          </button>
        </div>
      </header>
    )
  }
)

export default WritingHeader
