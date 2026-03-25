import React, { useRef, useState } from 'react'
import { ScrollView, useWindowDimensions, View } from 'react-native'
import { AnalyzeScheduleResponse } from '@/types/ai.types'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ThemedView } from '@/components/reusable/themed-view'
import { ThemedText } from '@/components/reusable/themed-text'
import Profile from '@/components/onboarding/Profile'
import Schedule from '@/components/onboarding/Schedule'
import SuggestedCommunities from '@/components/onboarding/SuggestedCommunities'
import useAuthStore from '@/stores/auth.store'
import { Redirect } from 'expo-router'
import { screens } from '@/utils/screens'
import { useColorScheme } from 'nativewind'
import { Colors } from '@/constants/theme'

const STEPS = ['Schedule', 'Profile', 'Communities']

const Onboarding = () => {
    const [aiResponse, setAiResponse] = useState<AnalyzeScheduleResponse | null>(null)
    const [activeStep, setActiveStep] = useState(0)
    const { user } = useAuthStore()
    const insets = useSafeAreaInsets()
    const { width } = useWindowDimensions()
    const scrollViewRef = useRef<ScrollView | null>(null)
    const { colorScheme = 'light' } = useColorScheme()

    if (!user) return <Redirect href={screens.auth.login} />

    const goToStep = (step: number) => {
        setActiveStep(step)
        scrollViewRef.current?.scrollTo({ x: step * width, y: 0, animated: true })
    }

    return (
        <ThemedView className="flex-1" style={{ paddingTop: insets.top }}>
            <View className="px-5 pt-3 pb-4">
                <View className="flex-row items-center" style={{ gap: 6 }}>
                    {STEPS.map((_, index) => (
                        <View
                            key={index}
                            className="h-1 rounded-full flex-1"
                            style={{
                                backgroundColor:
                                    index <= activeStep
                                        ? Colors[colorScheme].accent
                                        : Colors[colorScheme].border,
                            }}
                        />
                    ))}
                </View>
                <ThemedText
                    className="text-xs mt-2 font-sans-medium"
                    style={{ color: Colors[colorScheme].muted }}
                >
                    Step {activeStep + 1} of {STEPS.length} — {STEPS[activeStep]}
                </ThemedText>
            </View>

            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                decelerationRate="fast"
                bounces={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <Schedule
                    setAiResponse={setAiResponse}
                    onNext={() => goToStep(1)}
                />
                <Profile
                    user={user}
                    aiResponse={aiResponse}
                    onNext={() => goToStep(2)}
                    onBack={() => goToStep(0)}
                />
                <SuggestedCommunities
                    courseCodes={aiResponse?.courses ?? []}
                    onBack={() => goToStep(1)}
                />
            </ScrollView>
        </ThemedView>
    )
}

export default Onboarding
