import api from "./axios";

// Profil ma'lumotlarini olish va yangilash
export const meAPI = () => api.get("/user/me/");
export const updateProfileAPI = (data: any) => api.put("/user/me/profile", data);
export const getMyContactsAPI = () => api.get("/user/me/contacts");

// Avatar bilan ishlash
export const uploadAvatarAPI = async (file: File) => {
    const formData = new FormData();
    // Kalit so'z 'file' backenddagi bilan bir xil bo'lishi shart
    formData.append("file", file);

    return await api.post("/user/me/avatar", formData, {
        headers: {
            // Content-Type ni qo'lda yozmang, Axios o'zi FormData uchun boundary qo'shadi
            "Content-Type": "multipart/form-data",
        },
        // Katta fayllar uchun progress ko'rsatmoqchi bo'lsangiz:
        onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            console.log(`Yuklanmoqda: ${percentCompleted}%`);
        },
    });
};
// Sessiyalar (Qurilmalar)
export const getMySessionsAPI = () => api.get("/user/me/sessions");
export const terminateSessionAPI = (sessionId: string) => api.delete(`/user/me/sessions/${sessionId}`);

// Telefon raqami
export const requestPhoneUpdateAPI = (phone: string) => api.post("/user/me/phone/update-request", { new_phone: phone });
export const verifyPhoneUpdateAPI = (phone: string, code: string) => 
    api.post("/user/me/phone/verify", { new_phone: phone, verification_code: code });