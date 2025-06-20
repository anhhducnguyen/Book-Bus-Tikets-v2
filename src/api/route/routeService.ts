import { StatusCodes } from "http-status-codes";
import { RouteRepository } from "@/api/route/routeRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import type { RouteListItem, RouteDetail } from "./routeModel";

export class RouteService {
  private routeRepository: RouteRepository;

  constructor(repository: RouteRepository = new RouteRepository()) {
    this.routeRepository = repository;
  }

  // Retrieves all routes from the database
  async findAll(): Promise<ServiceResponse<RouteListItem[] | null>> {
    try {
      const routes = await this.routeRepository.findAllAsync();
      if (!routes || routes.length === 0) {
        return ServiceResponse.failure("No routes found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<RouteListItem[]>("Routes found", routes);
    } catch (ex) {
      const errorMessage = `Error finding all routes: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving routes.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Retrieves a single route by its ID
  async findById(id: number): Promise<ServiceResponse<RouteDetail | null>> {
    try {
      const route = await this.routeRepository.findByIdAsync(id);
      if (!route) {
        return ServiceResponse.failure("Route not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<RouteDetail>("Route found", route);
    } catch (ex) {
      const errorMessage = `Error finding route with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while finding route.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const routeService = new RouteService();