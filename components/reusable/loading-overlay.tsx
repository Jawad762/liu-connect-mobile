import { Colors } from '@/constants/theme'
import { useColorScheme } from 'nativewind'
import React from 'react'
import { ActivityIndicator, Modal, View } from 'react-native'

const LoadingOverlay = ({ visible }: { visible: boolean }) => {
    const { colorScheme: colorScheme = "light" } = useColorScheme();
    return (
        <Modal visible={visible} onRequestClose={() => { }} animationType='fade' transparent>
            <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }} className='flex-1 items-center justify-center'>
                <ActivityIndicator size="large" color={Colors[colorScheme].accent} />
            </View>
        </Modal>
    )
}

export default LoadingOverlay