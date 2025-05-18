import { z } from "zod";

// Model doanh thu theo tuyến đường
export const RevenueByRouteSchema = z.object({
    route_id: z.number(),
    route_price: z.number(),
    total_revenue: z.number(),
    total_tickets: z.number(),
});

export const RevenueByRouteListSchema = z.object({
    revenues: z.array(RevenueByRouteSchema),
});

// Model doanh thu theo công ty (nhà xe)
export const RevenueByCompanySchema = z.object({
    company_id: z.number(),
    company_name: z.string(),
    total_revenue: z.number(),
    total_tickets: z.number(),
});

export const RevenueByCompanyListSchema = z.object({
    revenues: z.array(RevenueByCompanySchema),
});
