import { Post } from '@/types/post.types'
import useAuthStore from '@/stores/auth.store'
import { useActionSheet } from '@expo/react-native-action-sheet'
import { useRef } from 'react'
import { Alert, findNodeHandle, Platform, Pressable, View } from 'react-native'
import { useColorScheme } from 'nativewind'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Colors } from '@/constants/theme'
import { IconSymbol } from '../reusable/icon-symbol'
import * as Haptics from 'expo-haptics'

type PostContextMenuProps = {
    post: Post
    onEdit?: () => void
    onDelete?: () => void
    onCopyText?: () => void
}

const PostContextMenu = ({ post, onEdit, onDelete, onCopyText }: PostContextMenuProps) => {
    const { colorScheme = 'light' } = useColorScheme()
    const { showActionSheetWithOptions } = useActionSheet()
    const insets = useSafeAreaInsets()
    const buttonRef = useRef<View>(null)
    const currentUserId = useAuthStore(state => state.user?.id)
    const isOwnPost = currentUserId === post.userId

    const open = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)

        const options = isOwnPost
            ? ['Copy Text', 'Edit Post', 'Delete Post', 'Cancel']
            : ['Copy Text', 'Cancel']

        const cancelButtonIndex = options.length - 1
        const destructiveButtonIndex = isOwnPost ? 2 : undefined

        const anchor =
            Platform.OS === 'ios' && buttonRef.current
                ? findNodeHandle(buttonRef.current) ?? undefined
                : undefined

        const theme = Colors[colorScheme]

        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
                destructiveButtonIndex,
                anchor,
                useModal: true,
                tintColor: theme.foreground,
                cancelButtonTintColor: theme.accent,
                destructiveColor: '#ff3b30',
                showSeparators: true,
                containerStyle: {
                    backgroundColor: theme.surface,
                    borderRadius: 16,
                    overflow: 'hidden',
                    paddingBottom: insets.bottom + 8,
                },
                separatorStyle: {
                    backgroundColor: theme.border,
                },
                textStyle: {
                    color: theme.foreground,
                    fontSize: 17,
                },
            },
            selectedIndex => {
                if (selectedIndex === undefined || selectedIndex === cancelButtonIndex) return

                switch (selectedIndex) {
                    case 0:
                        onCopyText?.()
                        break
                    case 1:
                        if (isOwnPost) {
                            onEdit?.()
                        }
                        break
                    case 2:
                        if (isOwnPost) {
                            Alert.alert(
                                'Delete Post',
                                'Are you sure you want to delete this post? This action cannot be undone.',
                                [
                                    { text: 'Cancel', style: 'cancel' },
                                    { text: 'Delete', style: 'destructive', onPress: onDelete },
                                ]
                            )
                        }
                        break
                }
            }
        )
    }

    const mutedColor = Colors[colorScheme].muted

    return (
        <Pressable ref={buttonRef} onPress={open} className="ml-auto p-1 -m-1" hitSlop={8}>
            <IconSymbol name="ellipsis" size={20} color={mutedColor} />
        </Pressable>
    )
}

export default PostContextMenu
