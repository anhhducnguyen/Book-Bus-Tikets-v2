import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

// Schema chính cho bảng BUS_REVIEWS
export const BusReviewSchema = z.object({
  id: z.number(),
  bus_id: z.number(),
  user_id: z.number(),
  rating: z.number().int().min(1).max(5),
  review: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export type BusReview = z.infer<typeof BusReviewSchema>;

// Schema cho tạo mới đánh giá
export const CreateBusReviewSchema = z.object({
  body: z.object({
    bus_id: z.number(),
    user_id: z.number(),
    rating: z.number().int().min(1).max(5),
    review: z.string(),
  }),
});

// Schema cho lấy đánh giá theo ID
export const GetBusReviewSchema = z.object({
  params: z.object({
    id: commonValidations.id,
  }),
});
