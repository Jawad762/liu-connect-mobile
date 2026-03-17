import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthStore } from '@/types/store.types';
import { User } from '@/types/user.types';
import { authService } from '@/services/auth.service';

let refreshTokenPromise: Promise<boolean> | null = null

const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
        user: null,
        setUser: (user: User | null) => set({ user }),
        accessToken: null,
        refreshToken: null,
        setAccessToken: (accessToken: string) => set({ accessToken }),
        setRefreshToken: (refreshToken: string) => set({ refreshToken }),
        refreshAccessToken: async (): Promise<boolean> => {
            if (refreshTokenPromise) {
                return await refreshTokenPromise
            }
            refreshTokenPromise = (async () => {
                const refreshToken = get().refreshToken
                if (!refreshToken) {
                    return false
                }
                const response = await authService.refreshToken(refreshToken)
                if (response.success) {
                    set({ accessToken: response.data.accessToken })
                    return true
                }
                return false
            })().finally(() => {
                refreshTokenPromise = null
            })
            return await refreshTokenPromise
        },
        login: (user: User, accessToken: string, refreshToken: string) => set({ user, accessToken, refreshToken }),
        logout: () => set({ user: null, accessToken: null, refreshToken: null }),
        resendEmailVerificationCodeAfterDate: null,
        setResendEmailVerificationCodeAfterDate: (date: Date | null) => set({ resendEmailVerificationCodeAfterDate: date }),
        resendPasswordResetCodeAfterDate: null,
        setResendPasswordResetCodeAfterDate: (date: Date | null) => set({ resendPasswordResetCodeAfterDate: date }),
    }),
    {
        name: 'auth',
        storage: createJSONStorage(() => AsyncStorage),
    })
)


export default useAuthStore;