export interface WritingTask {
  id: string
  part: string // "1.1", "1.2", "2" va h.k.
  type: 'informal-letter' | 'formal-letter' | 'essay' | 'report'
  instruction: string // "Write a letter to your friend..."
  prompt: string // Asosiy savol matni
  minWords: number
  maxWords: number
}

export interface WritingTest {
  id: string
  title: string
  isDemo: boolean
  isFree: boolean
  cefrLevel: string // "B1", "B2", "C1"
  durationMinutes: number
  sharedContext?: string // YANGI: Task 1.1 va 1.2 uchun umumiy matn
  tasks: WritingTask[]
}
