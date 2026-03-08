import { useMutation } from "@tanstack/react-query"
import { AUTH_API } from "../../api/auth.api"
import toast from "react-hot-toast"
import { AxiosError } from "axios"

export const useVerifyOtpAndSignup = ()=>
{
    return useMutation({
        mutationFn: AUTH_API.VERIFY_OTP_AND_SIGNUP,
        onSuccess:()=>
        {
            toast.success("Authenticated")
        },
        onError:(err: unknown)=>
        {
            if(err instanceof AxiosError)
            {
                toast.error(err.response?.data.message || "Not verified try after sometimes")
            }
            else
            {
                toast.error("Something went wrong, try after sometimes")
            }
        }
    
    })
}