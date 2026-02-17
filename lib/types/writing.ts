export interface WritingTask {
  id?: number
  partNumber: number
  type: string
  topic: string
  instruction: string
  contextText: string
  minWords: number
  maxWords: number
}

export interface WritingExam {
  id: string
  title: string
  cefrLevel: string
  durationMinutes: number
  isDemo: boolean
  isFree: boolean
  isMock: boolean
  isActive: boolean
  createdAt: string
  tasks: WritingTask[]
}

export interface WritingSubmission {
  examId: string
  exam_attempt_id: number | null
  userResponses: {
    [taskId: string]: string // Har bir task ID uchun yozilgan matn
  }
}

export interface WritingResultDetail {
  id: number
  userId: number
  examId: string
  attemptId: number
  overallScore: number
  userResponses: Record<string, string>
  aiEvaluation: Record<string, {
    score: number
    wordCount: number
    feedback: string
    criteria: {
      taskAchievement: number
      grammar: number
      vocabulary: number
      coherence: number
      mechanics: number
    }
    suggestions: string[]
  }>
  createdAt: string
}