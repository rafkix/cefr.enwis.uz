export interface User {
    id: string;
    full_name: string;
    username: string;
    email: string;
    phone?: string;
    age?: number;
    level?: string;
    role: string;
    bio?: string;
    profile_image?: string;
    created_at: string;
}

export interface UpdateProfilePayload {
    full_name?: string;
    level?: string;
    bio?: string;
}

export interface ChangePasswordPayload {
    old_password: string;
    new_password: string;
}

export interface ApiMessage {
    message: string;
}
