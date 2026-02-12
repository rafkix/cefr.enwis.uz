/**
 * Foydalanuvchi profilining batafsil ma'lumotlari
 */
export interface UserProfile {
    full_name: string;
    username: string;
    avatar_url: string | null;
    bio: string | null;
    birth_date: string | null; // ISO Date format: "YYYY-MM-DD"
    gender: 'male' | 'female' | 'other' | null;
}

/**
 * Foydalanuvchi aloqa vositalari (Email, Telefon)
 */
export interface UserContact {
    id: number;
    contact_type: 'email' | 'phone';
    value: string;
    is_primary: boolean;   // Asosiy login vositasi
    is_verified: boolean;  // Tasdiqlanganligi
}

/**
 * Asosiy Foydalanuvchi modeli (Root)
 */
export interface User {
    id: number;
    is_active: boolean;
    global_role: string;
    created_at: string;
    profile: UserProfile;   // Nested Profile object
    contacts: UserContact[]; // List of contacts
}

/**
 * Profil ma'lumotlarini yangilash uchun Payload
 */
export interface UpdateProfilePayload {
    full_name?: string;
    username?: string;
    bio?: string;
    birth_date?: string; // "1990-01-01"
    gender?: 'male' | 'female' | 'other';
}

/**
 * Faol sessiyalar (Qurilmalar) ma'lumotlari
 */
export interface UserSession {
    id: string;             // UUID
    user_agent: string;     // Qurilma/Brauzer nomi
    ip_address: string;
    created_at: string;
    updated_at: string;
    expires_at: string;
    is_current: boolean;    // Hozirgi foydalanilayotgan qurilma
}

/**
 * Kontakt qo'shish (Birinchi bosqich)
 */
export interface AddContactPayload {
    value: string;          // "+998..." yoki "test@mail.com"
    type: 'phone' | 'email';
}

/**
 * Kontaktni tasdiqlash (OTP bilan)
 */
export interface VerifyContactPayload extends AddContactPayload {
    code: string;           // 6 xonali OTP kod
}

/**
 * API javoblari uchun umumiy interfeyslar
 */
export interface AvatarResponse {
    avatar_url: string;
    message: string;
}

export interface ApiMessage {
    message: string;
    status?: string;
}

/**
 * USER API ENDPOINTS (Ma'lumot uchun)
 * GET    /user/me/           -> User
 * PUT    /user/me/profile    -> User (UpdateProfilePayload)
 * POST   /user/me/avatar     -> AvatarResponse (FormData)
 * GET    /user/me/contacts   -> UserContact[]
 * POST   /user/me/contacts   -> ApiMessage (AddContactPayload)
 * POST   /user/me/contacts/verify -> ApiMessage (VerifyContactPayload)
 * PATCH  /user/me/contacts/{id}/primary -> ApiMessage
 * DELETE /user/me/contacts/{id} -> void
 * GET    /user/me/sessions   -> UserSession[]
 * DELETE /user/me/sessions/{id} -> ApiMessage
 */