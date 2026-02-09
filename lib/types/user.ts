export interface UserProfile {
    full_name: string;
    username: string;
    avatar_url: string | null;
    bio: string | null;
    birth_date: string | null;
    gender: string | null;
}

export interface UserContact {
    id: number;
    contact_type: "email" | "phone";
    value: string;
    is_primary: boolean;
    is_verified: boolean;
}

export interface User {
    id: number; // Swagger'da 0 (integer) deb ko'rsatilgan
    is_active: boolean;
    global_role: string;
    created_at: string;
    profile: UserProfile; // Profil ma'lumotlari ichkarida
    contacts: UserContact[]; // Kontaktlar massiv holatida
}

export interface UpdateProfilePayload {
    full_name?: string;
    username?: string;
    bio?: string;
    birth_date?: string; // ISO format: "2026-02-09"
    gender?: string;
}

export interface ApiMessage {
    message: string;
}

export interface AvatarResponse {
    avatar_url: string;
    message: string;
}

export interface Session {
    id: string;            // UUID formatida
    user_agent: string;    // Brauzer va qurilma haqida ma'lumot
    ip_address: string;    // Foydalanuvchi IP manzili
    updated_at: string;    // Oxirgi faollik
    expires_at: string;    // Sessiya tugash vaqti
    is_current: boolean;   // Aynan hozirgi qurilma ekanligini bildiradi
}