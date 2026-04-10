import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // 🔥 CRITICAL (cookie ishlashi uchun)
});

/**
 * Request Interceptor
 * Cookie-based auth → headerga token qo‘shilmaydi
 */
api.interceptors.request.use(
  (config) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`🚀 [API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Response Interceptor
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    // 🔥 401 handling (cookie-based)
    if (status === 401) {
      console.error("⛔ [401] Unauthorized");

      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname;

        // Infinite loopdan qochish
        if (!currentPath.startsWith("/auth")) {
          window.location.href = "https://auth.enwis.uz";
        }
      }
    }

    return Promise.reject(error);
  },
);

export default api;
