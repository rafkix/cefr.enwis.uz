// lib/grading.ts
import type { Question } from "./exam-data"

export function checkAnswer(
  question: Question,
  userAnswer?: string
): boolean {
  if (!userAnswer || !question.correct_answer) return false

  const correct = question.correct_answer.trim().toLowerCase()
  const answer = userAnswer.trim().toLowerCase()

  switch (question.type) {
    case "GAP_FILL": {
      if (question.word_limit) {
        const words = answer.split(/\s+/)
        if (words.length > question.word_limit) return false
      }
      return answer === correct
    }

    case "TRUE_FALSE_NOT_GIVEN":
    case "MULTIPLE_CHOICE":
    case "TEXT_MATCH":
    case "HEADINGS_MATCH":
      return answer === correct

    case "MULTIPLE_SELECT": {
      const a = answer.split(",").map(s => s.trim()).sort().join(",")
      const c = correct.split(",").map(s => s.trim()).sort().join(",")
      return a === c
    }

    default:
      return false
  }
}
