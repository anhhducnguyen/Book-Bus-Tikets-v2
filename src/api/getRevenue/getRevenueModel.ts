import { z } from "zod";

// Request query schema
export const revenueQuerySchema = z.object({
    type: z.enum(["day", "week", "month", "year"]),
    value: z.string(),
});

// Response schema cho thống kê theo tuyến đường
export const RevenueByRouteResponseSchema = z.array(
    z.object({
        routeId: z.number(),
        departure_station_id: z.number(),
        arrival_station_id: z.number(),
        totalRevenue: z.number(),
    })
);

// Response schema cho thống kê theo nhà xe
export const RevenueByCompanyResponseSchema = z.array(
    z.object({
        companyId: z.number(),
        company_name: z.string(),
        totalRevenue: z.number(),
    })
);
