import React, { useEffect, type ComponentProps } from 'react'
import { Modal, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native'
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { useColorScheme } from 'nativewind'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { Colors } from '@/constants/theme-colors'
import { ThemedText } from './themed-text'

export type ActionSheetIconName = ComponentProps<typeof MaterialCommunityIcons>['name']

export interface ActionSheetItem {
    label: string
    icon: ActionSheetIconName
    color?: string
    onPress: () => void
}

interface ActionSheetProps {
    visible: boolean
    onClose: () => void
    actions: ActionSheetItem[]
}

const ActionSheet = ({ visible, onClose, actions }: ActionSheetProps) => {
    const { colorScheme = 'light' } = useColorScheme()
    const insets = useSafeAreaInsets()
    const { height: SLIDE_DISTANCE } = useWindowDimensions()
    const colors = Colors[colorScheme]
    const translateY = useSharedValue(SLIDE_DISTANCE)

    const dismiss = (action?: () => void) => {
        translateY.value = withTiming(SLIDE_DISTANCE, { duration: 220 }, () => {
            runOnJS(onClose)()
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
                translateY.value = withTiming(SLIDE_DISTANCE, { duration: 220 }, () => {
                    runOnJS(onClose)()
                })
            } else {
                translateY.value = withTiming(0, { duration: 200 })
            }
        })

    useEffect(() => {
        if (visible) {
            translateY.value = withTiming(0, { duration: 200 })
        }
    }, [visible])

    const sheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }))

    return (
        <Modal animationType="none" transparent visible={visible} onRequestClose={() => dismiss()}>
            <View style={{ flex: 1 }}>
                <Pressable
                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
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
                            borderTopLeftRadius: 24,
                            borderTopRightRadius: 24,
                            paddingBottom: Math.max(insets.bottom, 16),
                        },
                    ]}
                >
                    <GestureDetector gesture={gesture}>
                        <View style={{ alignItems: 'center', paddingTop: 14, paddingBottom: 8 }}>
                            <View style={{ width: 44, height: 5, borderRadius: 3, backgroundColor: colors.border }} />
                        </View>
                    </GestureDetector>

                    {actions.map((action, index) => (
                        <Pressable
                            key={index}
                            onPress={() => dismiss(action.onPress)}
                            style={[
                                { minHeight: 60 },
                                index < actions.length - 1 && {
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                    borderBottomColor: colors.border,
                                },
                            ]}
                            className="flex-row items-center gap-4 px-6 active:bg-surface dark:active:bg-surfaceDark"
                        >
                            <View
                                style={{
                                    width: 40, height: 40, borderRadius: 20,
                                    alignItems: 'center', justifyContent: 'center',
                                    backgroundColor: action.color ? `${action.color}18` : `${colors.foreground}12`,
                                }}
                            >
                                <MaterialCommunityIcons name={action.icon} size={20} color={action.color ?? colors.foreground} />
                            </View>
                            <ThemedText
                                style={action.color ? { color: action.color } : undefined}
                                className="text-lg font-sans-medium"
                            >
                                {action.label}
                            </ThemedText>
                        </Pressable>
                    ))}
                </Animated.View>
            </View>
        </Modal>
    )
}

export default ActionSheet
