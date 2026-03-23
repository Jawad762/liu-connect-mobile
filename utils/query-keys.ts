import { GetPostsQuery } from '@/types/post.types'
import { GetCommentsQuery } from '@/types/comment.types'
import { GetCommunitiesQuery } from '@/types/community.types'

export const postKeys = {
  all: ['posts'] as const,
  list: (filters: GetPostsQuery = {}) =>
    ['posts', filters.communityId, filters.authorId, filters.followingOnly, filters.communitiesOnly, filters.size] as const,
  detail: (id: string) => ['post', id] as const,
  bookmarks: (size?: number) => ['post-bookmarks', size] as const,
  search: (query: string, size?: number) => ['posts-search', query, size] as const,
}

export const commentKeys = {
  all: ['comments'] as const,
  list: (args: GetCommentsQuery) =>
    ['comments', args.postId, args.parentCommentId, args.userId, args.size] as const,
  detail: (id: string) => ['comment', id] as const,
  bookmarks: (size?: number) => ['comment-bookmarks', size] as const,
}

export const userKeys = {
  all: ['users'] as const,
  search: (query: string, size?: number) => ['users-search', query, size] as const,
  detail: (id: string) => ['user', id] as const,
  followers: (id: string, size?: number) => ['user-followers', id, size] as const,
  following: (id: string, size?: number) => ['user-following', id, size] as const,
}

export const notificationKeys = {
  all: ['notifications'] as const,
  list: (size?: number) => ['notifications', size] as const,
}

export const communityKeys = {
  all: ['communities'] as const,
  list: (query: GetCommunitiesQuery = {}) =>
    ['communities', query.page, query.size, query.search, query.userOnly] as const,
  detail: (id: string) => ['community', id] as const,
  suggested: (courseCodes: string[]) => ['suggested-communities', courseCodes] as const,
}