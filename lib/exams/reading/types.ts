// lib/exams/reading/types.ts

import { ReactNode } from "react";

export type QuestionType =
  | "MULTIPLE_CHOICE"
  | "TRUE_FALSE_NOT_GIVEN"
  | "GAP_FILL"
  | "GAP_FILL_FILL"
  | "HEADINGS_MATCH"
  | "MULTIPLE_SELECT"
  | "TEXT_MATCH";

export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface QuestionOption {
  label: string;
  value: string;
}

export interface Question {
  id: number;
  type: QuestionType;
  text: string;
  options?: QuestionOption[];
  word_limit?: number;
  correct_answer: string; // majburiy qildik
  explanation?: string;
}

export interface ReadingPart {
  id: number;
  title: string;
  title_uz: string;
  description: string;
  description_uz: string;
  passage: string;
  questions: Question[];
}

export interface ExamSet {
  id: string;
  title: string;
  title_uz: string;
  cefr_level: CEFRLevel;
  duration_minutes: number;
  parts: ReadingPart[];
  language: "uz" | "en";
}

export interface ReadingTest {
  level: ReactNode;
  accessCode: any;
  id: string;
  title: string;
  cefrLevel: CEFRLevel;
  durationMinutes: number;
  totalQuestions: number;
  isFree: boolean;
  examData: ExamSet;
}