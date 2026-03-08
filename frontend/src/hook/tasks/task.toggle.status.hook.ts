import { useMutation } from "@tanstack/react-query"
import { TASK_API } from "../../api/task.api"
import toast from "react-hot-toast"
import { AxiosError } from "axios"

export const useToggleStatus = () =>
{
    return useMutation({
        mutationFn: TASK_API.TOGGLE_STATUS,
        onSuccess:()=>
        {
            toast.success("Status changed")
        },
        onError:(err: unknown) =>
        {
            if(err instanceof AxiosError)
            {
                toast.error(err.response?.data.message || "status not changed")
            }
            else{
                toast.error("Task Status changed")
            }
        }
    })
}