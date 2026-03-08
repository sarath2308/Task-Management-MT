import { useQuery } from "@tanstack/react-query"
import { TASK_API } from "../../api/task.api"

export const useGetStatistics = () =>
{
    return useQuery({
        queryKey:["get-task-statistics"],
        queryFn: TASK_API.GET_STATISTICS,
    })
}