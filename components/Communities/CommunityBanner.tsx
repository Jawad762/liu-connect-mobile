import React, { useState } from 'react'
import { Image, Pressable, View } from 'react-native'
import { ThemedText } from '../reusable/themed-text'
import { Colors } from '@/constants/theme'
import { useColorScheme } from 'nativewind'
import { IconSymbol } from '../reusable/icon-symbol'
import { getInitials } from '@/utils/string.utils'
import { ImageViewerModal } from '../reusable/ImageViewerModal'

const BANNER_HEIGHT = 200

interface CommunityBannerProps {
    avatarUrl: string | null
    name?: string
    onPress?: () => void
}

const CommunityBanner = ({ avatarUrl, name, onPress }: CommunityBannerProps) => {
    const { colorScheme = 'light' } = useColorScheme()
    const initials = name ? getInitials(name) : null
    const [imageViewerModalVisible, setImageViewerModalVisible] = useState(false)

    const content = (
        <View
            style={{ height: BANNER_HEIGHT, backgroundColor: Colors[colorScheme].surface }}
            className="w-full items-center justify-center overflow-hidden"
        >
            {avatarUrl && onPress ? (
                <Image source={{ uri: avatarUrl }} className="w-full h-full" resizeMode="cover" />
            ) : avatarUrl && !onPress ? (
                <>
                    <Pressable className='w-full h-full' onPress={() => setImageViewerModalVisible(true)}>
                        <Image source={{ uri: avatarUrl }} className="w-full h-full" resizeMode="cover" />
                    </Pressable>
                    <ImageViewerModal
                        visible={imageViewerModalVisible}
                        imageUri={avatarUrl}
                        onClose={() => setImageViewerModalVisible(false)}
                    />
                </>
            ) : (
                <View className="w-full h-full items-center justify-center bg-accent/20 dark:bg-accentDark/20">
                    {initials && (
                        <ThemedText className="text-5xl font-sans-bold text-accent dark:text-accentDark">
                            {initials}
                        </ThemedText>
                    )}
                    {!initials && (
                        <IconSymbol name="photo.on.rectangle.angled" size={48} color={Colors[colorScheme].muted} />
                    )}
                </View>
            )}
        </View>
    )

    if (onPress) {
        return <Pressable onPress={onPress}>{content}</Pressable>
    }
    return content
}

export default CommunityBanner
export { BANNER_HEIGHT }
