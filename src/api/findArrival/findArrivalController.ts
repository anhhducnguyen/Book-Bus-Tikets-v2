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
            // Gọi service tìm kiếm với query params
            const response = await scheduleService.search(req.query);

            res.status(response.statusCode).json({
                message: response.message,
                data: response.responseObject,
            });
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Unexpected error";
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: `Lỗi khi tìm kiếm lịch trình: ${msg}`,
            });
        }
    };
}

export const scheduleController = new ScheduleController();
