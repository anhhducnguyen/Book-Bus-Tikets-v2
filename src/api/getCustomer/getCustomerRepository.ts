import { db } from "@/common/config/database";

export class CustomerRepository {
    async getCustomerBookingStats() {
        return db('payments')
            .select('user_id')
            .count('id as booking_count')
            .where('status', 'COMPLETED')
            .groupBy('user_id');
    }
}
