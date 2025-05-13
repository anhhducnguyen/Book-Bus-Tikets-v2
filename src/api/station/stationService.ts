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

  async findAll(page: number, limit: number, search?: string, sortBy?: string, order?: string): Promise<ServiceResponse<Station[] | null>> {
    try {
      const stations = await this.stationRepository.findAllAsync(page, limit, search, sortBy, order);
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

  async create(station: Omit<Station, "id">): Promise<ServiceResponse<number | null>> {
    try {
      const newId = await this.stationRepository.createAsync(station);
      return ServiceResponse.success<number>("Station created successfully", newId);
    } catch (ex) {
      logger.error(`Error creating station: ${(ex as Error).message}`);
      return ServiceResponse.failure("An error occurred while creating station.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, station: Partial<Station>): Promise<ServiceResponse<boolean>> {
    try {
      const isUpdated = await this.stationRepository.updateAsync(id, station);
      if (!isUpdated) {
        return ServiceResponse.failure("Station not found or not updated", false, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<boolean>("Station updated successfully", true);
    } catch (ex) {
      logger.error(`Error updating station with id ${id}: ${(ex as Error).message}`);
      return ServiceResponse.failure("An error occurred while updating station.", false, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: number): Promise<ServiceResponse<boolean>> {
    try {
      const isDeleted = await this.stationRepository.deleteAsync(id);
      if (!isDeleted) {
        return ServiceResponse.failure("Station not found", false, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<boolean>("Station deleted successfully", true);
    } catch (ex) {
      logger.error(`Error deleting station with id ${id}: ${(ex as Error).message}`);
      return ServiceResponse.failure("An error occurred while deleting station.", false, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const stationService = new StationService();
