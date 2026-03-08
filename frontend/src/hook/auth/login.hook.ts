import { useMutation } from "@tanstack/react-query"
import { AUTH_API } from "../../api/auth.api"
import toast from "react-hot-toast"
import { AxiosError } from "axios"

export const useLogin = () =>
{
    return useMutation({
        mutationFn: AUTH_API.LOGIN,
        onSuccess:()=>{
           toast.success("Authenticated")
        },
        onError:(err: unknown) =>
        {
            if(err instanceof AxiosError)
            {
                toast.error(err.response?.data.message || "Login failed, try after sometimes");
            }
            else{
                toast.error("something went wrong,try after sometimes");
            }
        }
    })
}