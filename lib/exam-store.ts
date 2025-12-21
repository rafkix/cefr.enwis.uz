import { create } from "zustand"

interface Answer {
  question_id: number
  given_answer: string
}

interface ExamAttempt {
  exam_id: string
  answers: Record<number, string>
  flagged: Record<number, boolean>
  submitted_at?: Date
}

interface ExamStore {
  currentAttempt: ExamAttempt | null
  setAnswer: (question_id: number, answer: string) => void
  toggleFlag: (question_id: number) => void
  getSubmissionPayload: () => Answer[]
  resetAttempt: () => void
}

export const useExamStore = create<ExamStore>((set, get) => ({
  currentAttempt: {
    exam_id: "exam-001",
    answers: {},
    flagged: {},
  },

  setAnswer: (question_id: number, answer: string) => {
    set((state) => ({
      currentAttempt: state.currentAttempt
        ? {
            ...state.currentAttempt,
            answers: { ...state.currentAttempt.answers, [question_id]: answer },
          }
        : null,
    }))
  },

  toggleFlag: (question_id: number) => {
    set((state) => ({
      currentAttempt: state.currentAttempt
        ? {
            ...state.currentAttempt,
            flagged: {
              ...state.currentAttempt.flagged,
              [question_id]: !state.currentAttempt.flagged[question_id],
            },
          }
        : null,
    }))
  },

  getSubmissionPayload: () => {
    const attempt = get().currentAttempt
    if (!attempt) return []

    return Object.entries(attempt.answers).map(([question_id, given_answer]) => ({
      question_id: Number.parseInt(question_id),
      given_answer,
    }))
  },

  resetAttempt: () => {
    set({
      currentAttempt: {
        exam_id: "exam-001",
        answers: {},
        flagged: {},
      },
    })
  },
}))
