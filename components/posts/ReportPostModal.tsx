import React, { useEffect, useState } from 'react'
import { Alert, Dimensions, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, TextInput, View } from 'react-native'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { ThemedText } from '../reusable/themed-text'
import { REPORT_DETAILS_MAX_LENGTH, REPORT_REASONS } from '@/constants/general'
import { ReportReason } from '@/types/report.types'
import { Post } from '@/types/post.types'
import { Colors } from '@/constants/theme'
import { useColorScheme } from 'nativewind'
import { cn } from '@/utils/cn.utils'
import { Button } from '../reusable/button'
import { postService } from '@/services/post.service'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

const SCREEN_HEIGHT = Dimensions.get('window').height

const ReportPostModal = ({ visible, onRequestClose, post }: { visible: boolean; onRequestClose: () => void; post: Post }) => {
    const { colorScheme = 'light' } = useColorScheme()
    const insets = useSafeAreaInsets()
    const [selectedReason, setSelectedReason] = useState<string | null>(null)
    const [details, setDetails] = useState('')
    const [loading, setLoading] = useState(false)

    const translateY = useSharedValue(SCREEN_HEIGHT)

    useEffect(() => {
        if (visible) {
            setSelectedReason(null)
            setDetails('')
            translateY.value = withTiming(0, { duration: 280 })
        }
    }, [visible])

    const handleClose = () => {
        translateY.value = withTiming(SCREEN_HEIGHT, { duration: 280 }, () => {
            runOnJS(onRequestClose)()
        })
    }

    const panGesture = Gesture.Pan()
        .activeOffsetY(5)
        .onUpdate((e) => {
            translateY.value = Math.max(0, e.translationY)
        })
        .onEnd((e) => {
            if (e.translationY > 120 || e.velocityY > 700) {
                translateY.value = withTiming(SCREEN_HEIGHT, { duration: 220 }, () => {
                    runOnJS(onRequestClose)()
                })
            } else {
                translateY.value = withTiming(0, { duration: 200 })
            }
        })

    const sheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }))

    const handleReport = async () => {
        if (!selectedReason) {
            Alert.alert('Select a reason', 'Please select a reason before submitting.')
            return
        }
        if (selectedReason === ReportReason.OTHER && details.trim() === '') {
            Alert.alert('Details required', 'Please describe the issue when selecting "Other".')
            return
        }
        try {
            setLoading(true)
            const result = await postService.reportPost(post.id, selectedReason as ReportReason, details.trim() || undefined)
            if (!result.success) throw new Error(result.message)
            Alert.alert('Report submitted', 'Thank you — our team will review this shortly.')
            onRequestClose()
        } catch (error) {
            Alert.alert('Oops!', error instanceof Error ? error.message : 'An error occurred while submitting the report.')
        } finally {
            setLoading(false)
        }
    }

    const colors = Colors[colorScheme]

    return (
        <Modal animationType='none' transparent visible={visible} onRequestClose={handleClose}>
            <View style={{ flex: 1 }}>
                <Pressable
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)' }}
                    onPress={handleClose}
                />
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
                >
                    <Animated.View
                        style={[
                            sheetStyle,
                            {
                                backgroundColor: colors.background,
                                borderTopLeftRadius: 24,
                                borderTopRightRadius: 24,
                                maxHeight: SCREEN_HEIGHT * 0.88,
                                paddingBottom: Math.max(insets.bottom, 12),
                            },
                        ]}
                    >
                        {/* Drag handle — interactive, triggers pan gesture */}
                        <GestureDetector gesture={panGesture}>
                            <View>
                                <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 4 }}>
                                    <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border }} />
                                </View>
                                <View className='flex-row items-center justify-between px-4 pt-2 pb-4'>
                                    <ThemedText className='text-xl font-sans-bold'>Report Post</ThemedText>
                                    <Pressable onPress={handleClose} hitSlop={12} className='p-1 rounded-full bg-surface dark:bg-surfaceDark'>
                                        <MaterialCommunityIcons name="close" size={16} color={colors.muted} />
                                    </Pressable>
                                </View>
                            </View>
                        </GestureDetector>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps='handled'
                            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8, gap: 20 }}
                        >
                            <View>
                                <ThemedText className='text-xs font-sans-semibold tracking-widest text-muted dark:text-mutedDark mb-3 uppercase'>
                                    Select a reason
                                </ThemedText>
                                {REPORT_REASONS.map((reason) => {
                                    const isSelected = selectedReason === reason.id
                                    return (
                                        <Pressable
                                            key={reason.id}
                                            onPress={() => setSelectedReason(reason.id)}
                                            className={cn(
                                                'mb-2 border rounded-2xl py-3 px-4 flex-row items-center gap-3 active:opacity-70',
                                                isSelected
                                                    ? 'border-accent dark:border-accentDark bg-accent/10 dark:bg-accentDark/10'
                                                    : 'border-border dark:border-borderDark'
                                            )}
                                        >
                                            <View
                                                className={cn(
                                                    'w-5 h-5 rounded-full border-2 items-center justify-center flex-shrink-0',
                                                    isSelected
                                                        ? 'border-accent dark:border-accentDark bg-accent dark:bg-accentDark'
                                                        : 'border-border dark:border-borderDark'
                                                )}
                                            >
                                                {isSelected && <View className='w-2 h-2 rounded-full bg-white' />}
                                            </View>
                                            <View className='flex-1'>
                                                <ThemedText className='font-sans-semibold'>{reason.label}</ThemedText>
                                                <ThemedText className='font-sans text-sm text-muted dark:text-mutedDark mt-0.5'>
                                                    {reason.description}
                                                </ThemedText>
                                            </View>
                                        </Pressable>
                                    )
                                })}
                            </View>

                            <View>
                                <View className='flex-row items-baseline justify-between mb-2'>
                                    <ThemedText className='font-sans-semibold'>
                                        {selectedReason === ReportReason.OTHER ? 'Details *' : 'Details'}
                                        {selectedReason !== ReportReason.OTHER && (
                                            <ThemedText className='font-sans text-sm text-muted dark:text-mutedDark'> (optional)</ThemedText>
                                        )}
                                    </ThemedText>
                                    <ThemedText className='font-sans text-xs text-muted dark:text-mutedDark'>
                                        {details.length}/{REPORT_DETAILS_MAX_LENGTH}
                                    </ThemedText>
                                </View>
                                <TextInput
                                    value={details}
                                    onChangeText={setDetails}
                                    maxLength={REPORT_DETAILS_MAX_LENGTH}
                                    className='p-3 border border-border dark:border-borderDark rounded-2xl text-foreground dark:text-foregroundDark font-sans'
                                    numberOfLines={4}
                                    multiline
                                    placeholder='Add more context…'
                                    placeholderTextColor={colors.muted}
                                    style={{ minHeight: 88, textAlignVertical: 'top' }}
                                />
                            </View>
                        </ScrollView>

                        <View className='px-4 pt-3'>
                            <Button
                                onPress={handleReport}
                                loading={loading}
                                disabled={!selectedReason}
                                className='bg-red-500 dark:bg-red-600'
                                textClassName='text-white'
                            >
                                Submit Report
                            </Button>
                        </View>
                    </Animated.View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    )
}

export default ReportPostModal
