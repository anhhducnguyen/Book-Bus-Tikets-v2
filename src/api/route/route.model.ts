import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

// Định nghĩa kiểu Route
export type Route = z.infer<typeof RouteSchema>;
export const RouteSchema = z.object({
  id: z.number(),
  departure_station_id: z.number(),
  arrival_station_id: z.number(),
  price: z.number(),
  duration: z.number(),
  distance: z.number(),
  created_at: z.date(),
  updated_at: z.date(),
});

// Input Validation cho 'GET /routes/:id'
export const GetRouteSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});