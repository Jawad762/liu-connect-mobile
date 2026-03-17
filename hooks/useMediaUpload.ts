import { Alert } from 'react-native'
import { useState } from 'react'
import { openSettings } from 'expo-linking'
import { useImageUploader, uploadFiles } from '@/lib/uploadthing'
import { inferMediaType } from '@/utils/media-utils'
import { MediaType } from '@/types/media.types'
import * as ImagePicker from 'expo-image-picker'

export interface UploadedMedia {
    url: string
    type: MediaType
}

interface UseMediaUploadOptions {
    endpoint?: 'mediaUploader' | 'imageUploader'
    imageOnly?: boolean
}

const useMediaUpload = (
    maxMedia: number,
    initialMedia: UploadedMedia[] = [],
    options: UseMediaUploadOptions = {}
) => {
    const { endpoint = 'mediaUploader', imageOnly = false } = options

    const [media, setMedia] = useState<UploadedMedia[]>(initialMedia)
    const [customUploading, setCustomUploading] = useState(false)

    const remainingSlots = maxMedia - media.length
    const atLimit = media.length >= maxMedia

    const onUploadComplete = (res: { ufsUrl?: string; url?: string; name?: string; key?: string }[]) =>
        setMedia((m) =>
            [...m, ...res.map((r) => ({ url: r.ufsUrl ?? r.url ?? '', type: inferMediaType(r.name ?? r.key ?? '') }))].slice(0, maxMedia)
        )

    const onUploadError = (e: Error) => {
        Alert.alert('Upload failed', e.message)
        console.error(e)
    }

    const imagePerms = () =>
        Alert.alert('Permission needed', 'Grant photo access to attach media', [
            { text: 'Dismiss' },
            { text: 'Open Settings', onPress: openSettings },
        ])

    const { openImagePicker, isUploading } = useImageUploader(endpoint, {
        onClientUploadComplete: onUploadComplete,
        onUploadError,
    })

    const handlePickFromLibrary = async () => {
        if (remainingSlots <= 0) {
            Alert.alert('Media limit reached', `You can include up to ${maxMedia} media items. Remove one to add more.`)
            return
        }
        const { status } = await ImagePicker.getMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
            const { status: newStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync()
            if (newStatus !== 'granted') {
                imagePerms()
                return
            }
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: imageOnly ? ['images'] : ['images', 'videos'],
            allowsMultipleSelection: maxMedia > 1,
            selectionLimit: maxMedia > 1 ? remainingSlots : 1,
            quality: 1,
        })
        if (result.canceled || !result.assets?.length) return
        setCustomUploading(true)
        try {
            const files = await Promise.all(
                result.assets.map(async (a) => {
                    const res = await fetch(a.uri)
                    const blob = await res.blob()
                    const name = a.fileName ?? a.uri.split('/').pop() ?? 'file'
                    const file = new File([blob], name, { type: a.mimeType ?? a.type ?? undefined })
                    return Object.assign(file, { uri: a.uri }) as File & { uri: string }
                })
            )
            const uploaded = await uploadFiles(endpoint, { files })
            if (uploaded?.length) onUploadComplete(uploaded)
        } catch (err) {
            onUploadError(err instanceof Error ? err : new Error('Upload failed'))
        } finally {
            setCustomUploading(false)
        }
    }

    const handlePickFromCamera = () => {
        if (remainingSlots <= 0) {
            Alert.alert('Media limit reached', `You can include up to ${maxMedia} media items. Remove one to add more.`)
            return
        }
        openImagePicker({ source: 'camera', onInsufficientPermissions: imagePerms })
    }

    const handleRemoveMedia = (index: number) =>
        setMedia((prev) => prev.filter((_, i) => i !== index))

    const resetMedia = (newMedia: UploadedMedia[] = []) => setMedia(newMedia)

    return {
        media,
        setMedia,
        resetMedia,
        isUploading: isUploading || customUploading,
        atLimit,
        remainingSlots,
        handlePickFromLibrary,
        handlePickFromCamera,
        handleRemoveMedia,
    }
}

export default useMediaUpload
