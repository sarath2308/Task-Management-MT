import { useMutation } from "@tanstack/react-query"
import { AUTH_API } from "../../api/auth.api"
import toast from "react-hot-toast"
import { AxiosError } from "axios"

export const useResendOtp = () =>
{
    return useMutation({
        mutationFn: AUTH_API.RESEND_OTP,
        onSuccess:()=>
        {
            toast.success("otp successfully sent")
        },
        onError:(err: unknown) =>
        {
            if(err instanceof AxiosError)
            {
                toast.error(err.response?.data.message || "otp not sent,try after sometimes")
            }
            else
            {
                toast.error("something went wrong,try after sometimes")
            }
        }

    })
}