import { z } from "zod";

export const loginZodSchema = z.object({
    email : z.email("Invalid email address"),
    password : z.string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters long")
})

export type ILoginPayload = z.infer<typeof loginZodSchema>;

export const registerZodSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^\d+$/, "Phone number must contain only digits").length(11, "Phone number must be exactly 11 digits").or(z.literal("")),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    image: z.string().url("Must be a valid image URL").or(z.literal("")),
});

export type IRegisterPayload = z.infer<typeof registerZodSchema>;