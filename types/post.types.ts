import { MediaItem, MediaType } from "./media.types"

export interface PostCommunity {
    id: string
    name: string
}

export interface PostAuthor {
    id: string
    name: string | null
    avatar_url: string | null
    major: string | null
}

export interface Post {
    id: string
    content: string
    likes_count: number
    comments_count: number
    is_deleted: boolean
    createdAt: Date
    updatedAt: Date
    userId: string
    communityId: string | null
    user: PostAuthor
    community: PostCommunity | null
    media: MediaItem[]
    isLiked: boolean
    isBookmarked: boolean
}

export interface GetPostsQuery {
    page?: number
    size?: number
    communityId?: string
    authorId?: string
    followingOnly?: boolean
}

export interface CreatePostMedia {
    url: string
    type: MediaType
}

export interface CreatePostPayload {
    content: string
    communityId: string | null
    media: CreatePostMedia[]
}

export interface UpdatePostPayload {
    content: string
    media: CreatePostMedia[]
}

export interface SearchPostsQuery {
    query: string
    page?: number
    size?: number
}