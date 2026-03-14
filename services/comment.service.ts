import { ApiResponse } from "../types/api.types"
import {
    Comment,
    CreateCommentPayload,
    GetCommentsQuery,
    UpdateCommentPayload,
} from "../types/comment.types"
import { apiClient } from "../utils/api-client.utils"

export const commentService = {
    getComments: async (query: GetCommentsQuery): Promise<ApiResponse<Comment[]>> => {
        const response = await apiClient.get("/comments", { params: query })
        return response.data
    },

    getComment: async (id: string): Promise<ApiResponse<Comment>> => {
        const response = await apiClient.get(`/comments/${id}`)
        return response.data
    },

    createComment: async (payload: CreateCommentPayload): Promise<ApiResponse<Comment>> => {
        const response = await apiClient.post("/comments", payload)
        return response.data
    },

    updateComment: async (
        id: string,
        payload: UpdateCommentPayload,
    ): Promise<ApiResponse<undefined>> => {
        const response = await apiClient.put(`/comments/${id}`, payload)
        return response.data
    },

    deleteComment: async (id: string): Promise<ApiResponse<undefined>> => {
        const response = await apiClient.delete(`/comments/${id}`)
        return response.data
    },

    likeComment: async (id: string): Promise<ApiResponse<undefined>> => {
        const response = await apiClient.patch(`/comments/${id}/like`)
        return response.data
    },

    unlikeComment: async (id: string): Promise<ApiResponse<undefined>> => {
        const response = await apiClient.patch(`/comments/${id}/unlike`)
        return response.data
    },
}

