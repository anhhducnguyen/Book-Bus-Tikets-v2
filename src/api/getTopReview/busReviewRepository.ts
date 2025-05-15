import type { BusReview } from "./busReviewModel";
import { db } from "@/common/config/database";

export class BusReviewRepository {

    async getTopRoutesByArrivalStation(arrivalStationId: number, limit = 5): Promise<any[]> {
        try {
            const result = await db('routes')
                .select(
                    'routes.id as route_id',
                    'routes.departure_station_id',
                    'routes.arrival_station_id',
                    db.raw('AVG(bus_reviews.rating) as average_rating'),
                    db.raw('COUNT(bus_reviews.id) as review_count')
                )
                .join('schedules', 'schedules.route_id', 'routes.id')
                .join('bus_reviews', 'bus_reviews.bus_id', 'schedules.bus_id')
                .where('routes.arrival_station_id', arrivalStationId)
                .groupBy('routes.id', 'routes.departure_station_id', 'routes.arrival_station_id')
                .orderBy('average_rating', 'desc')
                .limit(limit);

            return result;
        } catch (error: unknown) {
            throw new Error(`Error fetching top reviewed routes: ${(error instanceof Error) ? error.message : 'Unknown error'}`);
        }
    }

}
