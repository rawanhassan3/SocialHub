import { z } from "zod";

export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, { message: "Current password is required" }),
    password: z
        .string()
        .min(6, { message: "New password must be at least 6 characters" })
        .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, { message: "Minimum eight characters, at least one letter, one number and one special character" }),
    rePassword: z.string().min(1, { message: "Please confirm your new password" })
}).refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
});
