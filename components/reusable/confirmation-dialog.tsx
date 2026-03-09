import React, { useEffect } from 'react'
import { Modal, useWindowDimensions, View } from 'react-native'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Button, GradientButton } from './button'
import { ThemedText } from './themed-text'
import { Colors } from '@/constants/theme'
import { useColorScheme } from 'nativewind'

const ConfirmationDialog = ({
  visible,
  onRequestClose,
  title,
  message,
  onConfirm,
  onCancel,
  loading = false,
}: {
  visible: boolean
  onRequestClose: () => void
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}) => {
  const { width } = useWindowDimensions()
  const { colorScheme = 'light' } = useColorScheme()
  const progress = useSharedValue(0)

  useEffect(() => {
    progress.value = withTiming(loading ? 1 : 0, { duration: 300 })
  }, [loading])

  const cancelStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
    flex: 1 - progress.value,
    overflow: 'hidden' as const,
    width: interpolate(progress.value, [0, 1], [width * 0.45, 0]),
  }))

  return (
    <Modal
      visible={visible}
      onRequestClose={loading ? () => {} : onRequestClose}
      animationType="fade"
      transparent
    >
      <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }} className="flex-row flex-1 items-center justify-center">
        <View
          style={{ width: width * 0.95, borderRadius: 12, backgroundColor: Colors[colorScheme].background }}
          className="p-4 border border-border dark:border-borderDark shadow-lg shadow-black/50"
        >
          <ThemedText className="font-sans-bold text-2xl mb-2">{title}</ThemedText>
          <ThemedText className="font-sans text-base mb-4">{message}</ThemedText>
          <View className="flex-row gap-2">
            <Animated.View style={cancelStyle}>
              <Button variant="outline" size="md" onPress={onCancel} disabled={loading}>
                Cancel
              </Button>
            </Animated.View>
            <View className="flex-1">
              <GradientButton size="md" onPress={onConfirm} loading={loading} disabled={loading} fullWidth>
                Yes
              </GradientButton>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default ConfirmationDialog
