// lib/core/exam-store.ts

export interface ExamSession {
  examId: string
  startedAt: number
  finishedAt?: number

  answers: Record<string | number, any>
}

export function createExamSession(examId: string): ExamSession {
  return {
    examId,
    startedAt: Date.now(),
    answers: {},
  }
}
