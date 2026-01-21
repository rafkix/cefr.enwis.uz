import api from "./axios";
import {
    User,
    UpdateProfilePayload,
    ChangePasswordPayload,
    ApiMessage,
} from "../types/user";

/* ----------------------------
GET MY PROFILE
----------------------------- */
export const getMyProfileAPI = () => {
    return api.get<User>("/users/get_me");
};

/* ----------------------------
UPDATE PROFILE
----------------------------- */
export const updateProfileAPI = (
    payload: UpdateProfilePayload
) => {
    return api.put<User>("/users/update/profiel", payload);
};

/* ----------------------------
CHANGE PASSWORD
----------------------------- */
export const changePasswordAPI = (
    payload: ChangePasswordPayload
) => {
    return api.put<ApiMessage>(
        "/users/update/change_password",
        payload
    );
};

/* ----------------------------
UPLOAD AVATAR
----------------------------- */
export const uploadAvatarAPI = (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);

    return api.post<User>(
        "/users/update/profile/photo",
        formData,
        {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        }
    );
};

/* ----------------------------
DELETE ME
----------------------------- */
export const deleteMeAPI = () => {
    return api.delete<ApiMessage>(
        "/users/delete/me"
    );
};

/* ----------------------------
ADMIN: DELETE USER
----------------------------- */
export const deleteUserAPI = (userId: string) => {
    return api.delete<ApiMessage>(
        `/admin/users/delete/${userId}`
    );
};
