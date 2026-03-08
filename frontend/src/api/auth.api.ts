import api from "./api";

export const AUTH_API = {
    REQ_SIGNUP:(payload:{name: string, email: string, password: string}) => api.post("/auth/req-signup",payload).then((res)=>res.data),
    VERIFY_OTP_AND_SIGNUP:(payload:{otp: string,email: string}) => api.post("/auth/verify-otp",payload).then((res)=>res.data),
    RESEND_OTP:(payload:{email: string,tempToken: string})=>api.post("/auth/resend-otp",payload).then((res)=>res.data),
    LOGIN:(payload:{email: string,password: string}) => api.post("/auth/login",payload).then((res)=>res.data),
    GET_USER:()=> api.get("/auth/me").then((res)=>res.data),

}