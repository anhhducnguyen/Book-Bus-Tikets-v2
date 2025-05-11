import type { Request, RequestHandler, Response } from "express";
import { ticketService } from "@/api/ticket/ticketService";
import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";

class TicketController {
  // Lựa chọn tuyến đường đi
  public getRoutes: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await ticketService.getRoutes();
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  // Lựa chọn xe đi
  public getBusesByRoute: RequestHandler = async (req: Request, res: Response) => {
    const routeId = Number.parseInt(req.params.routeId as string, 10);
    const serviceResponse = await ticketService.getBusesByRoute(routeId);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  // Lựa chọn ghế đi
  public getAvailableSeats: RequestHandler = async (req: Request, res: Response) => {
    const busId = Number.parseInt(req.params.busId as string, 10);
    const serviceResponse = await ticketService.getAvailableSeats(busId);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  // Đặt vé
  public bookTicket: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await ticketService.bookTicket(req.body);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  // Hủy vé
  public cancelTicket: RequestHandler = async (req: Request, res: Response) => {
    const ticketId = Number.parseInt(req.params.ticketId as string, 10);
    const serviceResponse = await ticketService.cancelTicket(ticketId);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  // Hiển thị lịch sử đặt vé theo trạng thái
  public getTicketsByStatus: RequestHandler = async (req: Request, res: Response) => {
    const { status } = req.params as { status?: string };
    if (!status) {
      res.status(StatusCodes.BAD_REQUEST).send(
        ServiceResponse.failure("Status is required", null, StatusCodes.BAD_REQUEST)
      );
      return;
    }
    console.log("Received status:", status);
    if (status !== "BOOKED" && status !== "CANCELLED") {
      res.status(StatusCodes.BAD_REQUEST).send(
        ServiceResponse.failure("Invalid status. Must be 'BOOKED' or 'CANCELLED'", null, StatusCodes.BAD_REQUEST)
      );
      return; 
    }
    const serviceResponse = await ticketService.getTicketsByStatus(status as "BOOKED" | "CANCELLED");
  }

  // Hiển thị lịch sử đặt vé theo nhà xe
  public getTicketsByCompany: RequestHandler = async (req, res) => {
    const { companyId } = req.params;
    const serviceResponse = await ticketService.getTicketsByCompany(Number(companyId));
  }

  // Xem tất cả lịch sử đặt vé
  public getTicketHistory: RequestHandler = async (req, res) => {
    const serviceResponse = await ticketService.getTicketHistory();
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const ticketController = new TicketController();