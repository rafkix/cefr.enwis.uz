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