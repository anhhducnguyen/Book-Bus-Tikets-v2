import { Request, Response, RequestHandler } from 'express';
import { StationService } from './stationService';
import { StatusCodes } from 'http-status-codes';

export const stationService = new StationService();

export class StationController {
    // Lấy danh sách tuyến đường phổ biến nhất (dựa theo số lượng chuyến đi - schedules)
    public getMostPopularRouteBySchedules: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            const response = await stationService.getMostPopularStations();

            res.status(response.statusCode).json({
                success: true,
                message: response.message,
                responseObject: response.responseObject,
                statusCode: response.statusCode,
            });
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: 'An unexpected error occurred while fetching the most popular route.',
                responseObject: [],
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            });
        }
    };
}

export const stationController = new StationController();
