import { WritingTask } from "./types"

export interface WritingValidationResult {
  wordCount: number
  meetsMinWords: boolean
  withinMaxWords: boolean
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

export function validateWritingAnswer(
  task: WritingTask,
  answer: string
): WritingValidationResult {
  const wordCount = countWords(answer)

  return {
    wordCount,
    meetsMinWords: task.minWords ? wordCount >= task.minWords : true,
    withinMaxWords: task.maxWords ? wordCount <= task.maxWords : true,
  }
}
