// lib/exams/reading/scoring.ts

export function calculateReadingScore(correct: number, total: number): string {
  const percentage = (correct / total) * 100;

  if (percentage >= 85) return "C1";
  if (percentage >= 70) return "B2";
  if (percentage >= 55) return "B1";
  if (percentage >= 40) return "A2";
  return "A1";
}