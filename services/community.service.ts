import { ApiResponse } from "../types/api.types"
import {
    Community,
    CreateCommunityPayload,
    GetCommunitiesQuery,
    UpdateCommunityPayload,
} from "../types/community.types"
import { apiClient } from "../utils/api-client.utils"

export const communityService = {
    getCommunities: async (
        query: GetCommunitiesQuery = {}
    ): Promise<ApiResponse<Community[]>> => {
        const { userOnly, ...rest } = query
        const params = { ...rest, ...(userOnly && { userOnly: 'true' }) }
        const response = await apiClient.get("/communities", { params })
        return response.data
    },

    getCommunity: async (id: string): Promise<ApiResponse<Community>> => {
        const response = await apiClient.get(`/communities/${id}`)
        return response.data
    },

    createCommunity: async (
        payload: CreateCommunityPayload
    ): Promise<ApiResponse<Community>> => {
        const response = await apiClient.post("/communities", payload)
        return response.data
    },

    updateCommunity: async (
        id: string,
        payload: UpdateCommunityPayload
    ): Promise<ApiResponse<undefined>> => {
        const response = await apiClient.put(`/communities/${id}`, payload)
        return response.data
    },

    deleteCommunity: async (id: string): Promise<ApiResponse<undefined>> => {
        const response = await apiClient.delete(`/communities/${id}`)
        return response.data
    },

    joinCommunity: async (id: string): Promise<ApiResponse<undefined>> => {
        const response = await apiClient.post(`/communities/${id}/join`)
        return response.data
    },

    leaveCommunity: async (id: string): Promise<ApiResponse<undefined>> => {
        const response = await apiClient.delete(`/communities/${id}/join`)
        return response.data
    },
}
