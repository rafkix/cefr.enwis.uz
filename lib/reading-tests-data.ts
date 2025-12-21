<<<<<<< HEAD
// lib/reading-tests-data.ts
import { allReadingTests } from "./exams/reading/data";
import { ReadingTest } from "./exams/reading/types";

// Obyekt ichidagi barcha testlarni massivga aylantiramiz
export const READING_TESTS: ReadingTest[] = Object.values(allReadingTests).map((raw) => ({
    id: raw.id,
    title: raw.title,
    cefrLevel: raw.cefr_level as any,
    durationMinutes: raw.duration_minutes,
    totalQuestions: raw.parts.reduce((acc, p) => acc + p.questions.length, 0),
    isFree: true, // Keyinchalik bazadan kelsa yaxshi bo'ladi
    examData: raw,
    questionCount: raw.parts.reduce((acc, p) => acc + p.questions.length, 0)
}));
=======
import { ReactNode } from "react"
import { SAMPLE_EXAM_1, SAMPLE_EXAM_2 } from "./exam-data"
import type { ExamSet } from "./exam-data"

export interface ReadingTest {
  level: ReactNode
  id: string
  title: string

  cefrLevel: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
  durationMinutes: number
  questionCount: number

  isFree: boolean
  requiresAccessCode: boolean
  accessCode?: string

  examData: ExamSet
}


export const READING_TESTS: ReadingTest[] = [
  {
      id: "1",
      title: "Full Reading Test 1",
      cefrLevel: "B2",
      durationMinutes: 60,
      questionCount: 35,
      isFree: true,
      requiresAccessCode: false,
      examData: SAMPLE_EXAM_1,
      level: undefined
  },
  {
      id: "2",
      title: "Full Reading Test 2",
      cefrLevel: "B2",
      durationMinutes: 60,
      questionCount: 35,
      isFree: true,
      requiresAccessCode: false,
      examData: SAMPLE_EXAM_2,
      level: undefined
  },
]

>>>>>>> 0e86cac7de66695f80c36de0b908f71188c446ee
