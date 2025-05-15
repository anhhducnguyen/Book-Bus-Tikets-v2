// import express, { type Router } from "express";
// import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

// import { revenueController } from "./getRevenueController";
// import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
// import {
//     RevenueFilterSchema,
//     RevenueByRouteResponseSchema,
//     RevenueByCompanyResponseSchema,
// } from "./getRevenueModel";

// export const getRevenueRegistry = new OpenAPIRegistry();
// export const getRevenueRouter: Router = express.Router();

// getRevenueRegistry.registerPath({
//     method: "get",
//     path: "/revenue/routes",
//     operationId: "getRevenueByRoute",
//     summary: "Thống kê doanh thu theo tuyến đường",
//     tags: ["Revenue"],
//     request: {
//         query: RevenueFilterSchema,
//     },
//     responses: createApiResponse(
//         RevenueByRouteResponseSchema,
//         "Lấy thống kê doanh thu theo tuyến đường thành công"
//     ),
// });

// revenueRegistry.registerPath({
//     method: "get",
//     path: "/revenue/companies",
//     operationId: "getRevenueByCompany",
//     summary: "Thống kê doanh thu theo nhà xe",
//     tags: ["Revenue"],
//     request: {
//         query: RevenueFilterSchema,
//     },
//     responses: createApiResponse(
//         RevenueByCompanyResponseSchema,
//         "Lấy thống kê doanh thu theo nhà xe thành công"
//     ),
// });

// revenueRouter.get("/routes", revenueController.getRevenueByRoute);
// revenueRouter.get("/companies", revenueController.getRevenueByCompany);
