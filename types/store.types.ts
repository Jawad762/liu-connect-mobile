import { User } from "./user.types"

export interface AuthStore {
    user: User | null
    setUser: (user: User) => void
    accessToken: string | null
    refreshToken: string | null
    setAccessToken: (accessToken: string) => void
    setRefreshToken: (refreshToken: string) => void
    login: (user: User, accessToken: string, refreshToken: string) => void
    logout: () => void
    refreshAccessToken: () => Promise<boolean>,
    resendEmailVerificationCodeAfterDate: Date | null
    setResendEmailVerificationCodeAfterDate: (date: Date | null) => void
    resendPasswordResetCodeAfterDate: Date | null
    setResendPasswordResetCodeAfterDate: (date: Date | null) => void
}