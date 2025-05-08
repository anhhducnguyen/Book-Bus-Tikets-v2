import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Route = z.infer<typeof RouterSchema>;

export const RouterSchema = z.object({
  id: z.number().int().positive(),  // id is a positive integer
  departure_station_id: z.number().int().positive(), // departure station ID
  arrival_station_id: z.number().int().positive(),  // arrival station ID
  price: z.number().min(0),  // price should be a non-negative number
  duration: z.number().int().min(0), // duration should be a non-negative integer
  distance: z.number().int().min(0),  // distance should be a non-negative integer
  created_at: z.date(),  // created_at is a date
  updated_at: z.date(),  // updated_at is a date
});

// Input Validation for 'GET routes/:id' endpoint
export const GetRouterSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
