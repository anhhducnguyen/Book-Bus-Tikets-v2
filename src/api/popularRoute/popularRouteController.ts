import { Request, Response, RequestHandler } from 'express';
import { RouteService } from '@/api/popularRoute/popularRouteService';
import { StatusCodes } from "http-status-codes";  // Đảm bảo import StatusCodes

export const routeService = new RouteService();

export class RoutesController {
    // async getAllRoutes(req: Request, res: Response) {
    //     try {
    //       const page = parseInt(req.query.page as string) || 1;
    //       const limit = parseInt(req.query.limit as string) || 10;
    
    //       const allowedSortBy = ['created_at', 'price', 'duration', 'distance'] as const;
    //       type SortBy = typeof allowedSortBy[number];
    
    //       const sortByParam = req.query.sortBy as string;
    //       const sortBy: SortBy = allowedSortBy.includes(sortByParam as SortBy)
    //         ? (sortByParam as SortBy)
    //         : 'created_at';
    
    //       const order = (req.query.order as string) === 'asc' ? 'asc' : 'desc';
    
    //       const departure_station_id = req.query.departure_station_id
    //         ? parseInt(req.query.departure_station_id as string)
    //         : undefined;
    
    //       const arrival_station_id = req.query.arrival_station_id
    //         ? parseInt(req.query.arrival_station_id as string)
    //         : undefined;
    
    //       const routes = await routeService.getAllRoutes({
    //         page,
    //         limit,
    //         sortBy,
    //         order,
    //         departure_station_id,
    //         arrival_station_id,
    //       });
    
    //       res.json(routes);
    //     } catch (error) {
    //       console.error(error);
    //       res.status(500).json({ error: "Something went wrong" });
    //     }
    //   }
  //Them moi tuyen duong


// Cập nhật tuyến đường

//xoa 1 tuyen duong

public getMostPopularRouteBySchedules: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await routeService.getMostPopularRouteBySchedules();

    if (response.statusCode === StatusCodes.OK) {
      res.status(StatusCodes.OK).json({
        route: response.responseObject,
        message: response.message,
      });
    } else {
      res.status(response.statusCode).json({
        message: response.message,
      });
    }

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An unexpected error occurred while fetching the most popular route.",
    });
  }
};

 
}

export const routesController = new RoutesController();
