import type { Route, Bus, Seat, Schedule, Ticket } from "@/api/ticket/ticketModel";
import { db } from "@/common/config/database";

export class TicketRepository {
  // Lấy danh sách tuyến đường
  async getRoutes(): Promise<Route[]> {
    return await db<Route>("routes").select("*");
    // const rows = await db<Route>('routes').select('*');
    //     return rows as Route[];
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

// Đặt vé
  async bookTicket(ticketData: {
    seat_id: number;
    schedule_id: number;
    departure_time: Date;
    arrival_time: Date;
    seat_type: "LUXURY" | "VIP" | "STANDARD";
    price: number;
  }): Promise<Ticket> {
    const newTicket = {
      seat_id: ticketData.seat_id,  
      schedule_id: ticketData.schedule_id, 
      departure_time: ticketData.departure_time,  
      arrival_time: ticketData.arrival_time,  
      seat_type: ticketData.seat_type,  
      price: ticketData.price,
      status: "BOOKED" as "BOOKED",  
      created_at: new Date(),  
      updated_at: new Date(),  
    };

    // Insert vào cơ sở dữ liệu
    const [id] = await db<Ticket>("tickets").insert(newTicket);

    // Trả về đối tượng ticket với id
    return { id, ...newTicket };
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

  // Hủy vé
  async cancelTicket(ticketId: number): Promise<void> {
    await db<Ticket>("tickets")
      .where({ id: ticketId })
      .update({ status: "CANCELLED", updated_at: new Date() });
  }

  // Hiển thị lịch sử đặt vé theo trạng thái
  async getTicketsByStatus(status: "BOOKED" | "CANCELLED"): Promise<Ticket[]> {
    const data = await db("tickets")
      .where("status", status)
      .select("*");
    // console.log(data);
    return data;
  }

  // Hiển thị lịch sử đặt vé theo nhà xe (companyId)
  async getTicketsByCompany(companyId: number): Promise<Ticket[]> {
    return await db("tickets")
      .join("schedules", "tickets.schedule_id", "schedules.id")
      .join("buses", "schedules.bus_id", "buses.id")
      .where("buses.company_id", companyId)
      .select("tickets.*");
  }
  
  // Xem lại tất cả lịch sử đặt vé
  async getAllTickets(): Promise<Ticket[]> {
    return await db("tickets").select("*");
  }

  // Hiển thi danh sách thông tin hủy theo vé xe
  async getCancelledTickets(ticketId: number): Promise<void> {
    await db("tickets")
      .where({ id: ticketId })
      .update({ status: "CANCELLED", updated_at: new Date() });
  }
}