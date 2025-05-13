import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Station = z.infer<typeof StationSchema>;
export const StationSchema = z.object({
    id: z.number(),
    name: z.string(),
    image: z.string(),
    wallpaper: z.string(),
    descriptions: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});



export const GetStationSchema = z.object({
    params: z.object({ id: commonValidations.id }),
});
