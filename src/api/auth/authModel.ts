import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type User = z.infer<typeof AuthSchema>;
export const AuthSchema = z.object({
    id: z.number(),
    email: z.string().email(),
    password: z.string(),
    username: z.string(),
    reset_token: z.string().nullable().optional(),
    reset_token_expiry: z
        .union([z.number().int(), z.null()])
        .optional(),
    role: z.enum(["user", "admin"]).default("user"),
    google_id: z.string().nullable().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

// Input Validation for 'GET users/:id' endpoint
export const GetUserSchema = z.object({
    params: z.object({ id: commonValidations.id }),
});

