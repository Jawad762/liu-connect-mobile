import React, { useState } from 'react'
import { Alert, ScrollView, useWindowDimensions, View } from 'react-native'
import { ThemedView } from '@/components/reusable/themed-view'
import { ThemedText } from '@/components/reusable/themed-text'
import { Button, GradientButton } from '../reusable/button'
import useSuggestedCommunities from '@/hooks/useSuggestedCommunities'
import { communityService } from '@/services/community.service'
import { router } from 'expo-router'
import { screens } from '@/utils/screens.utils'
import ErrorState from '../reusable/error-state'
import LoadingOverlay from '../reusable/loading-overlay'
import ProfileIcon from '../reusable/profile-icon'
import { useColorScheme } from 'nativewind'
import { Colors } from '@/constants/theme'

const SuggestedCommunities = ({
    courseCodes,
    onBack,
}: {
    courseCodes: string[]
    onBack: () => void
}) => {
    const { communities, isLoading, error, refetch, isFetching } = useSuggestedCommunities(courseCodes)
    const [communitiesToJoin, setCommunitiesToJoin] = useState<string[]>([])
    const [isFinishing, setIsFinishing] = useState(false)
    const { width } = useWindowDimensions()
    const { colorScheme = 'light' } = useColorScheme()
    const hasCourseCodes = courseCodes.length > 0

    const toggleCommunity = (id: string) => {
        setCommunitiesToJoin(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        )
    }

    const handleFinish = async () => {
        try {
            setIsFinishing(true)
            if (communitiesToJoin.length > 0) {
                const result = await communityService.joinMultipleCommunities(communitiesToJoin)
                if (!result.success) throw new Error(result.message)
            }
            router.replace(screens.home)
        } catch (error) {
            Alert.alert('Error', error instanceof Error ? error.message : 'Failed to join communities')
        } finally {
            setIsFinishing(false)
        }
    }

    if (error && hasCourseCodes) {
        return (
            <View style={{ width, flex: 1 }}>
                <ErrorState message={error.message} onRetry={refetch} />
            </View>
        )
    }

    return (
        <ThemedView className="flex-1" style={{ width }}>
            <View className="flex-row items-center px-5 pb-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onPress={onBack}
                    className="min-w-20"
                    textClassName="text-sm"
                >
                    ← Back
                </Button>
            </View>

            <View className="px-5 mb-4">
                <ThemedText className="text-2xl font-sans-bold mb-1">
                    Join Communities
                </ThemedText>
                <ThemedText
                    className="text-sm"
                    style={{ lineHeight: 20, color: Colors[colorScheme].muted }}
                >
                    {communities.length > 0
                        ? `We found ${communities.length} ${communities.length === 1 ? 'community' : 'communities'} based on your courses. Select the ones you want to join.`
                        : hasCourseCodes
                            ? 'Discover communities to connect with other students on campus.'
                            : 'You skipped schedule upload, so we could not suggest communities from courses. You can still explore and join communities now.'}
                </ThemedText>
            </View>

            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 12, gap: 10 }}
                showsVerticalScrollIndicator={false}
            >
                {communities.length === 0 ? (
                    <View
                        style={{
                            backgroundColor: Colors[colorScheme].surface,
                            borderRadius: 14,
                            padding: 16,
                        }}
                    >
                        <ThemedText className="text-base font-sans-semibold mb-1.5">
                            No matching communities yet
                        </ThemedText>
                        <ThemedText
                            className="text-sm"
                            style={{ lineHeight: 20, color: Colors[colorScheme].muted }}
                        >
                            {hasCourseCodes
                                ? 'We could not find communities based on your uploaded courses right now. You can continue and discover more communities later.'
                                : 'We will suggest communities once your courses are available. You can continue and discover communities manually for now.'}
                        </ThemedText>
                    </View>
                ) : null}
                {communities.map(community => {
                    const isSelected = communitiesToJoin.includes(community.id)
                    return (
                        <View
                            key={community.id}
                            className="flex-row items-center"
                            style={{
                                backgroundColor: Colors[colorScheme].surface,
                                borderRadius: 14,
                                padding: 12,
                                gap: 12,
                            }}
                        >
                            <ProfileIcon
                                avatarUrl={community.avatar_url}
                                className="w-12 h-12 rounded-full"
                            />
                            <View className="flex-1">
                                <ThemedText
                                    className="text-base font-sans-semibold"
                                    numberOfLines={1}
                                >
                                    {community.name}
                                </ThemedText>
                                {community.description ? (
                                    <ThemedText
                                        className="text-xs mt-0.5"
                                        numberOfLines={1}
                                        style={{ color: Colors[colorScheme].muted }}
                                    >
                                        {community.description}
                                    </ThemedText>
                                ) : null}
                            </View>
                            <Button
                                variant={isSelected ? 'primary' : 'outline'}
                                size="sm"
                                onPress={() => toggleCommunity(community.id)}
                                className="min-w-[68px] mb-0"
                                textClassName="text-xs"
                            >
                                {isSelected ? 'Joined ✓' : 'Join'}
                            </Button>
                        </View>
                    )
                })}
            </ScrollView>

            <View className="px-5 pt-2 pb-4">
                <GradientButton
                    size="lg"
                    onPress={handleFinish}
                    disabled={isLoading || isFetching || isFinishing}
                    loading={isFinishing}
                    fullWidth
                    textClassName="text-white"
                >
                    {communitiesToJoin.length > 0
                        ? `Join ${communitiesToJoin.length} & Get Started`
                        : 'Get Started'}
                </GradientButton>
            </View>

            <LoadingOverlay visible={isLoading || isFetching} />
        </ThemedView>
    )
}

export default SuggestedCommunities
