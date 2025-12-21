/* =====================================================
   GLOBAL ENUMS & ALIASES
===================================================== */

export type ExamType =
  | 'reading'
  | 'listening'
  | 'writing'
  | 'speaking'

export type CEFRLevel = 'A2' | 'B1' | 'B2' | 'C1'

export type PartType =
  | 'GAP_FILL'
  | 'MATCH_HEADINGS'
  | 'MULTIPLE_CHOICE'
  | 'TRUE_FALSE_NOT_GIVEN'
  | 'ESSAY'
  | 'SPEAKING'

export type QuestionType =
  | 'GAP_FILL'
  | 'MULTIPLE_CHOICE'
  | 'TRUE_FALSE_NOT_GIVEN'
  | 'MATCH'
  | 'ESSAY'
  | 'SPEAKING'

export type Answer =
  | string
  | string[]
  | boolean
  | number
  | null

/* =====================================================
   ROOT EXAM
===================================================== */

export interface Exam {
  meta: ExamMeta
  parts: ExamPart[]
}

/* =====================================================
   METADATA
===================================================== */

export interface ExamMeta {
  id: string
  type: ExamType
  level: CEFRLevel
  title?: string
  description?: string
  duration: number // minutes
}

/* =====================================================
   PART (SECTION)
===================================================== */

export interface ExamPart {
  id: string
  type: PartType
  title?: string
  instruction?: string

  /**
   * Reading: passage
   * Listening: audio reference
   * Writing: task prompt
   * Speaking: topic / scenario
   */
  content?: string

  questions: ExamQuestion[]
}

/* =====================================================
   SPEAKING-SPECIFIC PAYLOAD
===================================================== */

export interface SpeakingPayload {
  audioPrompt?: string          // examiner audio
  preparationTime?: number      // seconds
  responseTime?: number         // seconds
  rubricId?: string             // grading rubric reference
}

/* =====================================================
   QUESTION
===================================================== */

export interface ExamQuestion {
  id: string
  type: QuestionType

  prompt: string

  /* MCQ / MATCH */
  options?: string[]

  /* AUTO GRADING (reading / listening) */
  correctAnswer?: Answer

  /* MAX POINTS */
  points: number

  /* SPEAKING ONLY */
  speaking?: SpeakingPayload

  /* RUNTIME */
  userAnswer?: Answer
}

/* =====================================================
   GRADING RESULT
===================================================== */

export interface QuestionResult {
  questionId: string
  correct?: boolean             // undefined for speaking
  earnedPoints: number
  feedback?: string
}

export interface ExamResult {
  examId: string
  totalPoints: number
  earnedPoints: number
  results: QuestionResult[]

  /* Speaking / Writing extensions */
  bandScore?: number
  rubricScores?: Record<string, number>
}

/* =====================================================
   BUILDER CONTRACT
===================================================== */

export interface ExamBuilder {
  (id?: string): Exam
}

/* =====================================================
   STORE STATE
===================================================== */

export interface ExamState {
  exam: Exam
  startedAt: number
  finishedAt?: number
  answers: Record<string, Answer>
}

/* =====================================================
   RUNNER API
===================================================== */

export interface ExamRunner {
  start(exam: Exam): void
  answer(questionId: string, answer: Answer): void
  finish(): ExamResult
}
