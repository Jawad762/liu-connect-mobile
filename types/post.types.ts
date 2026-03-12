export type MediaType = 'IMAGE' | 'VIDEO';

export interface PostMedia {
    publicId: string
    media_url: string
    type: MediaType
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
    major: string | null
}

export interface Post {
    id: number
    publicId: string
    content: string
    likes_count: number
    comments_count: number
    is_deleted: boolean
    createdAt: Date
    updatedAt: Date
    userId: number
    communityId: number | null
    user: PostAuthor
    community: PostCommunity | null
    media: PostMedia[]
    isLiked: boolean
}

export interface GetPostsQuery {
    page?: number
    size?: number
    communityPublicId?: string
    authorPublicId?: string
    followingOnly?: boolean
}

export interface CreatePostMedia {
    url: string
    type: MediaType
}

export interface CreatePostPayload {
    content: string
    communityPublicId: string | null
    media: CreatePostMedia[]
}

export interface UpdatePostPayload {
    content: string
    media: CreatePostMedia[]
}

export interface LikePostPayload {
    publicId: string
}

