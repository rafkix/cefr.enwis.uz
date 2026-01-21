import api from "./axios"; // O'zingizning axios instansiyangizni import qiling
import { 
  ReadingExam, 
  ReadingExamUpdate, 
  ResultSubmission, 
  ResultSummary, // Sizda ResultSummary deb nomlangan bo'lishi mumkin
  ReadingResultDetail 
} from "../types/reading";

// URL manzillarini markazlashtirilgan holda saqlash (ixtiyoriy, lekin foydali)
const BASE_URL = "/services/cefr/reading";

/* ----------------------------------
    1. CREATE READING EXAM
    POST /services/cefr/reading/create
---------------------------------- */
export const createReadingExamAPI = (data: ReadingExam) => {
  return api.post<ReadingExam>(`${BASE_URL}/create`, data);
};

/* ----------------------------------
    2. GET ALL EXAMS
    GET /services/cefr/reading/list
---------------------------------- */
export const getAllReadingExamsAPI = () => {
  return api.get<ReadingExam[]>(`${BASE_URL}/list`);
};

/* ----------------------------------
    3. GET EXAM BY ID
    GET /services/cefr/reading/{examId}
---------------------------------- */
export const getReadingExamByIdAPI = (examId: string) => {
  return api.get<ReadingExam>(`${BASE_URL}/${examId}`);
};

/* ----------------------------------
    4. UPDATE EXAM
    PUT /services/cefr/reading/update/{examId}
---------------------------------- */
export const updateReadingExamAPI = (examId: string, data: ReadingExamUpdate) => {
  return api.put<ReadingExam>(`${BASE_URL}/update/${examId}`, data);
};

/* ----------------------------------
    5. DELETE EXAM
    DELETE /services/cefr/reading/delete/{examId}
---------------------------------- */
export const deleteReadingExamAPI = (examId: string) => {
  return api.delete<{ success: boolean }>(`${BASE_URL}/delete/${examId}`);
};

/* ----------------------------------
    6. SUBMIT EXAM RESULTS
    POST /services/cefr/reading/submit
---------------------------------- */
export const submitReadingExamAPI = (data: ResultSubmission) => {
  return api.post<ResultSummary>(`${BASE_URL}/submit`, data);
};

/* ----------------------------------
    7. GET MY RESULTS
    GET /services/cefr/reading/results/my
---------------------------------- */
export const getMyReadingResultsAPI = () => {
  return api.get<ResultSummary[]>(`${BASE_URL}/results/my`);
};

/* ----------------------------------
    8. GET RESULT DETAIL (REVIEW)
    GET /services/cefr/reading/results/{resultId}
---------------------------------- */
export const getReadingResultDetailAPI = (resultId: number) => {
  return api.get<ReadingResultDetail>(`${BASE_URL}/results/${resultId}`);
};