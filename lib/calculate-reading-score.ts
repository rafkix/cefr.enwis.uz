// lib/calculate-reading-score.ts
import { checkAnswer } from "./exams/reading/grading"
import { ExamSet } from "./exams/reading/types" // shared/exam-set emas, o'zining types'idan oling

export interface ReadingResultDetail {
  questionId: number
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
  explanation: string
}

export interface ReadingResult {
  total: number
  correct: number
  wrong: number
  percent: number
  scaledScore: number
  cefrLevel: string
  detailed: ReadingResultDetail[]
}

export function calculateReadingResult(
  exam: ExamSet,
  answers: Record<number, string>
): ReadingResult {
  let total = 0
  let correct = 0
  const detailed: ReadingResultDetail[] = []

  for (const part of exam.parts) {
    for (const question of part.questions) {
      total++

      // localstorage'dan kelgan javobni olish
      const userAnswer = answers[question.id] ?? ""
      
      // grading.ts dagi checkAnswer funksiyasidan foydalanamiz
      const isCorrect = checkAnswer(question, userAnswer)

      if (isCorrect) correct++

      detailed.push({
        questionId: question.id,
        userAnswer,
        // E'tibor bering: data.ts da 'correct_answer' ishlatilgan
        correctAnswer: question.correct_answer || "", 
        isCorrect,
        explanation: question.explanation || "",
      })
    }
  }

  const percent = total === 0 ? 0 : Math.round((correct / total) * 100)
  // Scaled score hisoblash (masalan, 75 ballik tizimda)
  const scaledScore = total === 0 ? 0 : Math.round((correct / total) * 75)

  // CEFR darajasini aniqlash mantiqi
  let cefrLevel = "Below A2"
  if (scaledScore >= 65) cefrLevel = "C1"
  else if (scaledScore >= 51) cefrLevel = "B2"
  else if (scaledScore >= 38) cefrLevel = "B1"
  else if (scaledScore >= 20) cefrLevel = "A2"

  return {
    total,
    correct,
    wrong: total - correct,
    percent,
    scaledScore,
    cefrLevel,
    detailed,
  }
}