import type { VehicleSchedule } from "./vehicleSchedule.model";
import { db } from "@/common/config/database";

export class VehicleScheduleRepository {
  // Kiểm tra xung đột lịch trình
  async isScheduleConflict(
    bus_id: number,
    departure_time: Date,
    arrival_time: Date,
    excludeId?: number // dùng khi update
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
    const isConflict = await this.isScheduleConflict(data.bus_id!, data.departure_time!, data.arrival_time!);
    if (isConflict) {
      throw new Error("Schedule conflict: Bus already has a schedule in this time range.");
    }

    // Lấy capacity từ bảng buses dựa trên bus_id
    const bus = await db("buses").where("id", data.bus_id).first();
    if (!bus) {
      throw new Error("Bus not found.");
    }

    const totalSeats = bus.capacity;
    if (data.available_seats !== undefined && data.available_seats > totalSeats) {
      throw new Error("Available seats cannot exceed total seats.");
    }

    const currentTime = new Date();

    const [id] = await db("schedules").insert({
      ...data,
      total_seats: totalSeats,
      created_at: currentTime,
      updated_at: currentTime,
    });

    const [newSchedule] = await db("schedules").where({ id }).select("*");
    return newSchedule;
  }

  async updateAsync(id: number, data: Partial<VehicleSchedule>): Promise<VehicleSchedule | null> {
    const existing = await db<VehicleSchedule>("schedules").where("id", id).first();
    if (!existing) return null;

    const updated = { ...existing, ...data };

    const isConflict = await this.isScheduleConflict(
      updated.bus_id!,
      updated.departure_time!,
      updated.arrival_time!,
      id
    );

    if (isConflict) {
      throw new Error("Schedule conflict: Bus already has a schedule in this time range.");
    }

    // Nếu có cập nhật available_seats thì kiểm tra không vượt quá total_seats
    if (data.available_seats !== undefined) {
      const totalSeats = updated.total_seats!;
      if (data.available_seats > totalSeats) {
        throw new Error("Available seats cannot exceed total seats.");
      }
    }

    const updatePayload: Partial<VehicleSchedule> = {
      ...data,
      updated_at: new Date(),
    };

    // Nếu có cập nhật bus_id → cập nhật lại total_seats từ bảng buses
    if (data.bus_id !== undefined) {
      const bus = await db("buses").where("id", data.bus_id).first();
      if (!bus) {
        throw new Error("Bus not found.");
      }

      updatePayload.total_seats = bus.capacity;

      // Nếu available_seats cũng đang được cập nhật → kiểm tra lại điều kiện
      if (data.available_seats !== undefined && data.available_seats > bus.capacity) {
        throw new Error("Available seats cannot exceed total seats.");
      }
    }

    const affectedRows = await db("schedules").where("id", id).update(updatePayload);

    if (affectedRows === 0) {
      return null;
    }

    const updatedRows = await db("schedules").where("id", id).select("*").first();
    return updatedRows ?? null;
  }

  async deleteAsync(id: number): Promise<VehicleSchedule | null> {
    return await db.transaction(async trx => {
      // Lấy danh sách ticket_id thuộc schedule
      const ticketIds = await trx("tickets")
        .where("schedule_id", id)
        .pluck("id");

      if (ticketIds.length > 0) {
        // Xoá tất cả payments liên quan tới các ticket này
        await trx("payments").whereIn("ticket_id", ticketIds).del();
      }

      // Xóa tickets
      await trx("tickets").where("schedule_id", id).del();

      // Xóa schedule
      const rows = await trx("schedules").where("id", id).del().returning("*");

      if (rows.length === 0) return null;
      return rows[0];
    });
  }
}