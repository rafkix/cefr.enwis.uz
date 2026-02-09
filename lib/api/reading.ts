import api from './axios'
import {
  ReadingExam,
  ReadingExamUpdate,
  ResultSummary,
  ReadingResultDetail,
} from '../types/reading'

/**
 * Backend prefix: /v1/api/cefr/all/reading
 */
const BASE_URL = '/cefr/all/reading'

// 1. GET ALL TESTS
export const getAllReadingExamsAPI = () => {
  return api.get<ReadingExam[]>(`${BASE_URL}/get_all`)
}

// 2. GET SINGLE TEST
export const getReadingExamByIdAPI = (testId: string) => {
  if (!testId) throw new Error('testId is required')
  return api.get<ReadingExam>(`${BASE_URL}/get/${testId}`)
}

// 3. SUBMIT ANSWERS (⚠️ Tuzatildi: Swagger'dagi "answers" massiviga moslandi)
export interface AnswerItem {
  question_id: number;
  answers: string[];
}

export interface ReadingSubmission {
  answers: AnswerItem[];
  exam_attempt_id: number | null;
}

export const submitReadingExamAPI = (
  testId: string,
  data: ReadingSubmission
) => {
  if (!testId) throw new Error("testId is required")
  
  // Swagger'da endpoint: /answer/{test_id}/submit
  return api.post<ReadingResultDetail>(
    `${BASE_URL}/answer/${testId}/submit`,
    data
  )
}

// 4. MY RECENT RESULT (By Test ID)
export const getMyReadingResultAPI = (testId: string) => {
  if (!testId) throw new Error('testId is required')
  // Swagger'da endpoint: /{test_id}/my-result
  return api.get<ReadingResultDetail>(
    `${BASE_URL}/${testId}/my-result`
  )
}

// 5. GET ALL MY RESULTS
export const getMyReadingResultsAPI = () => {
  // Swagger'da endpoint: /my-results/all
  // Eslatma: Swagger "string" qaytaradi deb ko'rsatilgan, 
  // lekin odatda bu yerda ResultSummary[] kutiladi.
  return api.get<any>(`${BASE_URL}/my-results/all`); 
}

// 6. GET RESULT BY ID
export const getReadingResultDetailAPI = (resultId: number) => {
  if (!resultId) throw new Error('resultId is required')
  // Swagger'da endpoint: /results/{result_id}
  return api.get<ReadingResultDetail>(
    `${BASE_URL}/results/${resultId}`
  )
}

// 7. ADMIN: CREATE TEST
export const createReadingExamAPI = (data: Partial<ReadingExam>) => {
  return api.post<ReadingExam>(`${BASE_URL}/create`, data)
}

// 8. ADMIN: UPDATE TEST
export const updateReadingExamAPI = (
  testId: string,
  data: ReadingExamUpdate
) => {
  return api.put<ReadingExam>(`${BASE_URL}/update/${testId}`, data)
}

// 9. ADMIN: DELETE TEST
export const deleteReadingExamAPI = (testId: string) => {
  return api.delete<{ success: boolean }>(`${BASE_URL}/delete/${testId}`)
}