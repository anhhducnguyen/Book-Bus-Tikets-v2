import type { PaymentProvider } from "@/api/paymentProvider/paymentProvider.model";
import { db } from "@/common/config/database";

export class PaymentProviderRepository {
    // Lấy danh sách tất cả các nhà cung cấp thanh toán, có thể lọc, phân trang và sắp xếp
    async findAllAsync(filter: any, options: { sortBy?: string; limit?: number; page?: number }) {
        const { sortBy = "id:asc", limit = 10, page = 1 } = options;
        const [sortField, sortOrder] = sortBy.split(":");

        const query = db<PaymentProvider>("payment_providers");

        // Lọc theo tên nhà cung cấp (nếu có)
        if (filter.provider_name) {
            query.where("provider_name", "like", `%${filter.provider_name}%`);
        }

        const offset = (page - 1) * limit;

        // Truy vấn dữ liệu với sắp xếp, phân trang
        const data = await query.orderBy(sortField, sortOrder).limit(limit).offset(offset);

        // Truy vấn tổng số bản ghi để tính tổng trang
        const countResult = await db<PaymentProvider>("payment_providers")
            .modify((qb) => {
                if (filter.provider_name) {
                    qb.where("provider_name", "like", `%${filter.provider_name}%`);
                }
            })
            .count("id as count");

        const totalCount = Number((countResult[0] as { count: string }).count);

        return {
            results: data,
            page,
            limit,
            total: totalCount,
            totalPages: Math.ceil(totalCount / limit),
        };
    }

    // Lấy thông tin chi tiết của một nhà cung cấp theo ID
    async findByIdAsync(id: number): Promise<PaymentProvider | null> {
        const provider = await db<PaymentProvider>('payment_providers')
            .where({ id })
            .first();

        return provider ?? null; // Trả về null nếu không tìm thấy
    }

    // Tạo mới một nhà cung cấp thanh toán
    async createPaymentProviderAsync(data: Omit<PaymentProvider, "id" | "created_at" | "updated_at">): Promise<PaymentProvider> {
        const currentTime = new Date();

        // Chèn dữ liệu mới và lấy ID được tạo
        const [id] = await db('payment_providers').insert({
            ...data,
            created_at: currentTime,
            updated_at: currentTime,
        });

        // Truy vấn lại nhà cung cấp vừa tạo để trả về đầy đủ thông tin
        const [newProvider] = await db('payment_providers').where({ id }).select('*');

        return newProvider;
    }

    // Xóa nhà cung cấp thanh toán theo ID
    async deletePaymentProviderAsync(id: number): Promise<boolean> {
        try {
            // Xoá payments trước (nếu không dùng ON DELETE CASCADE)
            await db("payments").where({ payment_provider_id: id }).del();

            const affectedRows = await db<PaymentProvider>("payment_providers")
                .where({ id })
                .del();

            return affectedRows > 0;
        } catch (error) {
            console.error("Error deleting payment provider:", error);
            return false;
        }
    }
}