import { User } from "./user.types"

export interface PostMedia {
    id: number
    media_url: string
}

export interface PostCommunity {
    id: number
    publicId: string
    name: string
}

export interface PostAuthor {
    id: number
    publicId: string
    name: string | null
    avatar_url: string | null
}

export interface Post {
    id: number
    publicId: string
    content: string
    likes_count: number
    is_deleted: boolean
    createdAt: Date
    updatedAt: Date
    userId: number
    communityId: number | null
    user: PostAuthor | User
    community: PostCommunity | null
    media: PostMedia[]
    isLiked: boolean
}

export interface GetPostsQuery {
    page?: number
    size?: number
    communityPublicId?: string
    userPublicId?: string
}

export interface CreatePostPayload {
    content: string
    communityPublicId: string
    media: string[]
}

export interface UpdatePostPayload {
    content: string
    media: string[]
}

export interface LikePostPayload {
    publicId: string
}

