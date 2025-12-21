import { SAMPLE_EXAM_B2 } from "./exam-data"
import type { ExamStructure, QuestionTypeCategory, QuestionMetadata } from "./exam-api-types"

export function getExamStructure(): ExamStructure {
  const allQuestions: QuestionMetadata[] = []
  const typeCount: Record<QuestionTypeCategory, number> = {
    GAP_FILL: 0,
    TEXT_MATCH: 0,
    HEADINGS_MATCH: 0,
    MULTIPLE_CHOICE: 0,
    TRUE_FALSE_NOT_GIVEN: 0,
  }

  SAMPLE_EXAM_B2.parts.forEach((part) => {
    part.questions.forEach((question) => {
      const type = question.type as QuestionTypeCategory
      typeCount[type]++

      allQuestions.push({
        question_id: question.id,
        part_id: part.id,
        type,
        difficulty:
          type === "GAP_FILL"
            ? "medium"
            : type === "TEXT_MATCH"
              ? "medium"
              : type === "HEADINGS_MATCH"
                ? "hard"
                : "easy",
      })
    })
  })

  return {
    total_questions: SAMPLE_EXAM_B2.parts.reduce((sum, part) => sum + part.questions.length, 0),
    question_count_by_type: typeCount,
    questions_metadata: allQuestions,
  }
}

export function getQuestionsByType() {
  type GroupedQuestions = Record<QuestionTypeCategory, (typeof SAMPLE_EXAM_B2.parts)[0]["questions"]>

  const grouped: GroupedQuestions = {
    GAP_FILL: [],
    TEXT_MATCH: [],
    HEADINGS_MATCH: [],
    MULTIPLE_CHOICE: [],
    TRUE_FALSE_NOT_GIVEN: [],
  }

  SAMPLE_EXAM_B2.parts.forEach((part) => {
    part.questions.forEach((question) => {
      const type = question.type as QuestionTypeCategory
      grouped[type].push(question)
    })
  })

  return grouped
}

export function getAllQuestionsFlat() {
  return SAMPLE_EXAM_B2.parts.flatMap((part) =>
    part.questions.map((q) => ({
      ...q,
      part_id: part.id,
      part_title: part.title,
    })),
  )
}
