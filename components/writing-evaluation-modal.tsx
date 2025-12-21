"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { CheckCircle2, AlertCircle, TrendingUp } from "lucide-react"
import type { EvaluationResult } from "@/lib/writing-data"

interface WritingEvaluationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  evaluation: EvaluationResult | null
  taskPart: string
}

export function WritingEvaluationModal({ open, onOpenChange, evaluation, taskPart }: WritingEvaluationModalProps) {
  if (!evaluation) return null

  const maxScore = taskPart === "1.1" ? 20 : 24
  const certificateScore = Math.round((evaluation.overallScore / maxScore) * 100)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Writing Evaluation Results</DialogTitle>
        </DialogHeader>

        {/* Score Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-2 border-green-200 bg-green-50 p-4">
            <div className="text-sm text-green-700">Expert Mark</div>
            <div className="text-3xl font-bold text-green-600">
              {evaluation.overallScore}/{maxScore}
            </div>
          </Card>

          <Card className="border-2 border-yellow-200 bg-yellow-50 p-4">
            <div className="text-sm text-yellow-700">Certificate Score</div>
            <div className="text-3xl font-bold text-yellow-600">{certificateScore}/100</div>
          </Card>

          <Card className="border-2 border-blue-200 bg-blue-50 p-4">
            <div className="text-sm text-blue-700">CEFR Level</div>
            <div className="text-3xl font-bold text-blue-600">{evaluation.cefrLevel}</div>
          </Card>
        </div>

        {/* Score Breakdown */}
        <div className="mt-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Score Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(evaluation.criteria).map(([key, value]) => (
              <Card key={key} className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium capitalize text-gray-900">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    {value.score}/{taskPart === "1.1" ? 5 : 6}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{value.comment}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div className="mt-6">
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">Strengths</h3>
          </div>
          <div className="space-y-2">
            {evaluation.strengths.map((strength, index) => (
              <div key={index} className="flex items-start gap-2 rounded-lg bg-green-50 p-3">
                <span className="text-green-600">•</span>
                <span className="text-sm text-gray-700">{strength}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Areas for Improvement */}
        <div className="mt-6">
          <div className="mb-3 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-900">Areas for Improvement</h3>
          </div>
          <div className="space-y-2">
            {evaluation.improvements.map((improvement, index) => (
              <div key={index} className="flex items-start gap-2 rounded-lg bg-orange-50 p-3">
                <span className="text-orange-600">•</span>
                <span className="text-sm text-gray-700">{improvement}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Examiner Summary */}
        <div className="mt-6">
          <div className="mb-3 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Examiner Summary</h3>
          </div>
          <Card className="bg-blue-50 p-4">
            <p className="text-sm leading-relaxed text-gray-700">{evaluation.examinerSummary}</p>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
