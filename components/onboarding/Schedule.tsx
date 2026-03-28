import React, { useState } from 'react'
import { Alert, View, Image as RNImage, useWindowDimensions } from 'react-native'
import { ThemedText } from '../reusable/themed-text'
import { Image } from 'expo-image'
import { Button, GradientButton } from '../reusable/button'
import useMediaUpload, { UploadedMedia } from '@/hooks/useMediaUpload'
import LoadingOverlay from '../reusable/loading-overlay'
import { aiService } from '@/services/ai.service'
import { AnalyzeScheduleResponse } from '@/types/ai.types'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useColorScheme } from 'nativewind'
import { Colors } from '@/constants/theme'
import useImageUpload from '@/hooks/useImageUpload'

const Schedule = ({
    setAiResponse,
    onNext,
}: {
    setAiResponse: (aiResponse: AnalyzeScheduleResponse) => void
    onNext: () => void
}) => {
    const { width } = useWindowDimensions()
    const { colorScheme = 'light' } = useColorScheme()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleUploadSuccess = async (data: { media: UploadedMedia[] }) => {
        setIsSubmitting(true)
        try {
            const scheduleUrl = data.media[0]?.url
            if (!scheduleUrl) throw new Error('Something went wrong while uploading the schedule')
            const result = await aiService.uploadSchedule(scheduleUrl)
            if (!result.success) throw new Error(result.message)
            setAiResponse(result.data!)
            onNext()
        } catch (error) {
            error instanceof Error && Alert.alert('Error', error.message)
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const { handlePickFromLibrary, isUploading } = useImageUpload([], handleUploadSuccess)

    const scheduleImage = RNImage.resolveAssetSource(require('@/assets/images/schedule-example.png'))
    const aspectRatio = scheduleImage.width / scheduleImage.height

    return (
        <View className="flex-1 px-5 pb-6" style={{ width }}>
            <ThemedText className="text-2xl font-sans-bold mb-1">
                Upload Your Schedule
            </ThemedText>
            <ThemedText
                className="text-sm mb-6"
                style={{ lineHeight: 20, color: Colors[colorScheme].muted }}
            >
                Upload your semester schedule — our AI will extract your courses, major, and campus automatically.
            </ThemedText>

            <View
                style={{
                    backgroundColor: Colors[colorScheme].surface,
                    borderRadius: 16,
                    overflow: 'hidden',
                    marginBottom: 24,
                }}
            >
                <Image
                    source={require('@/assets/images/schedule-example.png')}
                    contentFit="contain"
                    style={{ width: '100%', aspectRatio }}
                />
                <View className="items-center py-2.5">
                    <ThemedText
                        className="text-xs font-sans-medium"
                        style={{ color: Colors[colorScheme].muted }}
                    >
                        Example schedule format
                    </ThemedText>
                </View>
            </View>

            <View className="flex-1 justify-end">
                <GradientButton
                    size="lg"
                    onPress={handlePickFromLibrary}
                    fullWidth
                    leftIcon={<MaterialCommunityIcons name="image-multiple" size={18} color="white" />}
                >
                    Upload Schedule
                </GradientButton>
                <Button variant="outline" size="lg" onPress={onNext} fullWidth>
                    Continue Manually
                </Button>
            </View>

            <LoadingOverlay visible={isSubmitting || isUploading} />
        </View>
    )
}

export default Schedule
