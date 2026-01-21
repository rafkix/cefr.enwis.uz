import api from "./axios";
import {
    RegisterPayload,
    LoginPayload,
    TelegramRegisterPayload,
} from "../types/auth";

// 1. Standart registratsiya
export const registerAPI = (payload: RegisterPayload) => {
    return api.post("/auth/register", payload);
};

// 2. Standart Login (OAuth2PasswordRequestForm kutyapti)
export const loginAPI = ({ username, password }: LoginPayload) => {
    const body = new URLSearchParams();
    body.append("username", username);
    body.append("password", password);

    return api.post("/auth/login", body, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
};

/* 📤 3. Telefon kiritib kod olish (Bot start linki uchun) */
export const requestPhoneCodeAPI = (phone: string) => {
    // Backend: /v1/api/auth/phone/request
    return api.post("/auth/phone/request", { phone });
};

/* ✅ 4. Kodni tekshirish (OTP tasdiqlash) */
export const verifyPhoneCodeAPI = (phone: string, code: string) => {
    // Backend: /v1/api/auth/phone/verify
    // DIQQAT: Swaggerda login_telegram funksiyasi shu URLga bog'langan
    return api.post("/auth/phone/verify", {
        phone,
        code,
    });
};

/* 🤖 5. Telegram orqali ro'yxatdan o'tish */
export const telegramRegisterAPI = (payload: TelegramRegisterPayload) => {
    // Swaggerda: /v1/api/auth/register/telegram
    // Sizda kodingizda /auth/telegram_register edi, bu 404 beradi
    return api.post("/auth/register/telegram", payload);
};

/* 👤 6. Profil ma'lumotlarini olish */
export const meAPI = () => {
    // Swaggerda: /v1/api/auth/me
    // Sizda kodingizda /users/get_me edi, bu 404 beradi
    return api.get("/auth/me");
};

export const logoutAPI = () => {
    return api.post("/auth/logout");
};