import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Car = z.infer<typeof CarSchema>;
export const CarSchema = z.object({
    id: z.number().int().optional(), // id là trường tự động tăng, có thể không có khi tạo mới
    name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
    description: z.string().max(65535, 'Description must be less than 65535 characters').optional(),
    license_plate: z.string().min(1, 'License plate is required').max(20, 'License plate must be less than 20 characters'),
    capacity: z.number().int().min(1, 'Capacity must be greater than 0'),
    company_id: z.number().int().min(1, 'Company ID must be greater than 0'),
    created_at: z.date(),
    updated_at: z.date(),
});

// Input Validation for 'GET users/:id' endpoint
export const GetCarSchema = z.object({
    params: z.object({ id: commonValidations.id }),
});
