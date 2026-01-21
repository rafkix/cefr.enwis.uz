// lib/calculate-reading-score.ts
import { checkAnswer } from '@/lib/types/reading_grading'
// O'zingizdagi Question va ExamSet interfeyslarini to'g'ri import qiling
// Masalan: import { ExamSet } from "@/lib/types/reading"

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
  exam: any, // Yoki ExamSet tipi
  answers: Record<number, string>
): ReadingResult {
  let total = 0
  let correct = 0
  const detailed: ReadingResultDetail[] = []

  // Partlarni aylanamiz
  for (const part of exam.parts) {
    for (const question of part.questions) {
      total++

      // 1. Foydalanuvchi javobini olamiz (yoki bo'sh string)
      const userAnswer = answers[question.id] || ''

      // 2. Javobni grading.ts dagi logika orqali tekshiramiz
      const isCorrect = checkAnswer(question, userAnswer)

      if (isCorrect) correct++

      // 3. Batafsil hisobotga qo'shamiz
      detailed.push({
        questionId: question.id,
        userAnswer: userAnswer,
        correctAnswer: question.correct_answer || '',
        isCorrect: isCorrect,
        explanation: question.explanation || 'No explanation provided.',
      })
    }
  }

  // 4. Foiz va Ballni hisoblash
  const correctCount = total === 0 ? 0 : Math.round((correct / total) * 100)


    let scaledScore = 0
    let cefrLevel = "A1"

  if (correctCount >= 39) { scaledScore = 9.0; cefrLevel = "C2"; }
  else if (correctCount >= 37) { scaledScore = 8.5; cefrLevel = "C2"; }
  else if (correctCount >= 35) { scaledScore = 8.0; cefrLevel = "C1"; }
  else if (correctCount >= 33) { scaledScore = 7.5; cefrLevel = "C1"; }
  else if (correctCount >= 30) { scaledScore = 7.0; cefrLevel = "C1"; }
  else if (correctCount >= 27) { scaledScore = 6.5; cefrLevel = "B2"; }
  else if (correctCount >= 23) { scaledScore = 6.0; cefrLevel = "B2"; }
  else if (correctCount >= 19) { scaledScore = 5.5; cefrLevel = "B2"; }
  else if (correctCount >= 15) { scaledScore = 5.0; cefrLevel = "B1"; }
  else if (correctCount >= 13) { scaledScore = 4.5; cefrLevel = "B1"; }
  else if (correctCount >= 10) { scaledScore = 4.0; cefrLevel = "A2"; }
  else if (correctCount >= 8)  { scaledScore = 3.5; cefrLevel = "A2"; }
  else if (correctCount >= 6)  { scaledScore = 3.0; cefrLevel = "A1"; }
  else { scaledScore = 0; cefrLevel = "Below A1"; }

  const percent = total === 0 ? 0 : Math.round((correctCount / total) * 100)

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
