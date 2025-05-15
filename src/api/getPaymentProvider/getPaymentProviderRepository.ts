import { db } from "@/common/config/database";

export class PaymentRepository {
    async getProviderStats() {
        return db("payment_providers as pp")
            .select(
                "pp.id as provider_id",
                "pp.provider_name",
                "pp.provider_type"
            )
            .count({
                transaction_count: db.raw("CASE WHEN p.status = 'COMPLETED' THEN 1 ELSE NULL END")
            })
            .sum({
                total_revenue: db.raw("CASE WHEN p.status = 'COMPLETED' THEN p.amount ELSE 0 END")
            })
            .leftJoin("payments as p", "p.payment_provider_id", "pp.id")
            .groupBy("pp.id", "pp.provider_name", "pp.provider_type")
            .orderBy("total_revenue", "desc");
    }
}
