import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type BusReview  = z.infer<typeof BusReviewSchema>;
export const BusReviewSchema = z.object({
    id: z.number(),
    bus_id: z.number(),
    user_id: z.number().int(),
    rating: z.number().int().min(1).max(5),
    review: z.string(),
    created_at: z.coerce.date(),  
    updated_at: z.coerce.date(),

});
export const CreateBusReviewSchema = z.object({
    body: z.object({
        bus_id: z.number(),
        user_id: z.number().int(),
        rating: z.number().int().min(1).max(5),
        review: z.string(),

    }),
});
export const PaginatedBusReviewResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  responseObject: z.object({
    results: z.array(BusReviewSchema),
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
  
});


// Input Validation for 'GET users/:id' endpoint
export const GetBusReviewSchema = z.object({
    params: z.object({ id: commonValidations.id }),
});
