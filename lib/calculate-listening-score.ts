import { ListeningExam } from './types/listening'

export interface DetailedResult {
  questionNumber: number | string
  userAnswer: string
  correctAnswer: string
  isCorrect: boolean
}

export interface ListeningResult {
  correct: number
  total: number
  percentage: number
  scaledScore: number
  cefrLevel: string
  detailed: DetailedResult[]
}

const normalize = (text: string) => {
  if (!text) return ''
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:]/g, '')
    .replace(/\s+/g, ' ')
}

export function calculateListeningResult(
  exam: ListeningExam,
  userAnswers: Record<string, string> // ID (string) bo'yicha javoblar
): ListeningResult {
  let correctCount = 0

  // Savollar sonini hisoblash
  const totalQuestions =
    exam.totalQuestions ||
    exam.parts.reduce((acc, part) => acc + part.questions.length, 0)
  const detailed: DetailedResult[] = []

  exam.parts.forEach((part) => {
    part.questions.forEach((question) => {
      // --- MUHIM: ID ORQALI JAVOBNI OLISH ---
      // userAnswers kalitlari string, shuning uchun question.id ni ham stringga o'giramiz
      const qId = String(question.id)
      const userAnswer = userAnswers[qId] || ''
      const correctAnswer = question.correctAnswer || ''

      let isCorrect = false
      const normUser = normalize(userAnswer)
      const normCorrect = normalize(correctAnswer)

      // Tekshirish logikasi
      if (['GAP_FILL', 'SENTENCE_COMPLETION', 'SHORT_ANSWER'].includes(question.type)) {
        if (normUser === normCorrect && normUser !== '') isCorrect = true
      } else {
        // Multiple Choice
        if (normUser === normCorrect && normUser !== '') {
          isCorrect = true
        } else if (question.options) {
          const selectedOption = question.options.find(
            (opt) =>
              normalize(opt.value) === normUser || normalize(opt.label) === normUser
          )
          if (selectedOption && normalize(selectedOption.value) === normCorrect) {
            isCorrect = true
          }
        }
      }

      if (isCorrect) correctCount++

      detailed.push({
        questionNumber: question.questionNumber || 'N/A',
        userAnswer: userAnswer,
        correctAnswer: correctAnswer,
        isCorrect: isCorrect,
      })
    })
  })

  // IELTS shkalasi
  const percentage =
    totalQuestions === 0 ? 0 : Math.round((correctCount / totalQuestions) * 100)
  let scaledScore = 0
  let cefrLevel = 'A1'

  if (correctCount >= 39) {
    scaledScore = 9.0
    cefrLevel = 'C2'
  } else if (correctCount >= 37) {
    scaledScore = 8.5
    cefrLevel = 'C2'
  } else if (correctCount >= 35) {
    scaledScore = 8.0
    cefrLevel = 'C1'
  } else if (correctCount >= 32) {
    scaledScore = 7.5
    cefrLevel = 'C1'
  } else if (correctCount >= 30) {
    scaledScore = 7.0
    cefrLevel = 'C1'
  } else if (correctCount >= 26) {
    scaledScore = 6.5
    cefrLevel = 'B2'
  } else if (correctCount >= 23) {
    scaledScore = 6.0
    cefrLevel = 'B2'
  } else if (correctCount >= 18) {
    scaledScore = 5.5
    cefrLevel = 'B2'
  } else if (correctCount >= 16) {
    scaledScore = 5.0
    cefrLevel = 'B1'
  } else if (correctCount >= 13) {
    scaledScore = 4.5
    cefrLevel = 'B1'
  } else if (correctCount >= 10) {
    scaledScore = 4.0
    cefrLevel = 'A2'
  } else {
    scaledScore = 3.5
    cefrLevel = 'A1'
  }

  return {
    correct: correctCount,
    total: totalQuestions,
    percentage,
    scaledScore,
    cefrLevel,
    detailed: detailed.sort(
      (a, b) => Number(a.questionNumber) - Number(b.questionNumber)
    ),
  }
}
