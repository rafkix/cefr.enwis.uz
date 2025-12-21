// lib/exams/reading/builder.ts
import { allReadingTests } from "./data";

// Endi bu funksiya testId ni qabul qiladi
export function buildReadingExam(testId: string) {
  // Bazadan (allReadingTests ichidan) kerakli testni olamiz
  const raw = allReadingTests[testId];

  if (!raw) {
    throw new Error(`Test with ID ${testId} not found`);
  }

  return {
    meta: {
      id: raw.id,
      title: raw.title,
      level: raw.cefr_level,
      duration: raw.duration_minutes,
    },
    parts: raw.parts.map(part => ({
      ...part,
      questions: part.questions.map(q => ({
        ...q,
        displayId: `Q-${q.id}`
      }))
    }))
  };
}