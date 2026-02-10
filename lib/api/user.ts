import api from "./axios";

// Profil ma'lumotlarini olish va yangilash
export const meAPI = () => api.get("/user/me/");
export const updateProfileAPI = (data: any) => api.put("/user/me/profile", data);
export const getMyContactsAPI = () => api.get("/user/me/contacts");

// Avatar bilan ishlash
export const uploadAvatarAPI = (file: File) => {
    const formData = new FormData();
    formData.append("file", file); // Backendda: file: UploadFile = File(...)
    return api.post("/user/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

// Sessiyalar (Qurilmalar)
export const getMySessionsAPI = () => api.get("/user/me/sessions");
export const terminateSessionAPI = (sessionId: string) => api.delete(`/user/me/sessions/${sessionId}`);

// Telefon raqami
export const requestPhoneUpdateAPI = (phone: string) => api.post("/user/me/phone/update-request", { new_phone: phone });
export const verifyPhoneUpdateAPI = (phone: string, code: string) => 
    api.post("/user/me/phone/verify", { new_phone: phone, verification_code: code });