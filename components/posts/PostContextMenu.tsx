import { Post } from '@/types/post.types'
import useAuthStore from '@/stores/auth.store'
import { useEffect } from 'react'
import { Dimensions, Modal, Pressable, View } from 'react-native'
import { useColorScheme } from 'nativewind'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Colors } from '@/constants/theme'
import { ThemedText } from '../reusable/themed-text'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { IconSymbol } from '../reusable/icon-symbol'

type PostContextMenuProps = {
    post: Post
    visible: boolean
    onRequestClose: () => void
    onEdit?: () => void
    onDelete?: () => void
    onCopyText?: () => void
    onReport?: () => void
}

const SCREEN_HEIGHT = Dimensions.get('window').height

const PostContextMenu = ({ post, visible, onRequestClose, onEdit, onDelete, onCopyText, onReport }: PostContextMenuProps) => {
    const { colorScheme = 'light' } = useColorScheme()
    const insets = useSafeAreaInsets()
    const currentUserId = useAuthStore(state => state.user?.id)
    const isOwnPost = currentUserId === post.userId
    const translateY = useSharedValue(SCREEN_HEIGHT)
    const colors = Colors[colorScheme]

    const dismiss = (action?: () => void) => {
        translateY.value = withTiming(SCREEN_HEIGHT, { duration: 220 }, () => {
            runOnJS(onRequestClose)()
            if (action) runOnJS(action)()
        })
    }

    const gesture = Gesture.Pan()
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

    useEffect(() => {
        if (visible) {
            translateY.value = withTiming(0, { duration: 280 })
        }
    }, [visible])

    const sheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }))

    return (
        <Modal animationType="none" transparent visible={visible} onRequestClose={() => dismiss()}>
            <View style={{ flex: 1 }}>
                <Pressable
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)' }}
                    onPress={() => dismiss()}
                />
                <Animated.View
                    style={[
                        sheetStyle,
                        {
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: colors.background,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            paddingBottom: Math.max(insets.bottom, 16),
                        },
                    ]}
                >
                    <GestureDetector gesture={gesture}>
                        <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 12 }}>
                            <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border }} />
                        </View>
                    </GestureDetector>

                    <View>
                        {post.content.trim().length > 0 && (
                            <Pressable
                                className='flex-row items-center gap-3 px-6 border-b border-border dark:border-borderDark active:bg-surface dark:active:bg-surfaceDark'
                                style={{ minHeight: 58 }}
                                onPress={() => dismiss(onCopyText)}
                            >
                                <IconSymbol name='doc.on.doc' size={20} color={colors.foreground} />
                                <ThemedText className='text-lg font-sans-medium'>Copy Text</ThemedText>
                            </Pressable>
                        )}
                        {isOwnPost ? (
                            <>
                                <Pressable
                                    className='flex-row items-center gap-3 px-6 border-b border-border dark:border-borderDark active:bg-surface dark:active:bg-surfaceDark'
                                    style={{ minHeight: 58 }}
                                    onPress={() => dismiss(onEdit)}
                                >
                                    <IconSymbol name='pencil' size={20} color={colors.foreground} />
                                    <ThemedText className='text-lg font-sans-medium'>Edit Post</ThemedText>
                                </Pressable>
                                <Pressable
                                    className='flex-row items-center gap-3 px-6 border-b border-border dark:border-borderDark active:bg-surface dark:active:bg-surfaceDark'
                                    style={{ minHeight: 58 }}
                                    onPress={() => dismiss(onDelete)}
                                >
                                    <IconSymbol name='trash' size={20} color='#ef4444' />
                                    <ThemedText className='text-lg font-sans-medium text-red-500'>Delete Post</ThemedText>
                                </Pressable>
                            </>
                        ) : (
                            <Pressable
                                className='flex-row items-center gap-3 px-6 border-b border-border dark:border-borderDark active:bg-surface dark:active:bg-surfaceDark'
                                style={{ minHeight: 58 }}
                                onPress={() => dismiss(onReport)}
                            >
                                <IconSymbol name='flag' size={20} color='#ef4444' />
                                <ThemedText className='text-lg font-sans-medium text-red-500'>Report Post</ThemedText>
                            </Pressable>
                        )}
                    </View>
                </Animated.View>
            </View>
        </Modal>
    )
}

export default PostContextMenu
