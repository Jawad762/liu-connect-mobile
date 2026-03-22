export interface Community {
    id: string
    name: string
    description: string | null
    avatar_url: string | null
    createdById: string
    createdAt: string
    updatedAt: string
    isJoined: boolean
}

export interface GetCommunitiesQuery {
    page?: number
    size?: number
    search?: string
    /** When true, only return communities the user has joined */
    userOnly?: boolean
}

export interface CreateCommunityPayload {
    name: string
    description?: string | null
    avatar_url?: string | null
}

export interface UpdateCommunityPayload {
    name?: string
    description?: string | null
    avatar_url?: string | null
}
