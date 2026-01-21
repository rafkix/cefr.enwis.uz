export interface RegisterPayload {
    full_name: string;
    username: string;
    email: string;
    phone: string;
    age: number;
    level: string;
    role: string;
    profile_image?: string;
    password: string;
}

export interface LoginPayload {
    username: string;
    password: string;
}

export interface TelegramRegisterPayload {
    full_name: string;
    username: string;
    telegram_id: string;
    bio?: string;
    profile_image?: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: "bearer";
}
