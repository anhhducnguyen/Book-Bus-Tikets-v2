import type { Route, Bus, Seat, Schedule, Ticket, Payment } from "@/api/ticket/ticketModel";
import { db } from "@/common/config/database";

export class TicketRepository {
  // Lấy danh sách tuyến đường
  async getRoutes(): Promise<Route[]> {
    return await db<Route>("routes").select("*");
  }

  // Lấy danh sách xe theo tuyến đường (dùng join để truy vấn 1 lần)
  async getBusesByRoute(routeId: number): Promise<Bus[]> {
    return await db("buses")
      .join("schedules", "buses.id", "schedules.bus_id")
      .where("schedules.route_id", routeId)
      .andWhere("schedules.status", "AVAILABLE")
      .andWhere("schedules.departure_time", ">", new Date()) // Chỉ lấy lịch trình trong tương lai
      .select("buses.*")
      .distinct(); // nếu 1 xe có nhiều lịch trình, tránh trùng lặp
  }

  // Lấy danh sách ghế trống theo xe
  async getAvailableSeats(busId: number): Promise<Seat[]> {
    const schedules = await db("schedules")
      .where({ bus_id: busId, status: "AVAILABLE" })
      .andWhere("departure_time", ">", new Date())
      .select("id");

    const scheduleIds = schedules.map(schedule => schedule.id);

    let bookedSeats: number[] = [];
    if (scheduleIds.length > 0) {
      bookedSeats = await db("tickets")
        .whereIn("schedule_id", scheduleIds)
        .andWhere("status", "BOOKED") // Chỉ lấy các vé chưa bị hủy
        .pluck("seat_id");
    }

    return db<Seat>("seats")
      .where({ bus_id: busId }) // Lọc theo bus_id
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
  async cancelTicket(ticketId: number, reason: string): Promise<void> {
    await db<Ticket>("tickets")
      .where({ id: ticketId })
      .update({ status: "CANCELED", reason: reason, updated_at: new Date() });
  }

  // Hiển thị lịch sử đặt vé theo trạng thái
  async getTicketsByStatus(status: "BOOKED" | "CANCELED"): Promise<Ticket[]> {
    return await db("tickets")
      .where("status", status)
      .select("*");
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
  // Lấy lịch sử đặt vé theo user_id
  async getTicketsByUserId(userId: number): Promise<Ticket[]> {
    return await db("tickets")
      .join("payments", "tickets.id", "payments.ticket_id")
      .where("payments.user_id", userId)
      .select(
        "tickets.id",
        "tickets.seat_id",
        "tickets.schedule_id",
        "tickets.departure_time",
        "tickets.arrival_time",
        "tickets.seat_type",
        "tickets.price",
        "tickets.status",
        "tickets.created_at",
        "tickets.updated_at",
        "tickets.reason"
      );
  }

  // Chọn phương thức thanh toán
  async createOrUpdatePayment(paymentData: Omit<Payment, "id" | "created_at" | "updated_at">): Promise<Payment> {
    const [payment] = await db("payments")
      .insert({
        ...paymentData,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .onConflict("ticket_id")
      .merge()
      .returning("*");
    return payment;
  }
  async getPaymentByTicketId(ticketId: number): Promise<Payment | undefined> {
    return await db("payments")
      .where({ ticket_id: ticketId })
      .first();
  }

  async getTicketById(ticketId: number): Promise<Ticket | undefined> {
    return await db("tickets")
      .where({ id: ticketId })
      .first();
  }

  // Xóa thông tin hủy vé xe
  async deleteCancelledTicket(ticketId: number, reason: string): Promise<void> {
    await db("tickets")
      .where({ id: ticketId })
      .update({
        status: "BOOKED",
        reason: reason,
        updated_at: new Date(),
      });
  }

  // Thêm mới thông tin hủy vé xe dành cho admin
  async createCancelTicket(ticketId: number, reason: string): Promise<void> {
    await db("tickets")
      .where({ id: ticketId })
      .update({
        status: "CANCELED",
        reason: reason,
        updated_at: new Date(),
      });
  }

  // Hiển thi danh sách thông tin hủy theo vé xe
  async getCancelledTickets(ticketId: number): Promise<void> {
    await db("tickets")
      .where({ id: ticketId })
      .update({
        status: "CANCELED",
        updated_at: db.fn.now(),
      });
  }

  //  Tra cứu vé xe bằng mã vé với số điện thoại
  async searchTicketByIdAndPhone(ticketId: number, phoneNumber: string): Promise<Ticket | null> {
    const ticket = await db("tickets")
      .join("payments", "tickets.id", "payments.ticket_id")
      .join("users", "payments.user_id", "users.id")
      .where("tickets.id", ticketId)
      .andWhere("users.phone", phoneNumber)
      .select(
        "tickets.id",
        "tickets.seat_id",
        "tickets.schedule_id",
        "tickets.departure_time",
        "tickets.arrival_time",
        "tickets.seat_type",
        "tickets.price",
        "tickets.status",
        "tickets.created_at",
        "tickets.updated_at"
      )
      .first();

    if (!ticket) return null;

    return {
      ...ticket,
      departure_time: new Date(ticket.departure_time),
      arrival_time: new Date(ticket.arrival_time),
      created_at: new Date(ticket.created_at),
      updated_at: new Date(ticket.updated_at),
    };
  }

  // Lấy user_id của vé thông qua bảng payments
  async getTicketUserId(ticketId: number): Promise<number | null> {
    const payment = await db("payments")
      .where({ ticket_id: ticketId })
      .select("user_id")
      .first();
    return payment ? payment.user_id : null;
  }

}