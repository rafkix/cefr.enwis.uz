"use client"

import { Lock, Clock, FileText, BarChart2 } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ReadingTest } from "@/lib/reading-tests-data"

interface TestCardProps {
  test: ReadingTest
  isUnlocked: boolean
  onClick: () => void
}

export function TestCard({ test, isUnlocked, onClick }: TestCardProps) {
  const isAccessible = test.isFree || isUnlocked

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${!isAccessible ? "opacity-75" : ""}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">{test.title}</h3>
          {test.isFree ? (
            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
              Free
            </Badge>
          ) : !isUnlocked ? (
            <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-100">
              Premium
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
              Unlocked
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">Parts: 1, 2, 3 • {test.cefrLevel} Level</p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <BarChart2 className="h-4 w-4" />
            <span className="uppercase">{test.cefrLevel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>
              {test.durationMinutes} min {test.durationMinutes % 60} s
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            <span>{test.questionCount} questions</span>
          </div>
        </div>
        {!isAccessible && (
          <div className="mt-3 flex items-center gap-2 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            <Lock className="h-4 w-4" />
            <span>Enter Access Code to Unlock</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
