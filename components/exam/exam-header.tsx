"use client"

import { useEffect, useState } from "react"
import {
    Clock,
    User,
    BookOpen,
    Headphones,
    PenTool,
    Mic,
    Loader2
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { authService } from "@/lib/api/auth" // API funksiyangiz

type SectionType = "reading" | "listening" | "writing" | "speaking" | "process"

interface ExamHeaderProps {
    initialSeconds?: number
    currentSection: SectionType
}

const SECTION_CONFIG = {
    reading: {
        label: "O'qish qismi",
        icon: BookOpen,
        color: "bg-blue-600",
    },
    listening: {
        label: "Tinglash qismi",
        icon: Headphones,
        color: "bg-indigo-600",
    },
    writing: {
        label: "Yozish qismi",
        icon: PenTool,
        color: "bg-orange-600",
    },
    speaking: {
        label: "Gapirish qismi",
        icon: Mic,
        color: "bg-red-600",
    },
    process: {
        label: "Jarayaon",
        icon: Mic,
        color: "bg-green-600",
    }
}

export default function ExamHeader({
    initialSeconds = 3600,
    currentSection = "reading",
}: ExamHeaderProps) {
    const [timeRemaining, setTimeRemaining] = useState(initialSeconds)
    const [userData, setUserData] = useState<{ full_name: string; avatar_url?: string } | null>(null)
    const [loadingUser, setLoadingUser] = useState(true)

    // 1. Foydalanuvchi ma'lumotlarini olish
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await authService.getMe()
                setUserData(res.profile)
            } catch (err) {
                console.error("User fetch error in header:", err)
            } finally {
                setLoadingUser(false)
            }
        }
        fetchUser()
    }, [])

    // 2. Timer logikasi
    useEffect(() => {
        if (timeRemaining <= 0) return
        const timer = setInterval(() => {
            setTimeRemaining((prev) => prev - 1)
        }, 1000)
        return () => clearInterval(timer)
    }, [timeRemaining])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const activeConfig = SECTION_CONFIG[currentSection]
    const ActiveIcon = activeConfig.icon

    // Ismning birinchi harflarini olish (Avatar fallback uchun)
    const getInitials = (name: string) => {
        return name?.split(" ").map(n => n[0]).join("").toUpperCase() || "U"
    }

    return (
        <header className="sticky top-0 z-30 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
            <div className="flex items-center justify-between px-4 py-3 md:px-8">

                {/* CHAP TOMON: BO'LIM NOMI */}
                <div className="flex items-center gap-3">
                    <Badge
                        className={`${activeConfig.color} flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm font-bold text-white border-none shadow-md`}
                    >
                        <ActiveIcon className="h-4 w-4" />
                        {activeConfig.label}
                    </Badge>
                    <div className="hidden h-6 w-px bg-gray-200 sm:block" />
                    <span className="hidden text-xs font-black uppercase tracking-widest text-gray-400 sm:inline-block">
                        Exam Session
                    </span>
                </div>

                {/* O'RTA: TIMER
                <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-colors ${timeRemaining < 300 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-50 text-slate-700'}`}>
                    <Clock size={18} className={timeRemaining < 300 ? 'text-red-500' : 'text-slate-400'} />
                    <span className="text-lg font-black tabular-nums tracking-tight">
                        {formatTime(timeRemaining)}
                    </span>
                </div> */}

                {/* O'NG TOMON: FOYDALANUVCHI PROFILI */}
                <div className="flex items-center gap-4">
                    <div className="hidden text-right sm:block">
                        {loadingUser ? (
                            <div className="h-4 w-32 bg-slate-100 animate-pulse rounded" />
                        ) : (
                            <>
                                <p className="text-sm font-black text-slate-900 leading-none mb-1">
                                    {userData?.full_name || "Foydalanuvchi"}
                                </p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Candidate</p>
                            </>
                        )}
                    </div>

                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100">
                        <AvatarImage src={userData?.avatar_url} />
                        <AvatarFallback className="bg-[#17776A] text-white font-bold text-xs">
                            {loadingUser ? <Loader2 className="h-4 w-4 animate-spin" /> : getInitials(userData?.full_name || "User")}
                        </AvatarFallback>
                    </Avatar>
                </div>

            </div>
        </header>
    )
}