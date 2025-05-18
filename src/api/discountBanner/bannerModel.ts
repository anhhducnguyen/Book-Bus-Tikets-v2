import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export const BannerSchema = z.object({
    id: z.number().int().optional(),
    banner_url: z.string().openapi({ example: "Đường liên kết banner" }),
    position: z.string(),
});

export type Banner = z.infer<typeof BannerSchema>;

export const GetBannerSchema = z.object({
    params: z.object({
        id: commonValidations.id,
    }),
});
