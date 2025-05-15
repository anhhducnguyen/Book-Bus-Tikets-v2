import { RouteRepository } from '@/api/popularRoute/popularRouteRepository';
import { Routes } from '@/api/popularRoute/popularRouteModel';
import { StatusCodes } from "http-status-codes";

import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";


interface GetRoutesOptions {
  page?: number;
  limit?: number;
  departure_station_id?: number;
  arrival_station_id?: number;
  sortBy?: 'price' | 'duration' | 'distance' | 'created_at';
  order?: 'asc' | 'desc';
}

export class RouteService {
  private routeRepository: RouteRepository;

  constructor() {
    this.routeRepository = new RouteRepository();
  }
  // tìm tuyến đường phổ biến nhất theo số lượng chuyến đi
  async getMostPopularRouteBySchedules(): Promise<ServiceResponse<(Routes & { scheduleCount: number })[]>> {
    try {
      const routes = await this.routeRepository.getMostPopularRoutes();

      if (!routes || routes.length === 0) {
        return ServiceResponse.failure("Không tìm thấy tuyến đường phổ biến.", [], StatusCodes.NOT_FOUND);
      }

      return ServiceResponse.success("Lấy tuyến phổ biến thành công", routes, StatusCodes.OK);
    } catch (ex) {
      const errorMessage = `Error getting most popular route: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Lỗi khi lấy tuyến đường phổ biến", [], StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }


}
