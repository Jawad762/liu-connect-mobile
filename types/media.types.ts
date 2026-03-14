export type MediaType = 'IMAGE' | 'VIDEO';

export interface MediaItem {
    id: string
    media_url: string
    type: MediaType
}
