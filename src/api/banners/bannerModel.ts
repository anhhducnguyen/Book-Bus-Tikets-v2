import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Banner  = z.infer<typeof BannerSchema>;
export const BannerSchema = z.object({
    id: z.number(),
    banner_url: z.string().url(), 
    position:z.string(),
});

export const CreateBannerSchema = z.object({
	body: z.object({
		banner_url:z.string().url(),
        position: z.string()
		

	}),
});

// Input Validation for 'GET users/:id' endpoint
export const GetBannerSchema = z.object({
    params: z.object({ id: commonValidations.id }),
});
