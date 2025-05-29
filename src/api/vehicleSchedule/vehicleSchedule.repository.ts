import type { VehicleSchedule } from "./vehicleSchedule.model";
import { db } from "@/common/config/database";

export class VehicleScheduleRepository {
  async isScheduleConflict(
    bus_id: number,
    departure_time: Date,
    arrival_time: Date,
    excludeId?: number
  ): Promise<boolean> {
    const query = db("schedules")
      .where("bus_id", bus_id)
      .andWhere(function () {
        this.whereBetween("departure_time", [departure_time, arrival_time])
          .orWhereBetween("arrival_time", [departure_time, arrival_time])
          .orWhere(function () {
            this.where("departure_time", "<=", departure_time)
              .andWhere("arrival_time", ">=", arrival_time);
          });
      });

    if (excludeId !== undefined) {
      query.andWhere("id", "!=", excludeId);
    }

    const result = await query.first();
    return !!result;
  }

  async findAll(
    filter: { route_id?: number; bus_id?: number; status?: string },
    options: { sortBy?: string; limit?: number; page?: number }
  ) {
    const { sortBy = "id:asc", limit = 10, page = 1 } = options;
    const [sortField, sortOrder] = sortBy.split(":");

    // ✅ Kiểm tra bus_id
    if (filter.bus_id !== undefined) {
      const bus = await db("buses").where("id", filter.bus_id).first();
      if (!bus) throw new Error("Không tìm thấy xe buýt.");
    }

    // ✅ Kiểm tra route_id
    if (filter.route_id !== undefined) {
      const route = await db("routes").where("id", filter.route_id).first();
      if (!route) throw new Error("Không tìm thấy tuyến đường.");
    }

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
    return rows.length > 0 ? rows[0] : null;
  }

  async createAsync(data: Omit<VehicleSchedule, "id" | "created_at" | "updated_at">): Promise<VehicleSchedule> {
    // ✅ Kiểm tra tồn tại bus_id
    const bus = await db("buses").where("id", data.bus_id).first();
    if (!bus) throw new Error("Không tìm thấy xe buýt.");

    // ✅ Kiểm tra tồn tại route_id
    const route = await db("routes").where("id", data.route_id).first();
    if (!route) throw new Error("Không tìm thấy tuyến đường.");

    // ✅ Kiểm tra xung đột lịch trình
    const isConflict = await this.isScheduleConflict(data.bus_id!, data.departure_time!, data.arrival_time!);
    if (isConflict) {
      throw new Error("Xung đột lịch trình: Xe buýt đã có lịch trình trong khoảng thời gian này.");
    }

    const totalSeats = bus.capacity;

    if (data.available_seats !== undefined && data.available_seats > totalSeats) {
      throw new Error(`Số ghế có sẵn không được vượt quá tổng số ghế của xe buýt (${totalSeats}).`);
    }

    const currentTime = new Date();

    const [id] = await db("schedules").insert({
      ...data,
      total_seats: totalSeats,
      created_at: currentTime,
      updated_at: currentTime,
    });

    return await db("schedules").where({ id }).first();
  }

  async updateAsync(id: number, data: Partial<VehicleSchedule>): Promise<VehicleSchedule | null> {
    const existing = await db<VehicleSchedule>("schedules").where("id", id).first();
    if (!existing) return null;

    const updated = { ...existing, ...data };

    // ✅ Nếu có cập nhật bus_id → kiểm tra tồn tại
    if (data.bus_id !== undefined) {
      const bus = await db("buses").where("id", data.bus_id).first();
      if (!bus) throw new Error("Không tìm thấy xe buýt.");
    }

    // ✅ Nếu có cập nhật route_id → kiểm tra tồn tại
    if (data.route_id !== undefined) {
      const route = await db("routes").where("id", data.route_id).first();
      if (!route) throw new Error("Không tìm thấy tuyến đường.");
    }

    // ✅ Kiểm tra xung đột
    const isConflict = await this.isScheduleConflict(
      updated.bus_id!,
      updated.departure_time!,
      updated.arrival_time!,
      id
    );
    if (isConflict) {
      throw new Error("Xung đột lịch trình: Xe buýt đã có lịch trình trong khoảng thời gian này.");
    }

    const updatePayload: Partial<VehicleSchedule> = {
      ...data,
      updated_at: new Date(),
    };

    let totalSeats = updated.total_seats!;
    if (data.bus_id !== undefined) {
      const bus = await db("buses").where("id", data.bus_id).first();
      totalSeats = bus.capacity;
      updatePayload.total_seats = totalSeats;
    }

    if (data.available_seats !== undefined && data.available_seats > totalSeats) {
      throw new Error(`Số ghế có sẵn không được vượt quá tổng số ghế của xe buýt (${totalSeats}).`);
    }

    const affectedRows = await db("schedules").where("id", id).update(updatePayload);
    if (affectedRows === 0) return null;

    return await db("schedules").where("id", id).first();
  }

  async deleteAsync(id: number): Promise<VehicleSchedule | null> {
    return await db.transaction(async trx => {
      const ticketIds = await trx("tickets")
        .where("schedule_id", id)
        .pluck("id");

      if (ticketIds.length > 0) {
        await trx("payments").whereIn("ticket_id", ticketIds).del();
      }

      await trx("tickets").where("schedule_id", id).del();

      const rows = await trx("schedules").where("id", id).del().returning("*");
      return rows.length > 0 ? rows[0] : null;
    });
  }
}