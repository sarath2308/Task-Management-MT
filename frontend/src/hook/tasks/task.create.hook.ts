import { useMutation } from "@tanstack/react-query"
import { TASK_API } from "../../api/task.api"
import toast from "react-hot-toast"
import { AxiosError } from "axios"

export const useCreateTask = () =>
{
    return useMutation({
        mutationFn:TASK_API.CREATE,
        onError:(err: unknown) =>
        {
            if(err instanceof AxiosError)
            {
                toast.error(err.response?.data.message || "Task Not Added")
            }
            else
            {
                toast.error("Something went wrong, Please try after sometimes")
            }
        }
    })
}