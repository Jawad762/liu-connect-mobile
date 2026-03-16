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
    details: (id: string): Href => `/user/${id}` as Href,
  },
}

