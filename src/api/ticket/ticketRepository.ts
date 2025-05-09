import type { Route, Bus, Seat, Schedule, Ticket } from "@/api/ticket/ticketModel";
import { db } from "@/common/config/database";

export class TicketRepository {
  // Lấy danh sách tuyến đường
  async getRoutes(): Promise<Route[]> {
    return await db<Route>("routes").select("*");
    const rows = await db<Route>('routes').select('*');
        return rows as Route[];
    // return routes;
  }

// Lấy danh sách xe theo tuyến đường (dùng join để truy vấn 1 lần)
async getBusesByRoute(routeId: number): Promise<Bus[]> {
  return await db("buses")
    .join("schedules", "buses.id", "schedules.bus_id")
    .where("schedules.route_id", routeId)
    .andWhere("schedules.status", "AVAILABLE")
    .select("buses.*")
    .distinct(); // nếu 1 xe có nhiều lịch trình, tránh trùng lặp
}

  // Lấy danh sách ghế trống theo xe
  async getAvailableSeats(scheduleId: number): Promise<Seat[]> {
    const bookedSeats = await db("tickets") 
      .where({ schedule_id: scheduleId }) //  join thêm bảng tickets để loại các ghế đã được đặt (tránh tình trạng ghế còn "AVAILABLE" nhưng đã có vé)
      .pluck("seat_id");
  
    return db<Seat>("seats")
      .whereNotIn("id", bookedSeats)
      .andWhere("status", "AVAILABLE")
      .select("*");
  }
  
  // Lấy thông tin schedule
  async getSchedule(routeId: number, busId: number): Promise<Schedule | null | undefined> {
    return await db<Schedule>("schedules")
    .where("route_id", routeId)
    .andWhere("bus_id", busId)
    .andWhere("status", "AVAILABLE")
    .andWhere("departure_time", ">", new Date())
    .orderBy("departure_time", "asc")
    .first();

  }


  // Cập nhật trạng thái ghế
  async updateSeatStatus(seatId: number, status: "AVAILABLE" | "BOOKED"): Promise<void> {
    await db<Seat>("seats").where({ id: seatId }).update({ status });
  }

  // Cập nhật số ghế trống trong schedule
  async updateScheduleSeats(scheduleId: number, decrement: boolean): Promise<void> {
    await db<Schedule>("schedules")
      .where({ id: scheduleId })
      .increment("available_seats", decrement ? -1 : 1);
  }
}