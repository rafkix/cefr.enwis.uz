import api from "./axios";

export const getMyPaymentsAPI = () => api.get("/payments/check/me");

export const getMySubscriptionAPI = () => api.get("/payments/subscription/me");

export const createPaymentAPI = (payload: { amount: number; provider: string }) => 
    api.post("/payments/create", payload);