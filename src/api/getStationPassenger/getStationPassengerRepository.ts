import { db } from "@/common/config/database";

export class StationRepository {
    async getStationActivityFrequency(): Promise<any[]> {
        return db("stations as s")
            .leftJoin("routes as r1", "s.id", "r1.departure_station_id")
            .leftJoin("routes as r2", "s.id", "r2.arrival_station_id")
            .leftJoin("schedules as sch1", "r1.id", "sch1.route_id")
            .leftJoin("schedules as sch2", "r2.id", "sch2.route_id")
            .leftJoin("tickets as b1", "b1.schedule_id", "sch1.id")
            .leftJoin("tickets as b2", "b2.schedule_id", "sch2.id")
            .groupBy("s.id", "s.name")
            .select(
                "s.id",
                "s.name",
                db.raw("COUNT(DISTINCT b1.id) as departure_bookings"),
                db.raw("COUNT(DISTINCT b2.id) as arrival_bookings")
            );
    }
}
