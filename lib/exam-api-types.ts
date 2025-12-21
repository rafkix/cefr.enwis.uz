export type QuestionType =
  | "TRUE_FALSE_NOT_GIVEN"
  | "MULTIPLE_CHOICE"
  | "GAP_FILL"
  | "TEXT_MATCH"
  | "HEADINGS_MATCH"
  | "MULTIPLE_SELECT"

export interface QuestionOption {
  value: string
  label?: string
}

export interface Question {
  id: number
  type: QuestionType
  text: string
  options?: QuestionOption[]
  correct_answer?: string
  explanation?: string
  word_limit?: number
}

export interface ExamPart {
  id: number
  passage: string
  questions: Question[]
}

export interface ExamSet {
  id: number
  title: string
  durationMinutes: number
  isFree: boolean
  parts: ExamPart[]
}
