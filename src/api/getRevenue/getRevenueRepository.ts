import { db } from "@/common/config/database";

type RevenueType = "day" | "week" | "month" | "year";

export class RevenueRepository {
    async getRevenueByRoute(type: RevenueType, value: any) {
        const query = db("tickets")
            .join("schedules", "tickets.schedule_id", "schedules.id")
            .join("routes", "schedules.route_id", "routes.id")
            .where("tickets.status", "BOOKED")
            .groupBy("routes.id", "routes.departure_station_id", "routes.arrival_station_id")
            .select(
                "routes.id as routeId",
                "routes.departure_station_id",
                "routes.arrival_station_id"
            )
            .sum({ totalRevenue: "tickets.price" });

        switch (type) {
            case "day":
                // value: string[] (list ngày dạng 'YYYY-MM-DD')
                query.whereIn(("DATE(tickets.departure_time)"), value);
                break;

            case "week":
                query.whereRaw("YEAR(tickets.departure_time) = ? AND WEEK(tickets.departure_time, 1) = ?", [
                    value.year,
                    value.week,
                ]);
                break;

            case "month":
                query.whereRaw("YEAR(tickets.departure_time) = ? AND MONTH(tickets.departure_time) = ?", [
                    value.year,
                    value.month,
                ]);
                break;

            case "year":
                query.whereRaw("YEAR(tickets.departure_time) = ?", [value]);
                break;

            default:
                throw new Error("Unsupported type");
        }

        return query;
    }

    async getRevenueByCompany(type: RevenueType, value: any) {
        const query = db("tickets")
            .join("schedules", "tickets.schedule_id", "schedules.id")
            .join("buses", "schedules.bus_id", "buses.id")
            .join("bus_companies", "buses.company_id", "bus_companies.id")
            .where("tickets.status", "BOOKED")
            .groupBy("bus_companies.id", "bus_companies.company_name")
            .select("bus_companies.id as companyId", "bus_companies.company_name")
            .sum({ totalRevenue: "tickets.price" });

        switch (type) {
            case "day":
                query.whereIn(("DATE(tickets.departure_time)"), value);
                break;

            case "week":
                query.whereRaw("YEAR(tickets.departure_time) = ? AND WEEK(tickets.departure_time, 1) = ?", [
                    value.year,
                    value.week,
                ]);
                break;

            case "month":
                query.whereRaw("YEAR(tickets.departure_time) = ? AND MONTH(tickets.departure_time) = ?", [
                    value.year,
                    value.month,
                ]);
                break;

            case "year":
                query.whereRaw("YEAR(tickets.departure_time) = ?", [value]);
                break;

            default:
                throw new Error("Unsupported type");
        }

        return query;
    }
}
