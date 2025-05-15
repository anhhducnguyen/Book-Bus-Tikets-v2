// popularStationModel.ts
import { z } from "zod";

export const StationSchema = z.object({
    id: z.number(),
    name: z.string(),
    image: z.string().optional(),
    wallpaper: z.string().optional(),
    descriptions: z.string().optional(),
    location: z.string(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});
export const StationListSchema = z.object({
    stations: z.array(StationSchema),
});