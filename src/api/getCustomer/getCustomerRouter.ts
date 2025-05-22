import express, { type Router } from "express";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

import { customerController } from "./getCustomerController";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { CustomerStatsSchema } from "./getCustomerModel";

import { authenticate } from "@/common/middleware/auth/authMiddleware";
import { permission } from "@/common/middleware/auth/permission";

// Khởi tạo OpenAPI registry
export const getCustomerRegistry = new OpenAPIRegistry();

// Khởi tạo express router
export const getCustomerRouter: Router = express.Router();

// === Thống kê khách hàng theo số lượng đặt vé ===
getCustomerRegistry.registerPath({
    method: "get",
    path: "/get-customer/statistics",
    operationId: "getCustomerStats",
    summary: "Thống kê số lượng khách hàng mới và trung thành",
    description: `Trường dữ liệu trả về:
    
    - new_customers: Số lượng khách hàng mới trong tháng

    - loyal_customers: Số lượng khách hàng trung thành trong tháng
    `,
    tags: ["Statistical"],
    responses: createApiResponse(
        CustomerStatsSchema,
        "Lấy thống kê khách hàng thành công"
    ),
});

// Định nghĩa route
getCustomerRouter.get(
    "/statistics",
    authenticate,
    permission,
    customerController.getCustomerStats
);
