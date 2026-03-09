import useAuthStore from '@/stores/auth.store'
import axios from 'axios'
import { Href, router } from 'expo-router'

export const apiClient = axios.create({
    baseURL: 'https://6396-185-97-94-175.ngrok-free.app/api',
    timeout: 10000,
    // Don't throw on 4xx/5xx
    validateStatus: (status) => status >= 200 && status < 600,
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
]

apiClient.interceptors.response.use(
    async (response) => {
        if (response.status !== 401) return response

        const originalRequest = response.config as typeof response.config & { _retry?: boolean }
        const url = originalRequest.url ?? ''

        // Auth endpoints: 401 means invalid credentials - return response for caller to handle
        if (UNAUTHENTICATED_ENDPOINTS.some((ep) => url.includes(ep))) return response

        // Refresh-token failed - redirect to login
        if (url.includes('/auth/refresh-token')) {
            router.navigate('/(auth)/login' as Href)
            return Promise.reject(response)
        }

        // Already retried - redirect to login
        if (originalRequest._retry) {
            router.navigate('/(auth)/login' as Href)
            return Promise.reject(response)
        }

        const refreshSuccess = await useAuthStore.getState().refreshAccessToken()
        if (!refreshSuccess) {
            router.navigate('/(auth)/login' as Href)
            return Promise.reject(response)
        }

        originalRequest._retry = true
        return apiClient.request(originalRequest)
    },
    (error) => {
        // Network errors, timeouts, etc.
        return Promise.reject(error)
    }
)