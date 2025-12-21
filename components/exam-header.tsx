"use client"

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