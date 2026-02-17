import api from './axios'
import {
  WritingExam,
  WritingSubmission,
  WritingResultDetail
} from '../types/writing'

/**
 * Backend prefix: /v1/api/cefr/all/writing
 */
const BASE_URL = '/cefr/all/writing'

// 1. GET ALL EXAMS
export const getAllWritingExamsAPI = () => {
  return api.get<WritingExam[]>(`${BASE_URL}/get_all`)
}

// 2. GET SINGLE EXAM BY ID
export const getWritingExamByIdAPI = (examId: string) => {
  if (!examId) throw new Error('examId is required')
  return api.get<WritingExam>(`${BASE_URL}/get/${examId}`)
}

// 3. SUBMIT WRITING EXAM
export const submitWritingExamAPI = (payload: { 
  examId: string; 
  attemptId: number; 
  userResponses: Record<string, string> 
}, userId: number) => {
  // Swaggerda /submit ko'rsatilgan, userId queryda bo'lishi kerak (oldingi xatoga ko'ra)
  return api.post<WritingResultDetail>(
    `${BASE_URL}/submit?user_id=${userId}`, 
    payload
  );
}

// 4. GET MY RESULTS (Foydalanuvchi o'zi uchun)
export const getMyWritingResultsAPI = (userId: number) => {
  if (!userId) throw new Error('userId is required')
  return api.get<WritingResultDetail[]>(`${BASE_URL}/results/user/${userId}`)
}

// 5. GET SINGLE RESULT DETAIL (Natija va AI feedback)
export const getWritingResultDetailAPI = (resultId: number) => {
  if (!resultId) throw new Error('resultId is required')
  return api.get<WritingResultDetail>(`${BASE_URL}/results/${resultId}`)
}

// --- ADMIN ENDPOINTS ---

// 6. ADMIN: CREATE WRITING EXAM
export const createWritingExamAPI = (data: Partial<WritingExam>) => {
  return api.post<WritingExam>(`${BASE_URL}/create`, data)
}

// 7. ADMIN: UPDATE WRITING EXAM
export const updateWritingExamAPI = (examId: string, data: Partial<WritingExam>) => {
  if (!examId) throw new Error('examId is required')
  return api.patch<WritingExam>(`${BASE_URL}/update/${examId}`, data)
}

// 8. ADMIN: DELETE WRITING EXAM
export const deleteWritingExamAPI = (examId: string) => {
  if (!examId) throw new Error('examId is required')
  return api.delete<string>(`${BASE_URL}/delete/${examId}`)
}

// 9. ADMIN: GET ALL USER RESULTS (Hamma natijalar ro'yxati)
export const getAllUserWritingResultsAPI = () => {
  return api.get<WritingResultDetail[]>(`${BASE_URL}/my-results/all`)
}

// 10. DOWNLOAD WRITING RESULT PDF
export const downloadWritingResultPdfAPI = (resultId: number) => {
  return api.get(`/cefr/all/writing/results/${resultId}/download-pdf`, {
    responseType: 'blob', // Kichik harflar bilan 'blob' bo'lishi kerak
    headers: {
      'Accept': 'application/pdf'
    }
  });
}