import type { Href } from 'expo-router'

export const screens = {
  root: '/' as Href,
  auth: {
    login: '/login' as Href,
    register: '/register' as Href,
    forgotPassword: '/forgot-password' as Href,
    resetPassword: '/reset-password' as Href,
    verifyEmail: '/verify-email' as Href,
  },
  bookmarks: '/bookmarks' as Href,
  post: {
    details: (id: string): Href => `/post/${id}` as Href,
  },
  comment: {
    details: (id: string, postId: string): Href =>
      `/comment/${id}?postId=${postId}` as Href,
  },
}

