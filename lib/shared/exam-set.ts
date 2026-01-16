// lib/shared/exam-set.ts

export type QuestionType =
  | "MULTIPLE_CHOICE"
  | "TRUE_FALSE_NOT_GIVEN"
  | "GAP_FILL"
  | "MATCHING"
  | "HEADINGS_MATCH"

export interface BaseQuestion {
  id: number | string
  type: QuestionType
  question: string
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: "MULTIPLE_CHOICE"
  options: string[]
  correctAnswer: string
}

export interface TrueFalseNotGivenQuestion extends BaseQuestion {
  type: "TRUE_FALSE_NOT_GIVEN"
  correctAnswer: "TRUE" | "FALSE" | "NOT_GIVEN"
}

export interface GapFillQuestion extends BaseQuestion {
  type: "GAP_FILL"
  correctAnswer: string | string[]
}

export interface MatchingQuestion extends BaseQuestion {
  type: "MATCHING" | "HEADINGS_MATCH"
  options: string[]
  correctAnswer: Record<string, string>
}

export type Question =
  | MultipleChoiceQuestion
  | TrueFalseNotGivenQuestion
  | GapFillQuestion
  | MatchingQuestion

export interface ExamPart {
  id: string
  title?: string
  passage?: string
  questions: Question[]
}

export interface ExamSet {
  id: string
  title: string

  level: string
  language: string

  durationMinutes: number
  totalQuestions: number

  parts: ExamPart[]
}
