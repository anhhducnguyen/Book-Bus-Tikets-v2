import { BusReviewRepository } from './busReviewRepository';
import { BusReview } from './busReviewModel';
import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";


interface GetBusReviewOptions {
    page?: number;
    limit?: number;
    id?: number;
    bus_id?: number;
    user_id?: number;
    rating?: number;
    bus_name?: string;
    company_id?: number;
    company_name?: string;
    sortBy?: 'rating' | 'created_at' | 'updated_at';
    order?: 'asc' | 'desc';
}

export class BusReviewService {
    private busReviewRepository: BusReviewRepository;

    constructor() {
        this.busReviewRepository = new BusReviewRepository();
    }


    async getTopReviewedRoutesByDestination(arrivalStationId: number): Promise<ServiceResponse<BusReview[] | null>> {
        try {
            const topRoutes = await this.busReviewRepository.getTopRoutesByArrivalStation(arrivalStationId);
            return ServiceResponse.success<BusReview[]>("Fetched top reviewed routes successfully", topRoutes, StatusCodes.OK);
        } catch (ex) {
            const errorMessage = `Error fetching top reviewed routes: ${(ex as Error).message}`;
            logger.error(errorMessage);
            return ServiceResponse.failure("An error occurred while fetching top reviewed routes.", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }





}

