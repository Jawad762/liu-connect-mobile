import { CreatePostMedia } from "@/types/post.types";
import { POST_CONTENT_MAX_LENGTH, POST_MEDIA_MAX_COUNT } from "@/constants/general";

export const validatePost = (content: string, media: CreatePostMedia[]) => {
    if (content.trim().length === 0 && media.length === 0) {
        return { success: false, message: 'Content or media is required' };
    }
    if (media.length > POST_MEDIA_MAX_COUNT) {
        return { success: false, message: `Media must be less than ${POST_MEDIA_MAX_COUNT} items` };
    }
    if (content.trim().length > POST_CONTENT_MAX_LENGTH) {
        return { success: false, message: `Content must be less than ${POST_CONTENT_MAX_LENGTH} characters` };
    }
    return { success: true, message: 'Content is valid' };
}