// lib/exams/listening/scoring.ts

// ================= TYPES =================

export interface ListeningResultDetail {
  questionNumber: number
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
}

interface ListeningQuestion {
  questionNumber: number
  type: "multiple-choice" | "gap-fill" | "matching" | "map-labeling"
  correctAnswer: string
}

interface ListeningPart {
  questions: ListeningQuestion[]
}

interface ListeningTest {
  parts: ListeningPart[]
}

// ================= NORMALIZE =================

function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
}

// ================= CHECKERS =================

function isGapFillCorrect(user: string, correct: string): boolean {
  const userNorm = normalizeText(user)

  // agar bir nechta to‘g‘ri javob bo‘lsa: "loan / bank loan"
  const correctVariants = correct
    .split("/")
    .map(v => normalizeText(v))

  return correctVariants.includes(userNorm)
}

function isChoiceCorrect(user: string, correct: string): boolean {
  return user.trim().toUpperCase() === correct.trim().toUpperCase()
}

// ================= MAIN =================

export function calculateListeningScore(
  test: ListeningTest,
  userAnswers: Record<number, string>
) {
  let total = 0
  let correct = 0

  const detailed: ListeningResultDetail[] = []

  test.parts.forEach(part => {
    part.questions.forEach(q => {
      total++

      const userAnswer = userAnswers[q.questionNumber] || ""
      const correctAnswer = q.correctAnswer || ""

      let isCorrect = false

      switch (q.type) {
        case "gap-fill":
          isCorrect = isGapFillCorrect(userAnswer, correctAnswer)
          break

        case "multiple-choice":
        case "matching":
        case "map-labeling":
          isCorrect = isChoiceCorrect(userAnswer, correctAnswer)
          break
      }

      if (isCorrect) correct++

      detailed.push({
        questionNumber: q.questionNumber,
        userAnswer,
        correctAnswer,
        isCorrect
      })
    })
  })

  return {
    total,
    correct,
    percent: total === 0 ? 0 : Math.round((correct / total) * 100),
    detailed
  }
}
