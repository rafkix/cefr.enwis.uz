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
    const formData = new FormData();
    formData.append("file", file);

    return await api.post<AvatarResponse>("/user/me/avatar", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total || 1)
            );
            console.log(`Avatar yuklanmoqda: ${percentCompleted}%`);
        },
    });
};

/**
 * SECTION: CONTACTS (KONTAKTLAR)
 */

// Yangi kontakt qo'shishni boshlash - OTP yuborish (Create - Step 1)
export const addContactStart = (data: AddContactPayload) => 
    api.post<ApiMessage>("/user/me/contacts", data);

// Kodni tasdiqlash va kontaktni saqlash (Create - Step 2)
export const addContactVerify = (data: VerifyContactPayload) => 
    api.post<ApiMessage>("/user/me/contacts/verify", data);

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