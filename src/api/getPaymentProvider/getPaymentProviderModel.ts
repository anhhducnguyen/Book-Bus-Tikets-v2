import { z } from "zod";

// Enum cho provider_type khớp với DB
export const PaymentProviderTypeEnum = z.enum([
    "CARD",
    "E-WALLET",
    "BANK_TRANSFER",
    "QR_CODE",
]);

// Schema kết quả thống kê 1 nhà cung cấp thanh toán
export const PaymentProviderStatSchema = z.object({
    provider_id: z.number(),
    provider_name: z.string(),
    provider_type: PaymentProviderTypeEnum,
    transaction_count: z.number(),
    total_revenue: z.number(),
});

// Schema kết quả trả về danh sách thống kê
export const PaymentProviderStatListSchema = z.array(PaymentProviderStatSchema);

// TypeScript types tương ứng
export type PaymentProviderStat = z.infer<typeof PaymentProviderStatSchema>;
export type PaymentProviderStatList = z.infer<typeof PaymentProviderStatListSchema>;
