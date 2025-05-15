import { db } from "@/common/config/database";


export class TicketRepository {

    /** Thống kê số lượng vé theo trạng thái */
    async countByStatus() {
        return db('tickets')
            .select('status')
            .count('* as count')
            .groupBy('status');
    }
}