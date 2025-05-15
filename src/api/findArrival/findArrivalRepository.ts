import { db } from "@/common/config/database";

export class ScheduleRepository {
    /**
     * Tìm ID bến xe dựa trên tên (dùng LIKE để tìm tương đối)
     * @param name Tên bến xe (station)
     * @returns ID bến hoặc null nếu không tìm thấy
     */
    async findStationIdByName(name: string): Promise<number | null> {
        const station = await db("stations")
            .select("id")
            .where("name", "like", `%${name}%`)
            .first();
        return station ? station.id : null;
    }

    /**
     * Tìm lịch trình theo điểm đón, điểm đến và ngày khởi hành
     * @param departureStationId 
     * @param arrivalStationId 
     * @param departureDate (YYYY-MM-DD)
     */
    async searchSchedules(
        departureStationId: number,
        arrivalStationId: number,
        departureDate: string
    ) {
        // Truy vấn join bảng SCHEDULES và ROUTES, lọc theo station_id và ngày
        return db("schedules as s")
            .join("routes as r", "s.route_id", "r.id")
            .where("r.departure_station_id", departureStationId)
            .andWhere("r.arrival_station_id", arrivalStationId)
            .andWhereRaw("date(s.departure_time) = ?", [departureDate])
            .select(
                "s.id",
                "s.route_id",
                "s.bus_id",
                "s.departure_time",
                "s.arrival_time",
                "s.available_seats",
                "s.total_seats",
                "s.status",
                "s.created_at",
                "s.updated_at"
            );
    }
}
