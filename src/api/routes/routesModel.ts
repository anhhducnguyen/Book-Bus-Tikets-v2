import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Routes  = z.infer<typeof RoutesSchema>;
export const RoutesSchema = z.object({
    id: z.number(),
    departure_station_id: z.number(),
    arrival_station_id: z.number(),
    price: z.number(),
    duration: z.number(),
    distance: z.number(),
    created_at: z.date(),
    updated_at: z.date()

});

export const CreateRoutesSchema = z.object({
  body: z.object({
    departure_station_id: z.number(),
    arrival_station_id: z.number(),
    price: z.number().min(0, "Giá phải >= 0"),
    duration: z.number().min(0, "Thời gian phải >= 0"),
    distance: z.number().min(0, "Khoảng cách phải >= 0"),
  }).refine(
    (data) => data.departure_station_id !== data.arrival_station_id,
    {
      path: ["arrival_station_id"], // chỉ ra lỗi nằm ở arrival_station_id
      message: "Điểm đi và điểm đến không được trùng nhau",
    }
  ),
});
export const PaginatedRoutesResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  responseObject: z.object({
    results: z.array(RoutesSchema),
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
  
});

// Input Validation for 'GET users/:id' endpoint
export const GetRoutesSchema = z.object({
    params: z.object({ id: commonValidations.id }),
});
