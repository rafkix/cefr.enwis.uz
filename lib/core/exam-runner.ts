// lib/core/exam-runner.ts

import { ExamWrapper } from "./exam-wrapper"
import { createExamSession, ExamSession } from "./exam-store"

export function startExam<T>(
  exam: ExamWrapper<T>
): ExamSession {
  return createExamSession(exam.meta.id)
}

export function submitAnswer(
  session: ExamSession,
  questionId: string | number,
  answer: any
): ExamSession {
  session.answers[questionId] = answer
  return session
}

export function finishExam(
  session: ExamSession
): ExamSession {
  session.finishedAt = Date.now()
  return session
}
