'use client'

import React, { memo, useEffect, useMemo, useState } from 'react'
import { authService } from '@/lib/api/auth'

interface WritingHeaderProps {
  initialSeconds: number
  timeKey?: string | null
  onFinish: () => void
  isSubmitting: boolean
}

const WritingHeader = memo(function WritingHeader({
  initialSeconds,
  timeKey,
  onFinish,
  isSubmitting,
}: WritingHeaderProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(initialSeconds)
  const [fullName, setFullName] = useState<string>('Candidate')

  // get user
  useEffect(() => {
    let mounted = true
    authService
      .getMe()
      .then((res) => {
        if (!mounted) return
        setFullName(res?.profile?.full_name || 'Candidate')
      })
      .catch(() => {
        if (!mounted) return
        setFullName('Candidate')
      })
    return () => {
      mounted = false
    }
  }, [])

  // init timer from localStorage (if exists)
  useEffect(() => {
    if (!timeKey) {
      setTimeRemaining(initialSeconds)
      return
    }

    const saved = localStorage.getItem(timeKey)
    if (saved) {
      const v = Number(saved)
      if (Number.isFinite(v) && v >= 0) {
        setTimeRemaining(v)
        return
      }
    }

    localStorage.setItem(timeKey, String(initialSeconds))
    setTimeRemaining(initialSeconds)
  }, [timeKey, initialSeconds])

  // ticking
  useEffect(() => {
    if (isSubmitting) return
    if (timeRemaining <= 0) return

    const t = window.setInterval(() => {
      setTimeRemaining((prev) => {
        const next = Math.max(0, prev - 1)
        if (timeKey) localStorage.setItem(timeKey, String(next))
        return next
      })
    }, 1000)

    return () => window.clearInterval(t)
  }, [timeRemaining, timeKey, isSubmitting])

  // auto finish when time ends
  useEffect(() => {
    if (timeRemaining === 0) onFinish()
  }, [timeRemaining, onFinish])

  const formatted = useMemo(() => {
    const mins = Math.floor(timeRemaining / 60)
    const secs = timeRemaining % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }, [timeRemaining])

  return (
    <header className="w-full bg-[#F3F4F6] py-3 px-6 md:px-12 flex items-center justify-between border-b border-gray-200 shadow-sm">
      <div className="flex items-center gap-3">
        <img src="/writing.png" alt="writing" className="h-12 w-12" />
        <p className="hidden text-xs font-black uppercase tracking-widest text-gray-500 sm:inline-block leading-none">
          Yozish qismi
        </p>
        <h2 className="hidden text-xs font-black uppercase tracking-widest text-gray-900 sm:inline-block leading-none">
          {fullName}
        </h2>
      </div>

      <div className="flex-1 flex items-center justify-end gap-3 md:gap-6">
        <div className="bg-[#22D3EE] text-white px-8 py-2 rounded-lg shadow-md">
          <span className="text-xl md:text-2xl font-bold tabular-nums">{formatted}</span>
        </div>

        <button
          onClick={onFinish}
          disabled={isSubmitting}
          className="bg-[#00fdc9] hover:bg-red-500 text-white px-6 py-2 rounded-lg shadow-md font-bold text-lg md:text-xl transition-all active:scale-95 disabled:opacity-50"
          type="button"
        >
          {isSubmitting ? '...' : 'Yakunlash'}
        </button>
      </div>
    </header>
  )
})

export default WritingHeader