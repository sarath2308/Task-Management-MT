import z from "zod";

const bodySchema = z.object({
    email: z.string(),
    otp: z.string(),
})

export const VerifyAndSignupSchema = z.object({
    body: bodySchema,
})