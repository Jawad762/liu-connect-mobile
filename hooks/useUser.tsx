import { userService } from "@/services/user.service"
import { userKeys } from "@/utils/query-keys"
import { useQuery } from "@tanstack/react-query"

export const useUser = ({ id }: { id: string }) => {
    const { data, isLoading, error, refetch, isFetching } = useQuery({
        queryKey: userKeys.detail(id),
        queryFn: () => userService.getUserById(id),
    })
    return { user: data?.data, isLoading, error, refetch, isFetching }
}