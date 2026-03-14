import { View } from 'react-native'
import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { ThemedView } from '@/components/reusable/themed-view'
import { ThemedText } from '@/components/reusable/themed-text'
import { Button } from '@/components/reusable/button'
import { useColorScheme } from 'nativewind'
import { Colors } from '@/constants/theme'

const RateLimitedScreen = () => {
    const insets = useSafeAreaInsets()
    const { colorScheme = 'light' } = useColorScheme()

    return (
        <ThemedView
            className='flex-1 items-center justify-center px-8'
            style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
        >
            <View className='items-center gap-4 w-full'>
                <View className='bg-surface dark:bg-surfaceDark rounded-full p-6 mb-2'>
                    <Ionicons
                        name='time-outline'
                        size={52}
                        color={Colors[colorScheme].accent}
                    />
                </View>

                <ThemedText className='text-2xl font-sans-bold text-center'>
                    Slow down a bit
                </ThemedText>

                <ThemedText className='text-base text-center text-muted dark:text-mutedDark leading-6'>
                    You're making requests too quickly. Please wait a moment before trying again.
                </ThemedText>
            </View>

            <View className='w-full mt-12 gap-3'>
                <Button
                    variant='primary'
                    size='lg'
                    fullWidth
                    onPress={() => router.dismissAll()}
                >
                    Try Again
                </Button>
            </View>
        </ThemedView>
    )
}

export default RateLimitedScreen
