import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

// Schema cho một tuyến đường dùng để hiển thị danh sách
export const RouteListItemSchema = z.object({
  route_id: z.number(),
  route_label: z.string(), // ví dụ: "Đặt vé xe tuyến A - B, Giá: 120,000đ, Thời gian: 4 tiếng"
});

// Schema cho một tuyến đường chi tiết (GET /routes/:id)
export const RouteDetailSchema = z.object({
  route_id: z.number(),
  departure_station: z.string(),
  arrival_station: z.string(),
  price: z.number(),
  duration: z.number(),
  distance: z.number(),
  schedule_id: z.number().nullable(),
  departure_time: z.string().nullable(), // ISO date string
  arrival_time: z.string().nullable(),
  bus_name: z.string().nullable(),
  license_plate: z.string().nullable(),
  company_name: z.string().nullable(),
  cancellation_policy: z.string().nullable(),
  cancellation_time_limit: z.number().nullable(), // minutes or hours depending on your logic
  refund_percentage: z.number().nullable(), // e.g. 80 means 80%
});

// Schema validate đầu vào cho `GET /routes/:id`
export const GetRouteByIdSchema = z.object({
  params: z.object({
    id: commonValidations.id,
  }),
});

// Infer TypeScript types
export type RouteListItem = z.infer<typeof RouteListItemSchema>;
export type RouteDetail = z.infer<typeof RouteDetailSchema>;