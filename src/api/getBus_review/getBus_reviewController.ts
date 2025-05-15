import { Request, Response, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";

import { BusReviewService } from "./getBus_reviewService";

export const busReviewService = new BusReviewService();

export class BusReviewController {
    // Thống kê đánh giá theo nhà xe
    public getReviewStatsByCompany: RequestHandler = async (_req: Request, res: Response): Promise<void> => {
        try {
            const response = await busReviewService.getReviewStatsByCompany();

            res.status(response.statusCode).json({
                message: response.message,
                data: response.responseObject,
            });
        } catch (ex) {
            const errorMessage = (ex instanceof Error) ? ex.message : "Unexpected error";
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: `An error occurred while getting review statistics: ${errorMessage}`,
            });
        }
    };
}

export const busReviewController = new BusReviewController();
