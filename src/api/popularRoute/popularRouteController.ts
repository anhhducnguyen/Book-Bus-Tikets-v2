import { Request, Response, RequestHandler } from 'express';
import { RouteService } from '@/api/popularRoute/popularRouteService';
import { StatusCodes } from "http-status-codes";

export const routeService = new RouteService();

export class RoutesController {
  /**
   * Lấy tuyến đường phổ biến nhất dựa trên số lượng chuyến đi (schedules)
   */
  public getMostPopularRouteBySchedules: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
      const response = await routeService.getMostPopularRouteBySchedules();

      res.status(response.statusCode).json({
        success: response.statusCode === StatusCodes.OK,
        message: response.message,
        responseObject: response.responseObject,
        statusCode: response.statusCode,
      });
    } catch (error) {
      console.error("Error in getMostPopularRouteBySchedules:", error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "An unexpected error occurred while fetching the most popular route.",
        responseObject: [],
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      });
    }
  };
}

export const routesController = new RoutesController();
