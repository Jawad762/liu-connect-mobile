import useMediaUpload, { UploadedMedia } from './useMediaUpload'

export type { UploadedMedia }

const useImageUpload = (initialMedia: UploadedMedia[] = []) =>
    useMediaUpload(1, initialMedia, { endpoint: 'imageUploader', imageOnly: true })

export default useImageUpload
