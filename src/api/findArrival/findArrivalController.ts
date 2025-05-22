import { Request, Response, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

import { ScheduleService } from "./findArrivalService";

const scheduleService = new ScheduleService();

export class ScheduleController {
    /**
     * Xử lý tìm kiếm lịch trình theo query
     */
    public search: RequestHandler = async (req: Request, res: Response) => {
        try {
            const response = await scheduleService.search(req.query);

            res.status(response.statusCode).json({
                success: true,
                message: response.message,
                responseObject: response.responseObject,
                statusCode: response.statusCode,
            });
        } catch (error) {
            console.error("Error in ScheduleController.search:", error);
            const msg = error instanceof Error ? error.message : "Unexpected error";

            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: `Lỗi khi tìm kiếm lịch trình: ${msg}`,
                responseObject: [],
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            });
        }
    };
}

export const scheduleController = new ScheduleController();
