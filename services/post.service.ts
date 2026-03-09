import { ApiResponse } from "../types/api.types"
import {
    CreatePostPayload,
    GetPostsQuery,
    LikePostPayload,
    Post,
    UpdatePostPayload,
} from "../types/post.types"
import { apiClient } from "../utils/api-client.utils"

export const postService = {
    getPosts: async (query: GetPostsQuery = {}): Promise<ApiResponse<Post[]>> => {
        const response = await apiClient.get("/posts", { params: query })
        return response.data
    },

    getPost: async (publicId: string): Promise<ApiResponse<Post>> => {
        const response = await apiClient.get(`/posts/${publicId}`)
        return response.data
    },

    createPost: async (payload: CreatePostPayload): Promise<ApiResponse<Post>> => {
        const response = await apiClient.post("/posts", payload)
        return response.data
    },

    updatePost: async (
        publicId: string,
        payload: UpdatePostPayload,
    ): Promise<ApiResponse<undefined>> => {
        const response = await apiClient.put(`/posts/${publicId}`, payload)
        return response.data
    },

    deletePost: async (publicId: string): Promise<ApiResponse<undefined>> => {
        const response = await apiClient.delete(`/posts/${publicId}`)
        return response.data
    },

    likePost: async (payload: LikePostPayload): Promise<ApiResponse<undefined>> => {
        const response = await apiClient.patch("/posts/like", payload)
        return response.data
    },

    unlikePost: async (payload: LikePostPayload): Promise<ApiResponse<undefined>> => {
        const response = await apiClient.patch("/posts/unlike", payload)
        return response.data
    },
}
