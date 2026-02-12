import api from "./axios";
import { 
    User, 
    UpdateProfilePayload, 
    UserContact, 
    UserSession, 
    AvatarResponse,
    AddContactPayload,
    VerifyContactPayload,
    ApiMessage
} from "../types/user";

/**
 * SECTION: PROFILE (PROFIL)
 */

// Joriy foydalanuvchi ma'lumotlarini olish (Read)
export const getMe = () => 
    api.get<User>("/user/me/");

// Profil ma'lumotlarini yangilash (Update)
export const updateProfile = (data: UpdateProfilePayload) => 
    api.put<User>("/user/me/profile", data);

// Avatarni yuklash (Create/Update)
export const uploadAvatar = async (file: File) => {
    // 1. Tekshirish: Faqat rasmlar (JPEG, PNG, WEBP)
    if (!file.type.startsWith("image/")) {
        throw new Error("Faqat rasm fayllari yuklanishi mumkin!");
    }

    // 2. Tekshirish: Maksimal hajm (masalan, 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
        throw new Error("Rasm hajmi 5MB dan oshmasligi kerak!");
    }

    const formData = new FormData();
    formData.append("file", file);

    return await api.post<AvatarResponse>("/user/me/avatar", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        // Agar sizda axios interceptors bo'lsa, Content-Type ni ba'zan 
        // o'zi avtomatik aniqlashi uchun headers'ni yozmaslik ham mumkin.
        
        onUploadProgress: (progressEvent) => {
            const total = progressEvent.total || 1;
            const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
            console.log(`Yuklanmoqda: ${percentCompleted}%`);
            // Bu yerda callback yoki state'ga percentCompleted ni berish mumkin
        },
    });
};

/**
 * SECTION: CONTACTS (KONTAKTLAR)
 */

// Yangi kontakt qo'shishni boshlash - OTP yuborish (Create - Step 1)
export const addContactStart = (data: AddContactPayload) => 
    api.post<ApiMessage>("/user/me/contacts_add", data);

// Barcha kontaktlarni olish (Read)
export const getMyContacts = () => 
    api.get<UserContact[]>("/user/me/contacts");

// Kontaktni asosiy (primary) qilish (Update)
export const setPrimaryContact = (contactId: number) => 
    api.patch<ApiMessage>(`/user/me/contacts/${contactId}/primary`);

// Kontaktni o'chirish (Delete)
export const deleteContact = (contactId: number) => 
    api.delete(`/user/me/contacts/${contactId}`);

/**
 * SECTION: SESSIONS (SESSYALAR)
 */

// Faol sessiyalar ro'yxatini olish (Read)
export const getMySessions = () => 
    api.get<UserSession[]>("/user/me/sessions");

// Tanlangan sessiyani yopish (Delete)
export const terminateSession = (sessionId: string) => 
    api.delete<ApiMessage>(`/user/me/sessions/${sessionId}`);