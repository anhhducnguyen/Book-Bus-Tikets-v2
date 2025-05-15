import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

// ----- Ticket Model -----
export type Ticket = z.infer<typeof TicketSchema>;
export const TicketSchema = z.object({
    id: commonValidations.id,
    schedule_id: commonValidations.id,
    seat_id: commonValidations.id,
    departure_time: z.string().openapi({ type: "string", format: "date-time" }),
    arrival_time: z.string().openapi({ type: "string", format: "date-time" }),
    seat_type: z.enum(["LUXURY", "VIP", "STANDARD"]),
    price: z.number().openapi({ type: "number", format: "double" }),
    status: z.enum(["BOOKED", "CANCELLED"]),
    created_at: z.string().openapi({ type: "string", format: "date-time" }),
    updated_at: z.string().openapi({ type: "string", format: "date-time" }),
});

// ----- Statistics Request (optional filters) -----
export const TicketStatsSchema = z.object({
    query: z.object({
        from: z.string().optional().openapi({ type: "string", format: "date-time" }),
        to: z.string().optional().openapi({ type: "string", format: "date-time" }),
    })
});
