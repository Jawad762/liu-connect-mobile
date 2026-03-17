import { Href } from "expo-router";

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