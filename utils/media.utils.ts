import { CreatePostMedia } from "@/types/post.types";
import { ViewStyle } from "react-native";

const VIDEO_EXTS = ['.mp4', '.mov', '.m4v', '.webm', '.avi', '.mkv'];

export const inferMediaType = (fileName: string): CreatePostMedia['type'] =>
    VIDEO_EXTS.some((ext) => fileName.toLowerCase().endsWith(ext)) ? 'VIDEO' : 'IMAGE';

export const getMediaItemStyle = (count: number, index: number): ViewStyle => {
    if (count === 2) return { width: '48%' };
    if (count === 3) return index < 2 ? { width: '48%' } : { width: '100%' };
    if (count === 4) return { width: '48%' };
    return { width: '100%' };
};