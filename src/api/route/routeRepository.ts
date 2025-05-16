import type { RouteDetail, RouteListItem } from "./routeModel";
import { db } from "@/common/config/database";

export class RouteRepository {
  async findAllAsync(): Promise<RouteListItem[]> {
    const rows = await db("routes as r")
      .join("stations as s1", "r.departure_station_id", "s1.id")
      .join("stations as s2", "r.arrival_station_id", "s2.id")
      .select({
        route_id: "r.id",
      })
      .select(
        db.raw(
          `CONCAT(
            'Đặt vé xe tuyến ', 
            s1.name, ' - ', s2.name, 
            ', Giá: ', FORMAT(r.price, 0), 'đ', 
            ', Thời gian: ', r.duration, ' tiếng'
          ) AS route_label`
        )
      );

    return rows as RouteListItem[];
  }

  async findByIdAsync(id: number): Promise<RouteDetail | null> {
    const row = await db("routes as r")
      .join("stations as s1", "r.departure_station_id", "s1.id")
      .join("stations as s2", "r.arrival_station_id", "s2.id")
      .leftJoin("schedules as sc", "r.id", "sc.route_id")
      .leftJoin("buses as b", "sc.bus_id", "b.id")
      .leftJoin("bus_companies as bc", "b.company_id", "bc.id")
      .leftJoin("cancellation_policies as cp", "r.id", "cp.route_id")
      .select({
        route_id: "r.id",
        departure_station: "s1.name",
        arrival_station: "s2.name",
        price: "r.price",
        duration: "r.duration",
        distance: "r.distance",
        schedule_id: "sc.id",
        departure_time: "sc.departure_time",
        arrival_time: "sc.arrival_time",
        bus_name: "b.name",
        license_plate: "b.license_plate",
        company_name: "bc.company_name",
        cancellation_policy: "cp.descriptions",
        cancellation_time_limit: "cp.cancellation_time_limit",
        refund_percentage: "cp.refund_percentage",
      })
      .where("r.id", id)
      .first();

    return row ?? null;
  }
}