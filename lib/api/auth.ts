import api from "./axios";

export const authService = {
  getMe: async () => {
    const res = await api.get("/auth/me");
    return res.data;
  },

  loginByPhone: async (payload: any) => {
    return api.post("/auth/phone/login", payload);
  },

  logout: async () => {
    await api.post("/auth/logout");
    window.location.href = "https://auth.enwis.uz";
  },
};
