import axios from "axios";

const API_URL = "http://api.eniws.uz/v1/api"; 

const api = axios.create({
    baseURL: API_URL,
    // ⚠️ DIQQAT: Agar Backend CORS da allowCredentials=True qilmagan bo'lsa, 
    // pastdagi qatorni olib tashlang, aks holda Network Error beradi.
    // withCredentials: true, 
});

api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        // 1. Ikkala nom bilan ham qidirib ko'ramiz (xatolikni oldini olish uchun)
        const token = localStorage.getItem("token") || localStorage.getItem("access_token");
        
        // 🔍 DEBUG: Konsolga qarang (F12)
        console.log("📡 So'rov yuborilmoqda...");
        console.log("🔑 Token holati:", token ? "Mavjud ✅" : "Yo'q ❌");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor (Token eskirgan bo'lsa ushlash uchun)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.log("⛔ 401 Xatolik: Ruxsat yo'q yoki token eskirgan.");
            // Ixtiyoriy: Login sahifasiga yo'naltirish
            // window.location.href = "/auth/login";
        }
        return Promise.reject(error);
    }
);

export default api;