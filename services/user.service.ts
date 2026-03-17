import { ApiResponse } from "@/types/api.types"
import { User, SearchUsersQuery, UpdateProfilePayload, PaginationQuery, AddPushTokenPayload, FollowUserResponse } from "@/types/user.types"
import { apiClient } from "@/utils/api-client.utils"

export const userService = {
    getMe: async (): Promise<ApiResponse<User>> => {
        const response = await apiClient.get("/users/me")
        return response.data
    },

    updateProfile: async (payload: UpdateProfilePayload): Promise<ApiResponse<User>> => {
        const response = await apiClient.patch("/users/me", payload)
        return response.data
    },

    getUserById: async (id: string): Promise<ApiResponse<User>> => {
        const response = await apiClient.get(`/users/${id}`)
        return response.data
    },

    followUser: async (id: string): Promise<ApiResponse<FollowUserResponse>> => {
        const response = await apiClient.post(`/users/${id}/follow`)
        return response.data
    },

    unfollowUser: async (id: string): Promise<ApiResponse<FollowUserResponse>> => {
        const response = await apiClient.delete(`/users/${id}/follow`)
        return response.data
    },

    getFollowers: async (
        id: string,
        query: PaginationQuery = {},
    ): Promise<ApiResponse<User[]>> => {
        const response = await apiClient.get(`/users/${id}/followers`, { params: query })
        return response.data
    },

    getFollowing: async (
        id: string,
        query: PaginationQuery = {},
    ): Promise<ApiResponse<User[]>> => {
        const response = await apiClient.get(`/users/${id}/following`, { params: query })
        return response.data
    },

    addPushToken: async (payload: AddPushTokenPayload): Promise<ApiResponse<undefined>> => {
        const response = await apiClient.post("/users/me/push-token", payload)
        return response.data
    },

    search: async (query: SearchUsersQuery): Promise<ApiResponse<User[]>> => {
        const response = await apiClient.get("/users/search", { params: query })
        return response.data
    },
}