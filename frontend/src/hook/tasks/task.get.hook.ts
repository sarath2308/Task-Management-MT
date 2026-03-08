import { useQuery } from "@tanstack/react-query"
import { TASK_API } from "../../api/task.api"

export const useGetTasks = ()=>
{
    return useQuery({
        queryKey:["get-tasks"],
        queryFn: TASK_API.GET_ALL,
    })
}