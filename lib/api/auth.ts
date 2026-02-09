import api from './axios'
import {
  RegisterPayload,
  LoginPayload,
  TelegramLoginPayload,
  GoogleLoginPayload,
  AuthResponse,
  UserMeResponse,
} from '../types/auth'

/**
 * 🔐 Auth System API (v1)
 * Faqat shaxsiy backend bilan muloqot qiladi.
 */
export const authService = {
  // 1. Registratsiya
  register: (payload: RegisterPayload) => {
    return api.post('/auth/register', payload)
  },

  // 2. Login (Email/Password)
  login: async (payload: LoginPayload) => {
    const response = await api.post<AuthResponse>('/auth/login', payload)
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token)
      localStorage.setItem('refresh_token', response.data.refresh_token)
    }
    return response.data
  },

  // 3. Google Login
  googleLogin: async (payload: GoogleLoginPayload) => {
    const response = await api.post<AuthResponse>('/auth/google', payload)
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token)
      if (response.data.refresh_token) {
          localStorage.setItem('refresh_token', response.data.refresh_token)
      }
    }
    return response.data
  },

  // 4. Telegram Login
  telegramLogin: async (payload: TelegramLoginPayload) => {
    const response = await api.post<AuthResponse>('/auth/telegram', payload)
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token)
    }
    return response.data
  },

  // 5. Tasdiqlash kodini yuborish
  sendCode: (target: string, purpose: 'register' | 'login' | 'reset' = 'register') => {
    return api.post('/auth/send-code', { target, purpose })
  },

  // 6. Profil ma'lumotlarini olish
  getMe: async () => {
    const response = await api.get<UserMeResponse>('/auth/me')
    return response.data
  },

  // 7. Logout
  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    // Agar backendda logout endpoint bo'lsa:
    return api.post('/auth/logout').catch(() => {
        console.log("Logout backend error (ignored)");
    });
  },
}

export type User = UserMeResponse