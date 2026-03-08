import { useMutation } from "@tanstack/react-query"
import { TASK_API } from "../../api/task.api"
import toast from "react-hot-toast"
import { AxiosError } from "axios"

export const useRemoveTask = ()=>
{
    return useMutation({
        mutationFn: TASK_API.REMOVE,
        onSuccess:()=>
        {
            toast.success("Task Removed")
        },
        onError:(err: unknown)=>
        {
            if(err instanceof AxiosError)
            {
                toast.error(err.response?.data.message || "Task not removed")
            }
            else{
                toast.error("something went wrong,try after sometimes")
            }
        }
    })
}