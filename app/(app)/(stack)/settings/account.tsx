import React, { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    TextInput,
    View,
} from 'react-native'
import { ThemedView } from '@/components/reusable/themed-view'
import { ThemedText } from '@/components/reusable/themed-text'
import GeneralHeader from '@/components/reusable/general-header'
import { Button, GradientButton } from '@/components/reusable/button'
import { IconSymbol } from '@/components/reusable/icon-symbol'
import { Colors } from '@/constants/theme'
import { useColorScheme } from 'nativewind'
import { authService } from '@/services/auth.service'
import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from '@/constants/general'

const ChangePasswordModal = ({
    visible,
    onRequestClose,
}: {
    visible: boolean
    onRequestClose: () => void
}) => {
    const { colorScheme = 'light' } = useColorScheme()
    const insets = useSafeAreaInsets()
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!visible) {
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        }
    }, [visible])

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Missing fields', 'Please fill in all fields.')
            return
        }
        if (newPassword.length < MIN_PASSWORD_LENGTH) {
            Alert.alert('Invalid password', `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`)
            return
        }
        if (newPassword.length > MAX_PASSWORD_LENGTH) {
            Alert.alert('Invalid password', `Password must be at most ${MAX_PASSWORD_LENGTH} characters.`)
            return
        }
        if (newPassword !== confirmPassword) {
            Alert.alert('Passwords do not match', 'New password and confirmation must match.')
            return
        }
        if (currentPassword === newPassword) {
            Alert.alert('Same password', 'New password must be different from your current password.')
            return
        }
        try {
            setLoading(true)
            const result = await authService.changePassword(currentPassword, newPassword)
            if (!result.success) throw new Error(result.message)
            onRequestClose()
            Alert.alert('Success', 'Your password has been changed.')
        } catch (error) {
            Alert.alert(
                'Oops!',
                error instanceof Error ? error.message : 'An error occurred while changing your password.'
            )
        } finally {
            setLoading(false)
        }
    }

    const inputRow = (
        label: string,
        value: string,
        onChange: (v: string) => void,
        placeholder: string,
        secure?: boolean,
        autoComplete?: 'password' | 'new-password'
    ) => (
        <View
            className="flex-row border-b border-border dark:border-borderDark items-center"
            style={{ gap: 12, paddingVertical: 14 }}
        >
            <ThemedText className="text-base font-sans-medium" style={{ width: 120 }}>
                {label}
            </ThemedText>
            <TextInput
                value={value}
                onChangeText={onChange}
                placeholder={placeholder}
                secureTextEntry={secure}
                maxLength={MAX_PASSWORD_LENGTH}
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete={autoComplete}
                textContentType={secure ? (autoComplete === 'new-password' ? 'newPassword' : 'password') : undefined}
                placeholderTextColor={Colors[colorScheme].muted}
                style={{ flex: 1, paddingVertical: 0, fontSize: 16 }}
                className="text-foreground dark:text-foregroundDark"
            />
        </View>
    )

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
                        Change Password
                    </ThemedText>
                    <GradientButton
                        size="sm"
                        onPress={handleChangePassword}
                        loading={loading}
                        disabled={loading}
                        className="min-w-20"
                        textClassName="text-sm text-white"
                    >
                        Save
                    </GradientButton>
                </View>

                <ScrollView
                    className="px-4 pt-2"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {inputRow('Current', currentPassword, setCurrentPassword, 'Current password', true, 'password')}
                    {inputRow('New password', newPassword, setNewPassword, 'New password', true, 'new-password')}
                    {inputRow('Confirm new', confirmPassword, setConfirmPassword, 'Confirm new password', true, 'new-password')}
                    <ThemedText className="text-sm text-muted dark:text-mutedDark mt-3">
                        Password must be {MIN_PASSWORD_LENGTH}–{MAX_PASSWORD_LENGTH} characters.
                    </ThemedText>
                </ScrollView>
            </KeyboardAvoidingView>
        </Modal>
    )
}

const Account = () => {
    const insets = useSafeAreaInsets()
    const { colorScheme = 'light' } = useColorScheme()
    const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false)

    return (
        <ThemedView className="flex-1" style={{ paddingTop: insets.top + 12 }}>
            <View className="p-4 border-b border-border dark:border-borderDark">
                <GeneralHeader title="Settings > Account" />
            </View>

            <Pressable
                onPress={() => setChangePasswordModalVisible(true)}
                className="p-4 flex-row justify-between items-center border-b border-border dark:border-borderDark active:bg-muted/20 active:dark:bg-mutedDark/20"
            >
                <View className="flex-1 mr-4">
                    <ThemedText className="text-xl font-sans-medium">Change password</ThemedText>
                    <ThemedText className="text-base text-muted dark:text-mutedDark mt-1">
                        Update your password to keep your account secure
                    </ThemedText>
                </View>
                <IconSymbol name="chevron.right" size={24} color={Colors[colorScheme].muted} />
            </Pressable>

            <ChangePasswordModal
                visible={changePasswordModalVisible}
                onRequestClose={() => setChangePasswordModalVisible(false)}
            />
        </ThemedView>
    )
}

export default Account
