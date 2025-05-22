import { db } from "@/common/config/database";

export class StationRepository {
    async getPopularStations(limit = 5): Promise<any[]> {
        const result = await db('stations as s')
            .leftJoin('routes as r1', 's.id', 'r1.departure_station_id')
            .leftJoin('schedules as sch1', 'r1.id', 'sch1.route_id')
            .leftJoin('routes as r2', 's.id', 'r2.arrival_station_id')
            .leftJoin('schedules as sch2', 'r2.id', 'sch2.route_id')
            .select(
                's.id',
                's.name',
                's.image',
                db.raw('COUNT(sch1.id) + COUNT(sch2.id) as total_schedules')
            )
            .groupBy('s.id', 's.name', 's.image')
            .orderBy('total_schedules', 'desc')
            .limit(limit);

        return result;
    };



}
