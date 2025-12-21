// lib/exams/listening/grading.ts
import { ListeningTest } from "./types"

export function gradeListening(
  test: ListeningTest,
  answers: Record<number, string | number>
) {
  let correct = 0

  for (const part of test.parts) {
    for (const q of part.questions) {
      if (answers[q.questionNumber] === q.correctAnswer) {
        correct++
      }
    }
  }

  return {
    correct,
    total: test.totalQuestions,
    scorePercent: Math.round((correct / test.totalQuestions) * 100),
  }
}
