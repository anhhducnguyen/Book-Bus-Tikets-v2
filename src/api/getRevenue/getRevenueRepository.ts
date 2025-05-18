import { db } from "@/common/config/database";

export class RevenueStatisticRepository {
    async getRevenueByRoute(startDate: string, endDate: string) {
        return db("tickets as t")
            .join("schedules as s", "t.schedule_id", "s.id")
            .join("routes as r", "s.route_id", "r.id")
            .where("t.status", "BOOKED")
            .andWhereBetween("t.created_at", [startDate, endDate])
            .groupBy("r.id", "r.price")
            .select([
                "r.id as route_id",
                "r.price as route_price",
                db.raw("SUM(t.price) as total_revenue"),
                db.raw("COUNT(t.id) as total_tickets"),
            ]);
    }

    async getRevenueByCompany(startDate: string, endDate: string) {
        return db("tickets as t")
            .join("schedules as s", "t.schedule_id", "s.id")
            .join("buses as b", "s.bus_id", "b.id")
            .join("bus_companies as bc", "b.company_id", "bc.id")
            .where("t.status", "BOOKED")
            .andWhereBetween("t.created_at", [startDate, endDate])
            .groupBy("bc.id", "bc.company_name")
            .select([
                "bc.id as company_id",
                "bc.company_name",
                db.raw("SUM(t.price) as total_revenue"),
                db.raw("COUNT(t.id) as total_tickets"),
            ]);
    }
}
