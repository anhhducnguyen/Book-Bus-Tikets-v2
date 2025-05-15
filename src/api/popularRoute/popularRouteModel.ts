import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Routes  = z.infer<typeof RoutesSchema>;
export const RoutesSchema = z.object({
    id: z.number(),
    departure_station: z.number(),
    arrival_station: z.number(),
    price: z.number(),
    duration: z.number(),
    distance: z.number(),
    created_at: z.date(),
    updated_at: z.date()

});
export const CreateRoutesSchema = z.object({
	body: z.object({
		departure_station: z.number(),
		arrival_station: z.number(),
		price: z.number(),
		duration: z.number(),
		distance: z.number(),

	}),
});


// Input Validation for 'GET users/:id' endpoint
export const GetRoutesSchema = z.object({
    params: z.object({ id: commonValidations.id }),
});
