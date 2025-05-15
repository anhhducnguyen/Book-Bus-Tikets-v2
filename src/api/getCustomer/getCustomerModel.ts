import { z } from "zod";

// Schema kết quả thống kê khách hàng
export const CustomerStatsSchema = z.object({
    newCustomers: z.number().int().nonnegative().describe("Số lượng khách hàng mới"),
    loyalCustomers: z.number().int().nonnegative().describe("Số lượng khách hàng trung thành"),
});

// Schema kết quả trả về dạng mảng nếu sau này cần mở rộng
export const CustomerStatsListSchema = z.array(CustomerStatsSchema);

// TypeScript types tương ứng
export type CustomerStats = z.infer<typeof CustomerStatsSchema>;
export type CustomerStatsList = z.infer<typeof CustomerStatsListSchema>;
