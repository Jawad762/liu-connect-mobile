import type { Href } from 'expo-router'

export const screens = {
  home: '/' as Href,
  search: '/search' as Href,
  auth: {
    login: '/login' as Href,
    register: '/register' as Href,
    forgotPassword: '/forgot-password' as Href,
    resetPassword: '/reset-password' as Href,
    verifyEmail: '/verify-email' as Href,
    welcome: '/welcome' as Href,
  },
  bookmarks: '/bookmarks' as Href,
  rateLimited: '/rate-limited' as Href,
  post: {
    details: (id: string): Href => `/post/${id}` as Href,
  },
  comment: {
    details: (id: string, postId: string): Href =>
      `/comment/${id}?postId=${postId}` as Href,
  },
  user: {
    profile: (id: string): Href => `/user/${id}/profile` as Href,
    followers: (id: string): Href => `/user/${id}/followers` as Href,
    following: (id: string): Href => `/user/${id}/following` as Href
  },
  communities: {
    index: '/communities' as Href,
    details: (id: string): Href => `/community/${id}` as Href,
  },
  notifications: '/notifications' as Href,
  settings: {
    index: '/settings' as Href,
    notifications: '/settings/notifications' as Href,
    account: '/settings/account' as Href,
    blocked: '/settings/blocked' as Href,
  },
  onboarding: '/onboarding' as Href,
}

