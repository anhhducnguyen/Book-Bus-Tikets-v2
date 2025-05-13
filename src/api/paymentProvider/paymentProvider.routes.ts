import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { PaymentProviderSchema, CreatePaymentProviderSchema, GetPaymentProviderSchema } from "@/api/paymentProvider/paymentProvider.model";
import { validateRequest } from "@/common/utils/httpHandlers";
import { paymentProviderController } from "./paymentProvider.controller";

import { authenticate } from "@/common/middleware/auth/authMiddleware";
import { permission } from "@/common/middleware/auth/permission";

export const paymentProviderRegistry = new OpenAPIRegistry();
export const paymentProviderRouter: Router = express.Router();

// Áp dụng middleware xác thực cho tất cả các route
paymentProviderRouter.use(authenticate);

// Đăng ký các đường dẫn cho tài liệu OpenAPI

// Lấy danh sách tất cả các nhà cung cấp thanh toán
paymentProviderRegistry.registerPath({
    method: "get",
    path: "/payment-providers",
    tags: ["PaymentProvider"],
    responses: createApiResponse(z.array(PaymentProviderSchema), "Lấy danh sách nhà cung cấp thanh toán thành công"),
});

// // Lấy thông tin chi tiết của một nhà cung cấp thanh toán theo ID
// paymentProviderRegistry.registerPath({
//     method: "get",
//     path: "/payment-providers/{id}",
//     tags: ["PaymentProvider"],
//     request: { params: GetPaymentProviderSchema.shape.params },
//     responses: createApiResponse(PaymentProviderSchema, "Tìm thấy nhà cung cấp thanh toán"),
// });

// Tạo mới một nhà cung cấp thanh toán
paymentProviderRegistry.registerPath({
    method: "post",
    path: "/payment-providers",
    tags: ["PaymentProvider"],
    operationId: "createPaymentProvider",
    summary: "Tạo mới một nhà cung cấp thanh toán",
    request: {
        body: {
            content: {
                "application/json": {
                    schema: CreatePaymentProviderSchema.shape.body,
                    example: {  // Thêm ví dụ minh họa cho request
                        provider_name: "Payment Provider Example",
                        provider_type: "E_WALLET",
                        api_endpoint: "https://example.com/api/payment"
                    }
                },
            },
        },
    },
    responses: createApiResponse(PaymentProviderSchema, "Tạo nhà cung cấp thanh toán thành công", 201),
});

// Xóa nhà cung cấp thanh toán theo ID
paymentProviderRegistry.registerPath({
    method: "delete",
    path: "/payment-providers/{id}",
    tags: ["PaymentProvider"],
    operationId: "deletePaymentProvider",
    summary: "Xóa một nhà cung cấp thanh toán theo ID",
    request: {
        params: GetPaymentProviderSchema.shape.params,
    },
    responses: {
        200: {
            description: "Xóa nhà cung cấp thành công",
        },
        404: {
            description: "Không tìm thấy nhà cung cấp",
        },
        500: {
            description: "Lỗi máy chủ khi xóa nhà cung cấp",
        },
    },
});

// Các route xử lý

// Lấy danh sách tất cả nhà cung cấp thanh toán
paymentProviderRouter.get("/",
    permission,
    paymentProviderController.getPaymentProviders
);

// // Lấy thông tin nhà cung cấp thanh toán theo ID
// paymentProviderRouter.get("/:id",
//     permission,
//     validateRequest(GetPaymentProviderSchema),
//     paymentProviderController.getPaymentProvider
// );

// Tạo mới nhà cung cấp thanh toán
paymentProviderRouter.post("/",
    permission,
    validateRequest(CreatePaymentProviderSchema),
    paymentProviderController.createPaymentProvider
);

paymentProviderRouter.delete("/:id",
    permission,
    validateRequest(GetPaymentProviderSchema),
    paymentProviderController.deletePaymentProvider
);