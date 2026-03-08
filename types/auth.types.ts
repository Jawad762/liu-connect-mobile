import { User } from "./user.types";

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface SignUpResponse {
    user: User;
}

export interface RefreshTokenResponse {
    accessToken: string;
}