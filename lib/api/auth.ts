import api from "./axios";
import {
  GoogleLoginPayload,
  TelegramLoginPayload,
  SendOtpPayload,
  PhoneLoginPayload,
  PhoneLoginResponse,
  UserMeResponse,
} from "../types/auth";

export const authService = {
  // ✅ GOOGLE LOGIN (cookie set qiladi backend)
  googleLogin: async (payload: GoogleLoginPayload) => {
    const response = await api.post("/auth/google", payload);
    return response.data;
  },

  // ✅ TELEGRAM LOGIN
  telegramLogin: async (payload: TelegramLoginPayload) => {
    const response = await api.post("/auth/telegram", payload);
    return response.data;
  },

  // ✅ OTP yuborish
  sendOtp: (payload: SendOtpPayload) => {
    return api.post("/auth/otp/send", payload);
  },

  sendOtpBot: (payload: SendOtpPayload) => {
    return api.post("/auth/otp/send/bot", payload);
  },

  // ✅ PHONE LOGIN
  loginByPhone: async (payload: PhoneLoginPayload) => {
    const response = await api.post<PhoneLoginResponse>(
      "/auth/phone/login",
      payload,
    );
    return response.data;
  },

  // ✅ USER
  getMe: () => api.get<UserMeResponse>("/auth/me").then((res) => res.data),

  // ✅ LOGOUT (cookie clear qiladi backend)
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      if (typeof window !== "undefined") {
        window.location.href = "https://auth.enwis.uz";
      }
    }
  },
};
