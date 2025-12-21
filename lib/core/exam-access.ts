// lib/core/exam-access.ts
import { ExamMeta } from "./exam-meta"

export function canAccessExam(
  meta: ExamMeta,
  accessCode?: string
): boolean {
  if (meta.isFree) return true

  if (meta.requiresAccessCode) {
    return meta.accessCode === accessCode
  }

  return false
}
