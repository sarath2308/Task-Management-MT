import z from "zod";

const bodySchema = z.object({
    email: z.string(),
    tempToken: z.string(),
})

export const SignupOtpResendSchema = z.object({
    body: bodySchema,
})