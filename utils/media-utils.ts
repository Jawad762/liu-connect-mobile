import { CreatePostMedia } from "@/types/post.types";

const VIDEO_EXTS = ['.mp4', '.mov', '.m4v', '.webm', '.avi', '.mkv'];

export const inferMediaType = (fileName: string): CreatePostMedia['type'] =>
    VIDEO_EXTS.some((ext) => fileName.toLowerCase().endsWith(ext)) ? 'VIDEO' : 'IMAGE';