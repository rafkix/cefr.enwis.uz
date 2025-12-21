// lib/core/exam-meta.ts

export type ExamSkill = "reading" | "listening" | "writing" | "speaking"

export interface ExamMeta {
  id: string
  title: string
  skill: ExamSkill

  cefrLevel: "A1" | "A2" | "B1" | "B2" | "C1"
  durationMinutes: number

  totalQuestions?: number

  isDemo?: boolean
  isFree: boolean

  requiresAccessCode?: boolean
  accessCode?: string
}
