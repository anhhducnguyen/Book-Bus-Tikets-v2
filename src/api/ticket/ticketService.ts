import { StatusCodes } from "http-status-codes";
import { BookTicketInputSchema, Route, Bus, Seat, Schedule, Ticket, TicketSchema, RouteSchema } from "@/api/ticket/ticketModel";
import { TicketRepository } from "@/api/ticket/ticketRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { db } from "@/common/config/database";

export class TicketService {
  private ticketRepository: TicketRepository;

  constructor(repository: TicketRepository = new TicketRepository()) {
    this.ticketRepository = repository;
  }

  // Lựa chọn tuyến đường đi
  async getRoutes(): Promise<ServiceResponse<Route[] | null>> {
    try {
      const routes = await this.ticketRepository.getRoutes();
      if (!Array.isArray(routes)) {
        logger.warn("Invalid data format returned from repository");
        return ServiceResponse.success<Route[]>("No routes found", []);
      }
  
      // Validate dữ liệu với RouteSchema
      const validatedRoutes = RouteSchema.array().parse(routes);
      return ServiceResponse.success<Route[]>("Routes retrieved", validatedRoutes);
    } catch (ex) {
      logger.error(`Error fetching routes: ${(ex as Error).message}`);
      return ServiceResponse.failure("Error fetching routes", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  // Lựa chọn xe đi
  async getBusesByRoute(routeId: number): Promise<ServiceResponse<Bus[] | null>> {
    try {
      const buses = await this.ticketRepository.getBusesByRoute(routeId);
      return ServiceResponse.success<Bus[]>("Buses retrieved", buses);
    } catch (ex) {
      logger.error(`Error fetching buses: ${(ex as Error).message}`);
      return ServiceResponse.failure("Error fetching buses", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  // Lựa chọn ghế đi
  async getAvailableSeats(busId: number): Promise<ServiceResponse<Seat[] | null>> {
    try {
      const seats = await this.ticketRepository.getAvailableSeats(busId);
      return ServiceResponse.success<Seat[]>("Seats retrieved", seats);
    } catch (ex) {
      logger.error(`Error fetching seats: ${(ex as Error).message}`);
      return ServiceResponse.failure("Error fetching seats", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  // Đặt vé
  async bookTicket(input: unknown): Promise<ServiceResponse<Ticket | null>> {
    const trx = await db.transaction();
    try {
      const parsedInput = BookTicketInputSchema.parse(input);
      const { userId, routeId, busId, seatId } = parsedInput;
  
      // Kiểm tra tuyến đường
      const route = await trx("routes").where({ id: routeId }).first();
      if (!route) return ServiceResponse.failure("Route not found", null, StatusCodes.NOT_FOUND);
  
      // Lấy schedule
      const schedule = await trx("schedules")
        .where({ route_id: routeId, bus_id: busId, status: "AVAILABLE" })
        .andWhere("departure_time", ">", new Date())
        .orderBy("departure_time", "asc")
        .first();
      if (!schedule || schedule.available_seats <= 0) {
        await trx.rollback();
        return ServiceResponse.failure("No available schedule for this bus and route", null, StatusCodes.BAD_REQUEST);
      }
  
      // Kiểm tra ghế và xe
      const seat = await trx("seats").where({ id: seatId, bus_id: busId, status: "AVAILABLE" }).first();
      if (!seat) {
        await trx.rollback();
        return ServiceResponse.failure("Seat not available", null, StatusCodes.BAD_REQUEST);
      }
  
      const totalPrice = route.price + seat.price_for_type_seat;
  
      // Tạo ticket
      const ticketData = {
      seat_id: seatId,
      schedule_id: schedule.id,
      departure_time: schedule.departure_time,
      arrival_time: schedule.arrival_time,
      seat_type: seat.seat_type,
      price: totalPrice,
      status: "BOOKED" as const,
      created_at: new Date(),
      updated_at: new Date(),
      };
  
      const [ticketId] = await trx("tickets").insert(ticketData);
      const ticket = { id: ticketId, ...ticketData };
  
      // Cập nhật trạng thái
      await trx("seats").where({ id: seatId }).update({ status: "BOOKED" });
      await trx("schedules").where({ id: schedule.id }).decrement("available_seats", 1);
  
      await trx.commit();
      return ServiceResponse.success<Ticket>("Ticket booked successfully", ticket);
    } catch (error) {
      await trx.rollback();
      logger.error(`Error booking ticket: ${(error as Error).message}`);
      return ServiceResponse.failure("Failed to book ticket", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

    // Hủy vé
  async cancelTicket(ticketId: number): Promise<ServiceResponse<null>> {
    try {
      const ticket = await db<Ticket>("tickets").where({ id: ticketId }).first();
      if (!ticket) {
        return ServiceResponse.failure("Ticket not found", null, StatusCodes.NOT_FOUND);
      }
      if (ticket.status === "CANCELLED") {
        return ServiceResponse.failure("Ticket already cancelled", null, StatusCodes.BAD_REQUEST);
      }

      await this.ticketRepository.cancelTicket(ticketId);
      await this.ticketRepository.updateSeatStatus(ticket.seat_id, "AVAILABLE");
      await this.ticketRepository.updateScheduleSeats(ticket.schedule_id, false);

      return ServiceResponse.success<null>("Ticket cancelled successfully", null);
    } catch (ex) {
      logger.error(`Error cancelling ticket: ${(ex as Error).message}`);
      return ServiceResponse.failure("Error cancelling ticket", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  // Hiển thị lịch sử đặt vé theo trạng thái
  async getTicketsByStatus(status: "BOOKED" | "CANCELLED"): Promise<ServiceResponse<Ticket[] | null>> {
    try {
      const tickets = await this.ticketRepository.getTicketsByStatus(status);
      // console.log(tickets);
      if (!Array.isArray(tickets)) {
        logger.warn("Invalid data format returned from repository");
        return ServiceResponse.success<Ticket[]>("No tickets found for this status", []);
      }

      const validatedTickets = TicketSchema.array().parse(tickets);
      return ServiceResponse.success<Ticket[]>("Tickets retrieved for status", validatedTickets);
    } catch (ex) {
      logger.error(`Error fetching tickets for status: ${(ex as Error).message}`);
      return ServiceResponse.failure("Error fetching tickets for status", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  
    // Hiển thị lịch sử đặt vé theo nhà xe
  async getTicketsByCompany(companyId: number): Promise<ServiceResponse<Ticket[] | null>> {
    try {
      const tickets = await this.ticketRepository.getTicketsByCompany(companyId);
      if (!Array.isArray(tickets)) {
        logger.warn("Invalid data format returned from repository");
        return ServiceResponse.success<Ticket[]>("No tickets found for this company", []);
      }

      const validatedTickets = TicketSchema.array().parse(tickets);
      return ServiceResponse.success<Ticket[]>("Tickets retrieved for company", validatedTickets);
    } catch (ex) {
      logger.error(`Error fetching tickets for company: ${(ex as Error).message}`);
      return ServiceResponse.failure("Error fetching tickets for company", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  // Xem lại tất cả lịch sử đặt vé
  async getTicketHistory(): Promise<ServiceResponse<Ticket[] | null>> {
    try {
      const tickets = await this.ticketRepository.getAllTickets();
      if (!Array.isArray(tickets)) {
        logger.warn("Invalid data format returned from repository");
        return ServiceResponse.success<Ticket[]>("No tickets found", []);
      }
  
      // Validate dữ liệu với TicketSchema
      const validatedTickets = TicketSchema.array().parse(tickets);
      return ServiceResponse.success<Ticket[]>("Tickets retrieved", validatedTickets);
    } catch (ex) {
      logger.error(`Error fetching tickets: ${(ex as Error).message}`);
      return ServiceResponse.failure("Error fetching tickets", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  // Thêm mới thông tin hủy vé xe dành cho admin
  async createCancelTicket(ticketId: number): Promise<ServiceResponse<null>> {
    try {
      const ticket = await this.ticketRepository.getTicketById(ticketId);
      if (!ticket) {
        return ServiceResponse.failure("Ticket not found", null, StatusCodes.NOT_FOUND);
      }
      if (ticket.status !== "BOOKED") {
        return ServiceResponse.failure("Only booked tickets can be cancelled", null, StatusCodes.BAD_REQUEST);
      }
      await this.ticketRepository.createCancelTicket(ticketId);
      return ServiceResponse.success<null>("Ticket cancellation information added successfully", null);
    } catch (ex) {
      logger.error(`Error creating cancellation information: ${(ex as Error).message}`);
      return ServiceResponse.failure("Error creating cancellation information", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
      // Hiển thi danh sách thông tin hủy theo vé xe
  async getCancelledTickets(): Promise<ServiceResponse<Ticket[] | null>> {
    try {
      const tickets = await this.ticketRepository.getTicketsByStatus("CANCELLED");
      if (!Array.isArray(tickets)) {
        logger.warn("Invalid data format returned from repository");
        return ServiceResponse.success<Ticket[]>("No cancelled tickets found", []);
      }

      const transformedTickets = tickets.map((ticket) => ({
        ...ticket,
        departure_time: ticket.departure_time instanceof Date ? ticket.departure_time : new Date(ticket.departure_time),
        arrival_time: ticket.arrival_time instanceof Date ? ticket.arrival_time : new Date(ticket.arrival_time),
        created_at: ticket.created_at instanceof Date ? ticket.created_at : new Date(ticket.created_at),
        updated_at: ticket.updated_at instanceof Date ? ticket.updated_at : new Date(ticket.updated_at),
      }));

      const validatedTickets = TicketSchema.array().parse(transformedTickets);
      return ServiceResponse.success<Ticket[]>("Cancelled tickets retrieved", validatedTickets);
    } catch (ex) {
      logger.error(`Error fetching cancelled tickets: ${(ex as Error).message}`);
      return ServiceResponse.failure("Error fetching cancelled tickets", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  
}

export const ticketService = new TicketService();