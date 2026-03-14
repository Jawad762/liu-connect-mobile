export interface User {
    id: string;
    email: string;
    name: string | null;
    avatar_url: string | null;
    bio: string | null;
    school: string | null;
    major: string | null;
    is_verified: boolean;
    followers_count: number;
    following_count: number;
    createdAt: Date;
    updatedAt: Date;
}
