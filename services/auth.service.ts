import { ApiResponse } from "@/types/api.types"
import {
    LoginResponse,
    RefreshTokenResponse,
    SignUpResponse,
} from "@/types/auth.types"
import { apiClient } from "@/utils/api-client.utils"

export const authService = {
    login: async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
        const response = await apiClient.post('/auth/signin', { email, password })
        return response.data
    },
    register: async (email: string, password: string): Promise<ApiResponse<SignUpResponse>> => {
        const response = await apiClient.post('/auth/signup', { email, password })
        return response.data
    },
    logout: async (): Promise<ApiResponse<undefined>> => {
        const response = await apiClient.post('/auth/signout')
        return response.data
    },
    refreshToken: async (refreshToken: string): Promise<ApiResponse<RefreshTokenResponse>> => {
        const response = await apiClient.post('/auth/refresh', { refreshToken })
        return response.data
    },
    verifyEmail: async (email: string, code: string): Promise<ApiResponse<undefined>> => {
        const response = await apiClient.post('/auth/verify-email', { email, code })
        return response.data
    },
    resendVerificationCode: async (email: string): Promise<ApiResponse<undefined>> => {
        const response = await apiClient.post('/auth/resend-verification', { email })
        return response.data
    },
    forgotPassword: async (email: string): Promise<ApiResponse<undefined>> => {
        const response = await apiClient.post('/auth/forgot-password', { email })
        return response.data
    },
    resetPassword: async (email: string, code: string, newPassword: string): Promise<ApiResponse<undefined>> => {
        const response = await apiClient.post('/auth/reset-password', { email, code, newPassword })
        return response.data
    },
    changePassword: async (currentPassword: string, newPassword: string): Promise<ApiResponse<undefined>> => {
        const response = await apiClient.post('/auth/change-password', {
            currentPassword,
            newPassword,
        })
        return response.data
    },
}