// lib/exams/listening/types.ts

export type ListeningQuestionType =
  | "multiple-choice"
  | "gap-fill"
  | "matching"
  | "map-labeling"

export interface ListeningQuestion {
  questionNumber: number
  type: ListeningQuestionType
  question?: string
  options?: string[]
  correctAnswer: string | number
}

export interface ListeningPart {
  partNumber: number
  title: string
  instruction: string
  taskType: string
  context?: string
  audioLabel: string
  questions: ListeningQuestion[]
}

export interface ListeningTest {
  id: string
  title: string

  isDemo: boolean
  isFree: boolean

  cefrLevel: string
  durationMinutes: number
  totalQuestions: number

  parts: ListeningPart[]
}
