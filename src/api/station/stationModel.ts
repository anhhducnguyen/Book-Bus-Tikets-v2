import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Station = z.infer<typeof StationSchema>;
export const StationSchema = z.object({
  id: z.number(),
  name: z.string().nonempty("Tên bến xe không được để trống"),
  image: z.string().url().optional(),
  wallpaper: z.string().url().optional(),
  descriptions: z.string().optional(),
  location: z.string().nonempty("Vị trí bến xe không được để trống"),
  created_at: z.date(),
  updated_at: z.date(),
});

// Input Validation for 'GET stations/:id' endpoint
export const GetStationSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});
