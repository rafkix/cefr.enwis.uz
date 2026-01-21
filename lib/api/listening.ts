import api from "./axios"; 
import { 
  ListeningExam, 
  ListeningExamUpdate, 
  ListeningSubmission, 
  ListeningResultResponse 
} from "../types/listening";

const BASE_URL = "/services/cefr/listening";

const URLS = {
  CREATE: `${BASE_URL}/create`,
  SUBMIT: `${BASE_URL}/submit`, // Submit endpoint
  MY_RESULTS: `${BASE_URL}/my-results`, // Tarixni olish
  RESULT_DETAIL: (id: number) => `${BASE_URL}/result/${id}`, // Detalni olish
  LIST: `${BASE_URL}/list`,
  BY_ID: (id: string) => `${BASE_URL}/${id}`,
  UPDATE: (id: string) => `${BASE_URL}/${id}`,
  DELETE: (id: string) => `${BASE_URL}/${id}`,
};

/* ----------------------------------
   1. EXAM ADMIN OPERATSIYALARI
---------------------------------- */

// Imtihon yaratish
export const createListeningExamAPI = (data: ListeningExam) => {
  return api.post<ListeningExam>(URLS.CREATE, data);
};

// Barcha imtihonlarni olish
export const getListeningExamsAPI = () => {
  return api.get<ListeningExam[]>(URLS.LIST);
};

// Imtihonni ID orqali olish (Test ishlash sahifasi uchun)
export const getListeningExamByIdAPI = (examId: string) => {
  return api.get<ListeningExam>(URLS.BY_ID(examId));
};

// Imtihonni yangilash
export const updateListeningExamAPI = (examId: string, data: ListeningExamUpdate) => {
  return api.put<ListeningExam>(URLS.UPDATE(examId), data);
};

// Imtihonni o'chirish
export const deleteListeningExamAPI = (examId: string) => {
  return api.delete(URLS.DELETE(examId));
};

/* ----------------------------------
   2. TEST TOPSHIRISH VA NATIJALAR
---------------------------------- */

/**
 * 📤 IMTIHONNI TOPSHIRISH
 * Faqat user_answers (savol_id: javob) yuboriladi.
 * Backend ballni o'zi hisoblaydi.
 */
export const submitListeningExamAPI = (data: ListeningSubmission) => {
  return api.post<ListeningResultResponse>(URLS.SUBMIT, data);
};

/**
 * 📜 MENING NATIJALARIM
 * Foydalanuvchi topshirgan barcha testlar ro'yxati.
 */
export const getMyListeningResultsAPI = () => {
  return api.get<ListeningResultResponse[]>(URLS.MY_RESULTS);
};

/**
 * 🔍 NATIJA DETALLARI (REVIEW)
 * Qaysi savolda xato qilganini ko'rish uchun.
 */
export const getListeningResultDetailAPI = (resultId: number) => {
  return api.get<any>(URLS.RESULT_DETAIL(resultId));
};