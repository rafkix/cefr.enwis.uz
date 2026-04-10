import axios from "axios";

const api = axios.create({
  baseURL: "https://api-cefr.enwis.uz/api/v1",
  withCredentials: true, // 🔥 CRITICAL
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      const current = window.location.href;

      window.location.href = `https://auth.enwis.uz?redirect=${encodeURIComponent(current)}`;
    }

    return Promise.reject(error);
  },
);

export default api;
