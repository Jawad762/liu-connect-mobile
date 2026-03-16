import { MediaType } from "./media.types"

export interface CommentMedia {
    id: string
    media_url: string
    type: MediaType
}

export interface CommentAuthor {
    id: string
    name: string | null
    avatar_url: string | null
    major: string | null
}

export interface Comment {
    id: string;
    content: string;
    postId: string;
    userId: string;
    parentId: string | null;
    likes_count: number;
    replies_count: number;
    createdAt: Date;
    updatedAt: Date;   
    user: CommentAuthor;
    media: CommentMedia[];
    isLiked: boolean;
    is_deleted: boolean;
    isBookmarked: boolean;
};

export interface GetCommentsQuery {
    page?: number
    size?: number
    postId?: string
    userId?: string
    parentCommentId?: string
}

export interface CreateCommentMedia {
    url: string
    type: MediaType
}

export interface CreateCommentPayload {
    postId: string
    content: string
    media: CreateCommentMedia[]
    parentCommentId?: string
}

export interface UpdateCommentPayload {
    content: string
    media: CreateCommentMedia[]
}
