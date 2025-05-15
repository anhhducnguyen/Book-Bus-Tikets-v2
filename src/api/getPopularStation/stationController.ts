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
                message: response.message,
                route: response.responseObject,
            });
        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: 'An unexpected error occurred while fetching the most popular route.',
            });
        }
    };

}

export const stationController = new StationController();
