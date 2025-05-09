import { StatusCodes } from "http-status-codes";
import type { Route, Bus, Seat, Schedule, Ticket } from "@/api/ticket/ticketModel";
import { TicketRepository } from "@/api/ticket/ticketRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class TicketService {
  private ticketRepository: TicketRepository;

  constructor(repository: TicketRepository = new TicketRepository()) {
    this.ticketRepository = repository;
  }

  // Lựa chọn tuyến đường đi
  async getRoutes(): Promise<ServiceResponse<Route[] | null>> {
    try {
      const routes = await this.ticketRepository.getRoutes();
      return ServiceResponse.success<Route[]>("Routes retrieved", routes);
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
}

export const ticketService = new TicketService();