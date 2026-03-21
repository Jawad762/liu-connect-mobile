import { ApiResponse } from "@/types/api.types";
import { Notification } from "@/types/notification.types";
import { apiClient } from "@/utils/api-client.utils";

export const notificationService = {
    getNotifications: async ({ page, size }: { page: number, size: number }): Promise<ApiResponse<Notification[]>> => {
        const response = await apiClient.get('/notifications', { params: { page, size } });
        return response.data;
    },
    readAllNotifications: async (): Promise<ApiResponse<undefined>> => {
        const response = await apiClient.post('/notifications/read-all');
        return response.data;
    }
}