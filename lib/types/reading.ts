export enum QuestionType {
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  TRUE_FALSE_NOT_GIVEN = "TRUE_FALSE_NOT_GIVEN",
  GAP_FILL = "GAP_FILL",
  GAP_FILL_FILL = "GAP_FILL_FILL",
  HEADINGS_MATCH = "HEADINGS_MATCH",
  MULTIPLE_SELECT = "MULTIPLE_SELECT",
  TEXT_MATCH = "TEXT_MATCH",
}

export interface Option {
  label: string; // A, B, C...
  value: string; // Variant matni
}

export interface Question {
  id?: number;           // Backend'dan kelganda ID bo'ladi
  question_number?: number; 
  type: QuestionType;
  text: string;
  correct_answer: string;
  word_limit?: number;   // Backend schemasiga moslandi
  options?: Option[];
}

export interface ReadingPart {
  id?: number;           // Backend'dan kelganda ID bo'ladi
  title: string;
  description: string;
  passage: string;
  questions: Question[];
}

export interface ReadingExam {
  isFree: any;
  isDemo: any;
  id: string;            // Slugs: 'reading-test-1'
  title: string;
  cefr_level: string;
  duration_minutes: number;
  language: string;
  type?: string;         // "READING"
  total_questions?: number;
  parts: ReadingPart[];
}

// --- SUBMISSION & RESULTS ---

export interface ResultSubmission {
  exam_id: string;
  user_answers: Record<string, string>; // { "101": "A", "102": "true" }
}

export interface ResultSummary {
  id: number;
  exam_id: string;
  raw_score: number;
  standard_score: number;
  cefr_level: string;
  percentage: number;
  created_at: string;
}

export interface QuestionReview {
  question_number: number;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  type: QuestionType;
}

export interface ReadingResultDetail {
  summary: ResultSummary;
  review: QuestionReview[];
}

// Yangilash (Update) uchun tip
export interface ReadingExamUpdate {
  title?: string;
  cefr_level?: string;
  duration_minutes?: number;
  language?: string;
  parts?: ReadingPart[];
}