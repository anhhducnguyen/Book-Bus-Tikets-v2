import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

// Mở rộng Zod để hỗ trợ OpenAPI (Swagger)
extendZodWithOpenApi(z);

// Định nghĩa enum tương ứng với kiểu ENUM trong MySQL
export const ProviderTypeEnum = z.enum(["CARD", "E_WALLET", "BANK_TRANSFER", "QR_CODE"]);

// Kiểu dữ liệu TypeScript được suy ra từ schema bên dưới
export type PaymentProvider = z.infer<typeof PaymentProviderSchema>;

// Schema định nghĩa cấu trúc dữ liệu trả về khi hiển thị nhà cung cấp thanh toán
export const PaymentProviderSchema = z.object({
    id: z.number(), // ID tự tăng
    provider_name: z.string(), // Tên nhà cung cấp
    provider_type: ProviderTypeEnum, // Loại hình thanh toán (CARD, E_WALLET, ...)
    api_endpoint: z.string().url(), // Endpoint tích hợp API của nhà cung cấp
    created_at: z.date(), // Ngày tạo
    updated_at: z.date(), // Ngày cập nhật
});

// Schema dùng để validate tham số đầu vào cho endpoint GET /payment-providers/:id
export const GetPaymentProviderSchema = z.object({
    params: z.object({
        id: commonValidations.id, // Validate id dạng số nguyên dương
    }),
});