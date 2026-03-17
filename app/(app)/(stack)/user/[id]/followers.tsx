import GeneralHeader from "@/components/reusable/general-header";
import { ThemedView } from "@/components/reusable/themed-view";
import { useFollowers } from "@/hooks/useFollowers";
import UserListVertical from "@/components/users/UserListVertical";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function FollowersScreen() {
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams();
    const { followers, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isLoading, isFetching, error } = useFollowers({ id: id as string, size: 10 });

    return (
        <ThemedView className='flex-1' style={{ paddingTop: insets.top + 12 }}>
            <View className="p-4">
                <GeneralHeader title="Followers" />
            </View>
            <UserListVertical
                users={followers}
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
