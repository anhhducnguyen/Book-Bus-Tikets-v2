import { z } from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

// Định nghĩa kiểu dữ liệu cho PaymentProvider
export type PaymentProvider = z.infer<typeof PaymentProviderSchema>;

// Schema kiểm tra dữ liệu đầu ra của nhà cung cấp thanh toán
export const PaymentProviderSchema = z.object({
    id: z.number(),  // ID của nhà cung cấp thanh toán
    provider_name: z.string().min(1),  // Tên nhà cung cấp (không được rỗng)
    provider_type: z.enum(["CARD", "E_WALLET", "BANK_TRANSFER", "QR_CODE"]),  // Loại nhà cung cấp
    api_endpoint: z.string().url(),  // Đường dẫn API hợp lệ
    created_at: z.date(),  // Ngày tạo
    updated_at: z.date(),  // Ngày cập nhật
});

// Schema kiểm tra dữ liệu đầu vào khi tạo mới nhà cung cấp thanh toán
export const CreatePaymentProviderSchema = z.object({
    body: z.object({
        provider_name: z.string().min(1),  // Tên nhà cung cấp
        provider_type: z.enum(["CARD", "E_WALLET", "BANK_TRANSFER", "QR_CODE"]),  // Loại thanh toán
        api_endpoint: z.string().url(),  // Endpoint API của nhà cung cấp
    }),
});

// Schema kiểm tra tham số đầu vào cho endpoint 'GET /payment-providers/:id'
export const GetPaymentProviderSchema = z.object({
    params: z.object({ id: commonValidations.id }),  // ID phải hợp lệ theo quy định chung
});