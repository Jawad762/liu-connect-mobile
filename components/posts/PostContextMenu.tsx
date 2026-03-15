import { Post } from '@/types/post.types'
import useAuthStore from '@/stores/auth.store'
import { useRef, useState } from 'react'
import { Alert, Animated, Modal, Pressable, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useColorScheme } from 'nativewind'
import { Colors } from '@/constants/theme'
import { IconSymbol } from '../reusable/icon-symbol'
import { cn } from '@/utils/cn.utils'
import * as Haptics from 'expo-haptics'

type MenuItem = {
    label: string
    icon: string
    destructive?: boolean
    onPress: () => void
}

type PostContextMenuProps = {
    post: Post
    onEdit?: () => void
    onDelete?: () => void
    onCopyText?: () => void
}

const DESTRUCTIVE_COLOR = '#ff3b30'

const PostContextMenu = ({ post, onEdit, onDelete, onCopyText }: PostContextMenuProps) => {
    const { colorScheme = 'light' } = useColorScheme()
    const insets = useSafeAreaInsets()
    const currentUserId = useAuthStore(state => state.user?.id)
    const isOwnPost = currentUserId === post.userId

    const [visible, setVisible] = useState(false)
    const slideAnim = useRef(new Animated.Value(400)).current
    const fadeAnim = useRef(new Animated.Value(0)).current

    const open = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        setVisible(true)
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }),
            Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, bounciness: 3, speed: 14 }),
        ]).start()
    }

    const close = (callback?: () => void) => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 400, duration: 180, useNativeDriver: true }),
        ]).start(() => {
            setVisible(false)
            slideAnim.setValue(400)
            callback?.()
        })
    }

    const handleDelete = () => {
        close(() => {
            Alert.alert(
                'Delete Post',
                'Are you sure you want to delete this post? This action cannot be undone.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: onDelete },
                ]
            )
        })
    }

    const ownItems: MenuItem[] = [
        { label: 'Edit Post', icon: 'pencil', onPress: () => close(onEdit) },
        { label: 'Delete Post', icon: 'trash', destructive: true, onPress: handleDelete },
    ]
    const otherItems: MenuItem[] = [
        { label: 'Copy Text', icon: 'doc.on.doc', onPress: () => close(onCopyText) },
    ]
    const items = isOwnPost ? [...otherItems, ...ownItems] : otherItems
    const mutedColor = Colors[colorScheme].muted

    return (
        <>
            <Pressable onPress={open} className="ml-auto p-1 -m-1" hitSlop={8}>
                <IconSymbol name="ellipsis" size={20} color={mutedColor} />
            </Pressable>

            <Modal
                visible={visible}
                transparent
                animationType="none"
                statusBarTranslucent
                onRequestClose={() => close()}
            >
                <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim }]}>
                    <Pressable onPress={() => close()} className="flex-1 bg-black/50" />

                    <Animated.View
                        style={{
                            transform: [{ translateY: slideAnim }],
                            paddingBottom: insets.bottom + 8,
                            gap: 10,
                        }}
                    >
                        <View className="rounded-2xl overflow-hidden bg-white dark:bg-surfaceDark">
                            {items.map((item, index) => (
                                <View key={item.label}>
                                    {index > 0 && (
                                        <View className="h-px ml-14 bg-border dark:bg-borderDark" />
                                    )}
                                    <Pressable
                                        onPress={item.onPress}
                                        className={cn(
                                            'flex-row items-center px-5 py-4 gap-3.5',
                                            'active:bg-black/5 dark:active:bg-white/5'
                                        )}
                                    >
                                        <IconSymbol
                                            name={item.icon as any}
                                            size={21}
                                            color={item.destructive ? DESTRUCTIVE_COLOR : mutedColor}
                                        />
                                        <Text
                                            className={cn(
                                                'text-[17px] font-sans',
                                                item.destructive
                                                    ? 'text-red-500'
                                                    : 'text-foreground dark:text-foregroundDark'
                                            )}
                                        >
                                            {item.label}
                                        </Text>
                                    </Pressable>
                                </View>
                            ))}
                        </View>
                    </Animated.View>
                </Animated.View>
            </Modal>
        </>
    )
}

export default PostContextMenu
