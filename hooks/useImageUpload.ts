import useMediaUpload, { UploadedMedia } from './useMediaUpload'

export type { UploadedMedia }

const useImageUpload = (initialMedia: UploadedMedia[] = [], handleUploadSuccess?: (data: { media: UploadedMedia[] }) => void) =>
    useMediaUpload(1, initialMedia, { endpoint: 'imageUploader', imageOnly: true }, handleUploadSuccess)

export default useImageUpload
