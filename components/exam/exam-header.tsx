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


    return (
        <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm">
            {/* ================= LEFT: EXIT & BADGE ================= */}
            <div className="flex items-center gap-3">
                <Badge className="bg-blue-600 text-white border-none transition-colors">
                    O'qish qismi
                </Badge>
            </div>
        </header>
    )
}