"use client"

<<<<<<< HEAD
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Clock, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ExamHeaderProps {
  initialSeconds?: number
  partLabel?: string
}

export default function ExamHeader({
  initialSeconds = 3600,
  partLabel = "Reading Section",
}: ExamHeaderProps) {
  const router = useRouter()
  const [timeRemaining, setTimeRemaining] = useState(initialSeconds)

  // Taymer hisoblash mantig'i
  useEffect(() => {
    if (timeRemaining <= 0) return
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [timeRemaining])

  // Vaqtni HH:MM:SS formatiga o'tkazish
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm">
      {/* ================= LEFT: EXIT & BADGE ================= */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="
            text-green-600 
            hover:text-green-800 
            hover:bg-green-100 
            transition-colors
            font-semibold
          "
          onClick={() => router.push("/test/reading")} // O'zingizga kerakli pathga o'zgartiring
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Exit Test</span>
          <span className="sm:hidden">Exit</span>
        </Button>
        <Badge className="bg-green-100 text-green-700 border-none hover:bg-green-200 transition-colors">
          CEFR
        </Badge>
      </div>

      {/* ================= RIGHT: TIMER & MOBILE EYE ================= */}
      <div className="flex items-center gap-3 font-bold">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border ${
          timeRemaining < 300 ? "bg-green-50 text-green-600 border-green-200" : "bg-green-50 text-green-700 border-green-100"
        }`}>
          <Clock className={`h-4 w-4 ${timeRemaining < 300 ? "animate-pulse" : ""}`} />
          <span className="font-mono text-sm sm:text-base">
            {formatTime(timeRemaining)}
          </span>
        </div>

        {/* 📱 MOBILE TOGGLE (Savollarni ko'rish tugmasi) */}
        <Button
          size="icon"
          variant="outline"
          className="lg:hidden border-orange-200 text-orange-600 hover:bg-orange-50"
          onClick={() => {
            // Bu yerda savollar ro'yxatini ochish funksiyasi bo'ladi
            console.log("Show questions clicked");
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
=======
export default function ExamHeader({
  timeLeft,
  title = "Cefr",
  partLabel = "Reading",
}: {
  timeLeft: string
  title?: string
  partLabel?: string
}) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-300">
      {/* ================= DESKTOP ================= */}
      <div className="hidden lg:flex items-center justify-between px-6 py-3">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-red-600">{title}</span>
          <span className="text-sm text-gray-700">Test taker ID</span>
        </div>

        {/* CENTER */}
        <div className="flex-1 text-center">
          <span className="text-sm font-semibold text-gray-700">
            {partLabel}
          </span>
        </div>

        {/* ICONS */}
        <div className="flex items-center gap-4">
          <HeaderIcon />
          <HeaderIcon />
          <HeaderIcon />
        </div>

        {/* TIMER */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600">
            Time Remaining:
          </span>
          <div className="font-mono text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded border border-red-200">
            {timeLeft}
          </div>
        </div>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="lg:hidden flex flex-col px-4 py-2 gap-1">
        {/* TOP ROW */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-red-600">{title}</span>

          <div className="font-mono text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">
            {timeLeft}
          </div>
        </div>

        {/* BOTTOM ROW */}
        <div className="text-center">
          <span className="text-xs font-semibold text-gray-700">
            {partLabel}
          </span>
        </div>
      </div>
    </header>
  )
}

/* ================= ICON COMPONENT ================= */
function HeaderIcon() {
  return (
    <svg
      className="w-4 h-4 text-gray-600"
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M2.5 5A1.5 1.5 0 016 3.5h8A1.5 1.5 0 0115.5 5v10a1.5 1.5 0 01-1.5 1.5H6A1.5 1.5 0 012.5 5z" />
    </svg>
  )
}
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
