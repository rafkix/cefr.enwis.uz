// lib/calculate-reading-score.ts
<<<<<<< HEAD
import { checkAnswer } from "./exams/reading/grading"
import { ExamSet } from "./exams/reading/types" // shared/exam-set emas, o'zining types'idan oling
=======
import { checkAnswer } from "./grading"
import type { ExamSet } from "./exam-data"
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee

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

<<<<<<< HEAD
      // localstorage'dan kelgan javobni olish
      const userAnswer = answers[question.id] ?? ""
      
      // grading.ts dagi checkAnswer funksiyasidan foydalanamiz
=======
      const userAnswer = answers[question.id] ?? ""
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
      const isCorrect = checkAnswer(question, userAnswer)

      if (isCorrect) correct++

      detailed.push({
        questionId: question.id,
        userAnswer,
<<<<<<< HEAD
        // E'tibor bering: data.ts da 'correct_answer' ishlatilgan
        correctAnswer: question.correct_answer || "", 
        isCorrect,
        explanation: question.explanation || "",
=======
        correctAnswer: question.correct_answer ?? "",
        isCorrect,
        explanation: question.explanation ?? "",
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
      })
    }
  }

  const percent = total === 0 ? 0 : Math.round((correct / total) * 100)
<<<<<<< HEAD
  // Scaled score hisoblash (masalan, 75 ballik tizimda)
  const scaledScore = total === 0 ? 0 : Math.round((correct / total) * 75)

  // CEFR darajasini aniqlash mantiqi
  let cefrLevel = "Below A2"
  if (scaledScore >= 65) cefrLevel = "C1"
  else if (scaledScore >= 51) cefrLevel = "B2"
  else if (scaledScore >= 38) cefrLevel = "B1"
  else if (scaledScore >= 20) cefrLevel = "A2"
=======
  const scaledScore = Math.round((correct / total) * 75)

  const cefrLevel =
    scaledScore >= 65 ? "C1" :
    scaledScore >= 51 ? "B2" :
    scaledScore >= 38 ? "B1" :
    "Below"
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee

  return {
    total,
    correct,
    wrong: total - correct,
    percent,
    scaledScore,
    cefrLevel,
    detailed,
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
