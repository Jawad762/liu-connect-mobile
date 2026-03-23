import React, { useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { View } from 'react-native'
import { ThemedView } from '@/components/reusable/themed-view'
import GeneralHeader from '@/components/reusable/general-header'
import AccountSettingRow from '@/components/settings/AccountSettingRow'
import ChangePasswordModal from '@/components/settings/ChangePasswordModal'
import DeleteAccountModal from '@/components/settings/DeleteAccountModal'

const Account = () => {
    const insets = useSafeAreaInsets()
    const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false)
    const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false)

    return (
        <ThemedView className="flex-1" style={{ paddingTop: insets.top + 12 }}>
            <View className="p-4 border-b border-border dark:border-borderDark">
                <GeneralHeader title="Settings > Account" />
            </View>

            <AccountSettingRow
                title="Change password"
                subtitle="Update your password to keep your account secure"
                onPress={() => setChangePasswordModalVisible(true)}
            />
            <AccountSettingRow
                title="Delete account"
                subtitle="Permanently delete your account and all associated data"
                onPress={() => setDeleteAccountModalVisible(true)}
            />

            <ChangePasswordModal
                visible={changePasswordModalVisible}
                onRequestClose={() => setChangePasswordModalVisible(false)}
            />
            <DeleteAccountModal
                visible={deleteAccountModalVisible}
                onRequestClose={() => setDeleteAccountModalVisible(false)}
            />
        </ThemedView>
    )
}

export default Account
