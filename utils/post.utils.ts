import { CreatePostMedia } from "@/types/post.types";
import { MAX_POST_CONTENT_LENGTH } from "@/constants/general";

export const validatePost = (content: string, media: CreatePostMedia[]) => {
    if (content.trim().length === 0 && media.length === 0) {
        return { success: false, message: 'Content or media is required' };
    }
    if (media.length > 4) {
        return { success: false, message: 'Media must be less than 4 items' };
    }
    if (content.trim().length > MAX_POST_CONTENT_LENGTH) {
        return { success: false, message: `Content must be less than ${MAX_POST_CONTENT_LENGTH} characters` };
    }
    return { success: true, message: 'Content is valid' };
}

export const abbreviateMajor = (major: string) => {
    return major.split(' ').map(word => word[0]).join('');
}