import { API_URL } from '@/constants/api'
import useAuthStore from '@/stores/auth.store'
import axios from 'axios'
import { Href, router } from 'expo-router'
import { screens } from './screens'

export const apiClient = axios.create({
    baseURL: `${API_URL}/api`,
    timeout: 10000,
})

apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

const UNAUTHENTICATED_ENDPOINTS = [
    '/auth/signin',
    '/auth/signup',
    '/auth/verify-email',
    '/auth/resend-verification',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/change-password',
]

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const response = error.response
        if (!response) {
            error.message = 'Network error. Please check your connection and try again.'
            return Promise.reject(error)
        }
        const status = response.status

        if (status === 429) {
            router.navigate(screens.rateLimited as Href)
            return Promise.reject(error)
        }

        const originalRequest = response.config as typeof response.config & { _retry?: boolean }
        const url = originalRequest?.url ?? ''
        
        // Surface backend message (if any)
        if (status !== 401 || UNAUTHENTICATED_ENDPOINTS.some((ep) => url.includes(ep))) {
            const serverMessage = response.data?.message
            if (typeof serverMessage === 'string' && serverMessage.trim().length > 0) {
                error.message = serverMessage
            }
            return Promise.reject(error)
        }

        // Refresh-token failed - redirect to login
        if (url.includes('/auth/refresh-token')) {
            router.navigate(screens.auth.login as Href)
            return Promise.reject(error)
        }

        // Already retried - redirect to login
        if (originalRequest._retry) {
            router.navigate(screens.auth.login as Href)
            return Promise.reject(error)
        }

        const refreshSuccess = await useAuthStore.getState().refreshAccessToken()
        if (!refreshSuccess) {
            router.navigate(screens.auth.login as Href)
            return Promise.reject(error)
        }

        originalRequest._retry = true
        return apiClient.request(originalRequest)
    }
)