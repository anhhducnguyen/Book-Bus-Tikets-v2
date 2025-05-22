import express, { type Router } from "express";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

import { revenueStatisticController } from "./getRevenueController";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { RevenueByRouteListSchema, RevenueByCompanyListSchema } from "./getRevenueModel";

// import { authenticate } from "@/common/middleware/auth/authMiddleware";
// import { permission } from "@/common/middleware/auth/permission";

// Khởi tạo OpenAPI registry
export const revenueRegistry = new OpenAPIRegistry();

// Khởi tạo express router
export const revenueRouter: Router = express.Router();

// Thống kê doanh thu theo tuyến đường
revenueRegistry.registerPath({
    method: "get",
    path: "/revenues/by-route",
    operationId: "getRevenueByRoute",
    summary: "Thống kê doanh thu theo tuyến đường trong khoảng thời gian",
    description: `Trường dữ liệu trả về:

    - route_id: ID của tuyến đường

    - route_price: Tên của tuyến đường

    - total_revenue: Doanh thu từ tuyến đường
    
    - total_tickets: Tổng số vé đã bán`,

    tags: ["Statistical"],
    parameters: [
        {
            name: "start_date",
            in: "query",
            required: true,
            schema: { type: "string", format: "date-time" },
            description: "Ngày bắt đầu 2025-05-10 08:00:00 (ISO 8601)",
        },
        {
            name: "end_date",
            in: "query",
            required: true,
            schema: { type: "string", format: "date-time" },
            description: "Ngày kết thúc 2025-05-14 12:00:00 (ISO 8601)",
        },
    ],
    responses: createApiResponse(
        RevenueByRouteListSchema,
        "Lấy thống kê doanh thu theo tuyến đường thành công"
    ),
});

// Thống kê doanh thu theo công ty
revenueRegistry.registerPath({
    method: "get",
    path: "/revenues/by-company",
    operationId: "getRevenueByCompany",
    summary: "Thống kê doanh thu theo công ty trong khoảng thời gian",
    tags: ["Statistical"],
    parameters: [
        {
            name: "start_date",
            in: "query",
            required: true,
            schema: { type: "string", format: "date-time" },
            description: "Ngày bắt đầu (ISO 8601)",
        },
        {
            name: "end_date",
            in: "query",
            required: true,
            schema: { type: "string", format: "date-time" },
            description: "Ngày kết thúc (ISO 8601)",
        },
    ],
    responses: createApiResponse(
        RevenueByCompanyListSchema,
        "Lấy thống kê doanh thu theo công ty thành công"
    ),
});

// Định nghĩa route
revenueRouter.get(
    "/by-route",
    // authenticate,
    // permission,
    revenueStatisticController.getRevenueByRoute
);

revenueRouter.get(
    "/by-company",
    // authenticate,
    // permission,
    revenueStatisticController.getRevenueByCompany
);
