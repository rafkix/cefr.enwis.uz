export type WritingTaskType =
  | "informal-letter"
  | "formal-letter"
  | "opinion-essay"

export interface WritingTask {
  part: any
  id: string
  type: WritingTaskType

  instruction: string
  prompt: string

  minWords?: number
  maxWords?: number

  targetLevel?: string // A2-B1, B1-B2, B2-C1
}

export interface WritingTest {
  id: string
  title: string

  cefrLevel: "A1" | "A2" | "B1" | "B2" | "C1" 
  durationMinutes: number

  isDemo: boolean
  isFree: boolean

  tasks: WritingTask[]
}
