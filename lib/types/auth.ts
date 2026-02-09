// 1. Standart registratsiya uchun
export interface RegisterPayload {
    full_name: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    // Eslatma: Swaggerda 'age', 'level', 'role' ko'rinmadi, 
    // lekin backend qo'shimcha ma'lumot qabul qilsa saqlab qolishingiz mumkin.
}

// 2. Standart Login (Username/Email uchun)
export interface LoginPayload {
    login: string; // Yangi API'da 'username' emas, 'login' deb nomlangan
    password: string;
}

// 3. Telegram orqali kirish (Telegram Login Widget ma'lumotlari)
export interface TelegramLoginPayload {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
}

// 4. Google orqali kirish
export interface GoogleLoginPayload {
    google_id: string;
    email: string;
    name: string;
    picture: string;
}

// 5. Telefon orqali kirish (OTP)
export interface PhoneLoginPayload {
    phone: string;
    code: string;
}

// 6. Yangi telefon foydalanuvchisi uchun profilni to'ldirish
export interface PhoneCompletePayload {
    phone: string;
    code: string;
    full_name: string;
    username: string;
    email: string;
}

// 7. Backend'dan qaytadigan Token javobi
export interface AuthResponse {
    access_token: string;
    refresh_token: string; // Yangi API'da refresh_token ham bor
    token_type: string;
}

// 8. User ma'lumotlari (Get Me uchun)
export interface UserProfile {
    full_name: string;
    username: string;
    avatar_url: string;
    bio?: string;
    birth_date?: string;
    gender?: string;
}

export interface UserMeResponse {
    id: number;
    is_active: boolean;
    global_role: string;
    created_at: string;
    profile: UserProfile;
    contacts: any[];
}