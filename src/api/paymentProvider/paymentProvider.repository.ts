import type { PaymentProvider } from "@/api/paymentProvider/paymentProvider.model";
import { db } from "@/common/config/database";

export class PaymentProviderRepository {
    // Lấy danh sách nhà cung cấp thanh toán có phân trang, sắp xếp và lọc
    async findAllAsync(
        filter: { provider_type?: string },
        options: { sortBy?: string; limit?: number; page?: number }
    ) {
        const { sortBy = "id:asc", limit = 10, page = 1 } = options;
        const [sortField, sortOrder] = sortBy.split(":");

        const query = db<PaymentProvider>("payment_providers");

        // Lọc theo loại nhà cung cấp (CARD, E_WALLET, ...)
        if (filter.provider_type) {
            query.where("provider_type", filter.provider_type);
        }

        const offset = (page - 1) * limit;

        const data = await query
            .orderBy(sortField, sortOrder as "asc" | "desc")
            .limit(limit)
            .offset(offset);

        // Lấy tổng số bản ghi
        const countResult = await db<PaymentProvider>("payment_providers")
            .modify((qb) => {
                if (filter.provider_type) {
                    qb.where("provider_type", filter.provider_type);
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

    // Lấy nhà cung cấp thanh toán theo ID
    async findByIdAsync(id: number): Promise<PaymentProvider | null> {
        const provider = await db<PaymentProvider>("payment_providers")
            .where({ id })
            .first();

        return provider ?? null;
    }
}
