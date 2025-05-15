import type { VehicleSchedule } from "./vehicleSchedule.model";
import { db } from "@/common/config/database";

export class VehicleScheduleRepository {
  async findAll(
    filter: { route_id?: number; bus_id?: number; status?: string },
    options: { sortBy?: string; limit?: number; page?: number }
  ) {
    const { sortBy = "id:asc", limit = 10, page = 1 } = options;
    const [sortField, sortOrder] = sortBy.split(":");

    const query = db<VehicleSchedule>("schedules");

    if (filter.route_id !== undefined) {
      query.where("route_id", filter.route_id);
    }
    if (filter.bus_id !== undefined) {
      query.where("bus_id", filter.bus_id);
    }
    if (filter.status !== undefined) {
      query.where("status", filter.status);
    }

    const offset = (page - 1) * limit;

    const data = await query.orderBy(sortField, sortOrder).limit(limit).offset(offset);

    const countResult = await db<VehicleSchedule>("schedules")
      .modify((qb) => {
        if (filter.route_id !== undefined) {
          qb.where("route_id", filter.route_id);
        }
        if (filter.bus_id !== undefined) {
          qb.where("bus_id", filter.bus_id);
        }
        if (filter.status !== undefined) {
          qb.where("status", filter.status);
        }
      })
      .count("id as count");

    const totalCount = Number((countResult[0] as { count: string }).count);

    return {
      results: data,
      page,
      limit,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  async findByIdAsync(id: number): Promise<VehicleSchedule | null> {
    const rows = await db<VehicleSchedule>("schedules").select("*").where("id", id);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  }

  async createAsync(data: Omit<VehicleSchedule, "id" | "created_at" | "updated_at">): Promise<VehicleSchedule> {
    const currentTime = new Date();

    const [id] = await db("schedules").insert({
      ...data,
      created_at: currentTime,
      updated_at: currentTime,
    });

    const [newSchedule] = await db("schedules").where({ id }).select("*");
    return newSchedule;
  }

  async updateAsync(id: number, data: Partial<VehicleSchedule>): Promise<VehicleSchedule | null> {
    const affectedRows = await db("schedules").where("id", id).update({
      ...data,
      updated_at: new Date(),
    });

    if (affectedRows === 0) {
      return null;
    }

    const updatedRows = await db("schedules").where("id", id).select("*").first();
    return updatedRows ?? null;
  }

  async deleteAsync(id: number): Promise<VehicleSchedule | null> {
    const rows = await db("schedules").where("id", id).del().returning("*");
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  }
}