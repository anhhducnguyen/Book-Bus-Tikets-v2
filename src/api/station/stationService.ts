import { StatusCodes } from "http-status-codes";

import type { Station } from "@/api/station/stationModel";
import { StationRepository } from "@/api/station/stationRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class StationService {
  private stationRepository: StationRepository;

  constructor(repository: StationRepository = new StationRepository()) {
    this.stationRepository = repository;
  }

  async findAll(): Promise<ServiceResponse<Station[] | null>> {
    try {
      const stations = await this.stationRepository.findAllAsync();
      if (!stations || stations.length === 0) {
        return ServiceResponse.failure("No Stations found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Station[]>("Stations found", stations);
    } catch (ex) {
      const errorMessage = `Error finding all stations: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure(
        "An error occurred while retrieving stations.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findById(id: number): Promise<ServiceResponse<Station | null>> {
    try {
      const station = await this.stationRepository.findByIdAsync(id);
      if (!station) {
        return ServiceResponse.failure("Station not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<Station>("Station found", station);
    } catch (ex) {
      const errorMessage = `Error finding station with id ${id}: ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while finding station.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const stationService = new StationService();
