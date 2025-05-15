import { StatusCodes } from "http-status-codes";
import { StationRepository } from "./getStationPassengerRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class StationService {
    private stationRepository: StationRepository;

    constructor(repository: StationRepository = new StationRepository()) {
        this.stationRepository = repository;
    }

    // Thống kê tần suất hoạt động của bến xe
    async getStationFrequency(): Promise<ServiceResponse<any>> {
        try {
            const data = await this.stationRepository.getStationActivityFrequency();
            return ServiceResponse.success("Fetched station frequency successfully", data);
        } catch (ex) {
            const errorMessage = `Error fetching station frequency: ${(ex as Error).message}`;
            logger.error(errorMessage);
            return ServiceResponse.failure(
                "An error occurred while fetching station frequency.",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }


}

export const stationService = new StationService();
