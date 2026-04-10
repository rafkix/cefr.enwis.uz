import api from "./axios";

export const authService = {
  googleLogin: (payload: any) => api.post("/auth/google", payload),

  telegramLogin: (payload: any) => api.post("/auth/telegram", payload),

  sendOtp: (payload: any) => api.post("/auth/otp/send", payload),

  sendOtpBot: (payload: any) => api.post("/auth/otp/send/bot", payload),

  loginByPhone: (payload: any) => api.post("/auth/phone/login", payload),

  getMe: () => api.get("/auth/me").then((res) => res.data),

  logout: async () => {
    await api.post("/auth/logout");

    window.location.href = "https://auth.enwis.uz";
  },
};
