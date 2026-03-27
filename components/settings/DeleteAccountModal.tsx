import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    TextInput,
    View,
} from 'react-native'
import { ThemedText } from '@/components/reusable/themed-text'
import { Button, GradientButton } from '@/components/reusable/button'
import { Colors } from '@/constants/theme'
import { useColorScheme } from 'nativewind'
import { userService } from '@/services/user.service'
import useAuthStore from '@/stores/auth.store'
import { router } from 'expo-router'
import { screens } from '@/utils/screens'
import { PASSWORD_MAX_LENGTH } from '@/constants/general'
import { resetPushTokenSyncCache } from '@/hooks/usePushNotifications'

const DeleteAccountModal = ({
    visible,
    onRequestClose,
}: {
    visible: boolean
    onRequestClose: () => void
}) => {
    const { colorScheme = 'light' } = useColorScheme()
    const insets = useSafeAreaInsets()
    const logout = useAuthStore((state) => state.logout)
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!visible) {
            setPassword('')
        }
    }, [visible])

    const handleDeleteAccount = async () => {
        if (!password) {
            Alert.alert('Missing password', 'Please enter your password to confirm account deletion.')
            return
        }
        try {
            setLoading(true)
            const result = await userService.deleteAccount(password)
            if (!result.success) throw new Error(result.message)
            onRequestClose()
            resetPushTokenSyncCache()
            logout()
            router.replace(screens.auth.welcome)
            Alert.alert('Account deleted', 'Your account has been permanently deleted.')
        } catch (error) {
            Alert.alert(
                'Oops!',
                error instanceof Error ? error.message : 'An error occurred while deleting your account.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            visible={visible}
            onRequestClose={onRequestClose}
            animationType="slide"
            backdropColor={Colors[colorScheme].background}
        >
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{
                    paddingLeft: insets.left,
                    paddingRight: insets.right,
                    paddingTop: Platform.select({ ios: insets.top, android: insets.top + 12, default: insets.top }),
                }}
            >
                <View className="flex-row items-center justify-between px-4 pb-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onPress={onRequestClose}
                        disabled={loading}
                        className="min-w-20"
                        textClassName="text-sm"
                    >
                        Cancel
                    </Button>
                    <ThemedText style={{ marginTop: -6 }} className="text-xl font-sans-bold">
                        Delete Account
                    </ThemedText>
                    <GradientButton
                        size="sm"
                        onPress={handleDeleteAccount}
                        loading={loading}
                        disabled={loading || !password}
                        className="min-w-20"
                        textClassName="text-sm text-white"
                    >
                        Delete
                    </GradientButton>
                </View>

                <ScrollView
                    className="px-4 pt-2"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <ThemedText className="text-base text-muted dark:text-mutedDark mb-4">
                        This action cannot be undone. All your data, posts, and associations will be permanently removed.
                        Enter your password to confirm.
                    </ThemedText>
                    <View
                        className="flex-row border-b border-border dark:border-borderDark items-center"
                        style={{ gap: 12, paddingVertical: 14 }}
                    >
                        <ThemedText className="text-base font-sans-medium" style={{ width: 120 }}>
                            Password
                        </ThemedText>
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter your password"
                            secureTextEntry
                            maxLength={PASSWORD_MAX_LENGTH}
                            autoCapitalize="none"
                            autoCorrect={false}
                            autoComplete="password"
                            placeholderTextColor={Colors[colorScheme].muted}
                            style={{ flex: 1, paddingVertical: 0, fontSize: 16 }}
                            className="text-foreground dark:text-foregroundDark"
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    )
}

export default DeleteAccountModal
