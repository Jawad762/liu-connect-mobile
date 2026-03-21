import { Href } from "expo-router";

enum NotificationType {
  LIKE,
  COMMENT,
  FOLLOW,
  MENTION
}

export interface Notification {
  title: string;
  body?: string | null;
  id: string;
  createdAt: Date;
  type: NotificationType;
  media_url: string | null;
  redirect_url: string | null;
  read: boolean;
  actorId: string;
  actor: {
    id: string;
    name: string;
    avatar_url: string | null;
  }
}

type PushNotificationType =
  | "comment_created"
  | "comment_reply"
  | "post_liked"
  | "comment_liked"
  | "user_followed";


export interface PushNotification {
  type: PushNotificationType;
  redirectPath: Href;
  postId?: string;
  commentId?: string;
  parentCommentId?: string;
  actorId?: string;
  actorName?: string;
  followerId?: string;
}

