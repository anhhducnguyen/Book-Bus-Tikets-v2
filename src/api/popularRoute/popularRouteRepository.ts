import type { Routes } from "@/api/popularRoute/popularRouteModel";
import { db } from "@/common/config/database";

export class RouteRepository {
  async getMostPopularRoutes(limit = 5): Promise<(Routes & { scheduleCount: number })[]> {
    const results = await db('schedules')
      .select('routes.*')
      .count('schedules.id as scheduleCount')
      .join('routes', 'schedules.route_id', 'routes.id')
      .groupBy('routes.id')
      .orderBy('scheduleCount', 'desc')
      .limit(limit);

    return results.map((row) => ({
      ...row,
      scheduleCount: Number(row.scheduleCount), // Chuyển từ string sang number 
    })) as (Routes & { scheduleCount: number })[];
  }
}
