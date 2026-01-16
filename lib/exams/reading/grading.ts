// lib/exams/reading/grading.ts
import { Question } from "./types";

export function checkAnswer(question: Question, userAnswer?: string): boolean {
  if (!userAnswer || !question.correct_answer) return false;

  const correct = question.correct_answer.trim().toLowerCase();
  const answer = userAnswer.trim().toLowerCase();

  switch (question.type) {
    case "GAP_FILL":
      if (question.word_limit) {
        const words = answer.split(/\s+/).filter(w => w.length > 0);
        if (words.length > question.word_limit) return false;
      }
      return answer === correct;

    case "MULTIPLE_SELECT":
      const a = answer.split(",").map(s => s.trim()).sort().join(",");
      const c = correct.split(",").map(s => s.trim()).sort().join(",");
      return a === c;

    default:
      return answer === correct;
  }
}