import type { Routes } from "@/api/popularRoute/popularRouteModel";
import { db } from "@/common/config/database";

export class RouteRepository {
  async getMostPopularRoutes(limit = 5): Promise<(Routes & {
    scheduleCount: number,
    departure_station_name: string,
    arrival_station_name: string,
    departure_station_image: string
  })[]> {
    const results = await db('schedules')
      .select(
        'routes.id',
        'routes.price',

        db.raw('COUNT(schedules.id) as scheduleCount'),
        's_depart.name as departure_station_name',
        's_arrival.name as arrival_station_name',
        's_depart.image as departure_station_image'
      )
      .join('routes', 'schedules.route_id', 'routes.id')
      .join('stations as s_depart', 'routes.departure_station_id', 's_depart.id')
      .join('stations as s_arrival', 'routes.arrival_station_id', 's_arrival.id')
      .groupBy(
        'routes.id',
        's_depart.name',
        's_arrival.name',
        's_depart.image'
      )
      .orderBy('scheduleCount', 'desc')
      .limit(limit);

    return results.map((row) => ({
      ...row,
      scheduleCount: Number(row.scheduleCount),
    }));
  }
}
