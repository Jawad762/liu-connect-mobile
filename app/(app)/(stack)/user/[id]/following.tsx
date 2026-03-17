import GeneralHeader from "@/components/reusable/general-header";
import { ThemedView } from "@/components/reusable/themed-view";
import UserListVertical from "@/components/users/UserListVertical";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFollowing } from "@/hooks/useFollowing";

export default function FollowingScreen() {
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams();
    const { following, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isLoading, isFetching, error } = useFollowing({ id: id as string, size: 10 });

    return (
        <ThemedView className='flex-1' style={{ paddingTop: insets.top + 12 }}>
            <View className="p-4">
                <GeneralHeader title="Following" />
            </View>
            <UserListVertical
                users={following}
                isLoading={isLoading}
                isRefreshing={isFetching}
                error={error}
                refetch={refetch}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage}
                isFetchingNextPage={isFetchingNextPage}
            />
        </ThemedView>
    );
}
