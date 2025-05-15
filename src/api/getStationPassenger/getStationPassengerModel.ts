import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

// Station type
export type Station = z.infer<typeof getStationPassengerSchema>;

// Station schema
export const getStationPassengerSchema = z.object({
  id: z.number(),
  name: z.string(),
  image: z.string().url().optional(), // Nếu image là URL
  wallpaper: z.string().url().optional(),
  descriptions: z.string(),
  location: z.string(),
  created_at: z.date(),
  updated_at: z.date(),
});

// Validation cho tạo mới station
export const CreateStationSchema = z.object({
  body: z.object({
    name: z.string().min(1),
    image: z.string().url().optional(),
    wallpaper: z.string().url().optional(),
    descriptions: z.string().optional(),
    location: z.string().min(1),
  }),
});

// Validation cho GET /stations/:id
export const GetStationSchema = z.object({
  params: z.object({
    id: commonValidations.id,
  }),
});
