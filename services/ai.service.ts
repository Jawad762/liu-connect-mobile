import { ApiResponse } from "@/types/api.types"
import { AnalyzeScheduleResponse } from "@/types/ai.types"
import { apiClient } from "@/utils/api-client.utils"

export const aiService = {
    uploadSchedule: async (scheduleUrl: string): Promise<ApiResponse<AnalyzeScheduleResponse>> => {
        const response = await apiClient.post('/ai/analyze-schedule', { scheduleUrl })
        return response.data
    },
}