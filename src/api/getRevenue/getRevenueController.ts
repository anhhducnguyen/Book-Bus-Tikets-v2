import { Request, Response, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { RevenueService } from "./getRevenueService";

export const revenueService = new RevenueService();

export class RevenueController {
    public getRevenueStats: RequestHandler = async (req: Request, res: Response) => {
        const { type, value } = req.query as { type: string; value: string };

        try {
            const response = await revenueService.getRevenue(type, value);
            res.status(response.statusCode).json({
                message: response.message,
                data: response.responseObject,
            });
        } catch (ex) {
            const errorMessage = ex instanceof Error ? ex.message : "Unexpected error";
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: `Lỗi khi lấy thống kê doanh thu: ${errorMessage}`,
            });
        }
    };
}

export const revenueController = new RevenueController();
