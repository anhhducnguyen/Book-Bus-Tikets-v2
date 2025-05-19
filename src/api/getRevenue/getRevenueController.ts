import { Request, Response, RequestHandler } from 'express';
import { RevenueStatisticService } from './getRevenueService';
import { StatusCodes } from 'http-status-codes';

export const revenueStatisticService = new RevenueStatisticService();

export class RevenueStatisticController {
    // Thống kê doanh thu theo tuyến đường
    public getRevenueByRoute: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { start_date, end_date } = req.query as { start_date: string; end_date: string };

            const response = await revenueStatisticService.getRevenueByRoute({ start_date, end_date });

            res.status(response.statusCode).json({
                success: response.statusCode < 400,
                message: response.message,
                responseObject: {
                    revenues: response.responseObject
                },
                statusCode: response.statusCode
            });
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'An unexpected error occurred while fetching revenue by route.',
                responseObject: {
                    revenues: []
                },
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR
            });
        }
    };

    // Thống kê doanh thu theo công ty
    public getRevenueByCompany: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const { start_date, end_date } = req.query as { start_date: string; end_date: string };

            const response = await revenueStatisticService.getRevenueByCompany({ start_date, end_date });

            res.status(response.statusCode).json({
                success: response.statusCode < 400,
                message: response.message,
                responseObject: {
                    revenues: response.responseObject
                },
                statusCode: response.statusCode
            });
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'An unexpected error occurred while fetching revenue by company.',
                responseObject: {
                    revenues: []
                },
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR
            });
        }
    };
}

export const revenueStatisticController = new RevenueStatisticController();
