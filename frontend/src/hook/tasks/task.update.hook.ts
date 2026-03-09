import { useMutation } from "@tanstack/react-query"
import { TASK_API } from "../../api/task.api"
import toast from "react-hot-toast"
import { AxiosError } from "axios"

type UpdateTaskPayload = {
  title?: string;
  description?: string;
};

export const useUpdateTask = ()=>
{
    return useMutation({
     mutationFn: ({ taskId, payload }: { taskId: string; payload: UpdateTaskPayload }) =>
       TASK_API.UPDATE(taskId, payload),
        onError:(err: unknown)=>
        {
            if(err instanceof AxiosError)
            {
                toast.error(err.response?.data.message || "Task Not Updated")
            }
            else{
                toast.error("Something went wrong,try after sometimes")
            }
        }
    })
}