export interface User {
    id: string;
    email?: string;
    name: string | null;
    avatar_url: string | null;
    bio: string | null;
    school: string | null;
    major: string | null;
    is_verified: boolean;
    followers_count: number;
    following_count: number;
    createdAt: string;
    updatedAt: string;
    is_following?: boolean;
}

export interface SearchUsersQuery {
    query: string
    page?: number
    size?: number
}

export interface UpdateProfilePayload {
    name: string
    avatar_url?: string | null
    bio?: string | null
}

export interface PaginationQuery {
    page?: number
    size?: number
}

export interface AddPushTokenPayload {
    token: string
}

export interface FollowUserResponse {
    following_count: number
    followers_count: number
}