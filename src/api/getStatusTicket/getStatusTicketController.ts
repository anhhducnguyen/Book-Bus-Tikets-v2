import type { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ticketService } from "./getStatusTicketSerivce";

class TicketController {
    // Thống kê trạng thái vé: BOOKED, CANCELLED
    public getStatusStatistics: RequestHandler = async (_req: Request, res: Response) => {
        try {
            const serviceResponse = await ticketService.getStatusStatistics();
            res.status(serviceResponse.statusCode).json(serviceResponse);
        } catch (ex) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "An error occurred while getting ticket status statistics.",
            });
        }
    };
}

export const ticketController = new TicketController();
