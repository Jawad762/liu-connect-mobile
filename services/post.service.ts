import { ApiResponse } from "../types/api.types"
import {
    CreatePostPayload,
    GetPostsQuery,
    Post,
    SearchPostsQuery,
    UpdatePostPayload,
} from "../types/post.types"
import { apiClient } from "../utils/api-client.utils"

export const postService = {
    getPosts: async (query: GetPostsQuery = {}): Promise<ApiResponse<Post[]>> => {
        const response = await apiClient.get("/posts", { params: query })
        return response.data
    },

    getPost: async (id: string): Promise<ApiResponse<Post>> => {
        const response = await apiClient.get(`/posts/${id}`)
        return response.data
    },

    createPost: async (payload: CreatePostPayload): Promise<ApiResponse<Post>> => {
        const response = await apiClient.post("/posts", payload)
        return response.data
    },

    updatePost: async (
        id: string,
        payload: UpdatePostPayload,
    ): Promise<ApiResponse<undefined>> => {
        const response = await apiClient.put(`/posts/${id}`, payload)
        return response.data
    },

    deletePost: async (id: string): Promise<ApiResponse<undefined>> => {
        const response = await apiClient.delete(`/posts/${id}`)
        return response.data
    },

    likePost: async (id: string): Promise<ApiResponse<undefined>> => {
        const response = await apiClient.patch(`/posts/${id}/like`)
        return response.data
    },

    unlikePost: async (id: string): Promise<ApiResponse<undefined>> => {
        const response = await apiClient.patch(`/posts/${id}/unlike`)
        return response.data
    },

    getBookmarkedPosts: async (query: GetPostsQuery = {}): Promise<ApiResponse<Post[]>> => {
        const response = await apiClient.get("/posts/bookmarks", { params: query })
        return response.data
    },

    bookmarkPost: async (id: string): Promise<ApiResponse<undefined>> => {
        const response = await apiClient.post(`/posts/${id}/bookmark`)
        return response.data
    },

    unbookmarkPost: async (id: string): Promise<ApiResponse<undefined>> => {
        const response = await apiClient.delete(`/posts/${id}/unbookmark`)
        return response.data
    },

    search: async (query: SearchPostsQuery): Promise<ApiResponse<Post[]>> => {
        const response = await apiClient.get(`/posts/search`, { params: query })
        return response.data
    },
}
