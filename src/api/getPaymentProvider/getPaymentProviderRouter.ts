import express, { type Router } from "express";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

import { paymentController } from "./getPaymentProviderController";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { PaymentProviderStatListSchema } from "./getPaymentProviderModel";

import { authenticate } from "@/common/middleware/auth/authMiddleware";
import { permission } from "@/common/middleware/auth/permission";

// Khởi tạo OpenAPI registry
export const getPaymentProviderRegistry = new OpenAPIRegistry();

// Khởi tạo express router
export const getPaymentProviderRouter: Router = express.Router();

// === Thống kê giao dịch theo nhà cung cấp thanh toán ===
getPaymentProviderRegistry.registerPath({
    method: "get",
    path: "/getPaymentProvider/statistics",
    operationId: "getPaymentProviderStats",
    summary: "Thống kê số lượng giao dịch và doanh thu theo nhà cung cấp thanh toán",
    tags: ["Statistical"],
    responses: createApiResponse(
        PaymentProviderStatListSchema,
        "Lấy thống kê nhà cung cấp thanh toán thành công"
    ),
});

// Định nghĩa route
getPaymentProviderRouter.get(
    "/statistics",
    authenticate,
    permission,
    paymentController.getProviderStats
);
