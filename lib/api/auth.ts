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
      authService.saveTokens(response.data)
    }
    return response.data
  },

  // 3. Tasdiqlash kodini yuborish (Telefon yoki Email)
  sendCode: (target: string, purpose: 'register' | 'login' = 'login') => {
    return api.post('/auth/send-code', { target, purpose })
  },

  // 4. Telefon orqali login
  loginPhone: async (payload: { phone: string; code: string }) => {
    const response = await api.post('/auth/login/phone', payload)
    const data = response.data

    // Agar login muvaffaqiyatli bo'lsa (user bazada bor bo'lsa)
    if (data.status === 'success' && data.token) {
      authService.saveTokens(data.token)
    }
    return data
  },

  // 5. Telefon orqali ro'yxatdan o'tishni yakunlash (Yangi userlar uchun)
  completePhoneAuth: async (payload: {
    phone: string
    code: string
    full_name: string
    username: string
    email: string
  }) => {
    const response = await api.post<AuthResponse>('/auth/login/phone/complete', payload)
    if (response.data.access_token) {
      authService.saveTokens(response.data)
    }
    return response.data
  },

  // 6. Google Login
  googleLogin: async (payload: GoogleLoginPayload) => {
    const response = await api.post<AuthResponse>('/auth/google', payload)
    if (response.data.access_token) {
      authService.saveTokens(response.data)
    }
    return response.data
  },

  // 7. Telegram Login
  telegramLogin: async (payload: TelegramLoginPayload) => {
    const response = await api.post<AuthResponse>('/auth/telegram', payload)
    if (response.data.access_token) {
      authService.saveTokens(response.data)
    }
    return response.data
  },

  // 8. Profil ma'lumotlarini olish
  getMe: async () => {
    const response = await api.get<UserMeResponse>('/auth/me')
    return response.data
  },

  // 9. Logout (Tizimdan chiqish)
  logout: async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.warn('Logout backend error (ignored)', error)
    } finally {
      // Local ma'lumotlarni har qanday holatda tozalash
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('login_at')

      // Next.js state'larini to'liq tozalash uchun login sahifasiga redirect
      window.location.href = '/auth/login'
    }
  },

  saveTokens: (
    data: AuthResponse | { access_token: string; refresh_token?: string }
  ) => {
    if (data.access_token) {
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('login_at', new Date().getTime().toString())
    }
    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token)
    }
  },
}

// Exported Types
export type User = UserMeResponse
