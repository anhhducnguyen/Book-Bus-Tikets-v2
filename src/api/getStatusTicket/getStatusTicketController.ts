import type { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ticketService } from "./getStatusTicketSerivce";

class TicketController {
    // Thống kê trạng thái vé: BOOKED, CANCELLED
    public getStatusStatistics: RequestHandler = async (_req: Request, res: Response) => {
        try {
            const serviceResponse = await ticketService.getStatusStatistics();

            res.status(serviceResponse.statusCode).json({
                success: serviceResponse.statusCode < 400,
                message: serviceResponse.message,
                responseObject: serviceResponse.responseObject,
                statusCode: serviceResponse.statusCode
            });
        } catch (ex) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "An error occurred while getting ticket status statistics.",
                responseObject: {},
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR
            });
        }
    };
}

export const ticketController = new TicketController();
