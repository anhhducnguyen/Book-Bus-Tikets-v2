import { BusReview } from "./getBus_reviewModel";
import { StatusCodes } from "http-status-codes";

import { BusReviewRepository } from "./getBus_reviewRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class BusReviewService {
    private reviewRepository: BusReviewRepository;

    constructor() {
        this.reviewRepository = new BusReviewRepository();
    }

    // Thống kê đánh giá theo nhà xe (tích cực / tiêu cực)
    async getReviewStatsByCompany(): Promise<ServiceResponse<any>> {
        try {
            const stats = await this.reviewRepository.getReviewStatsByCompany();
            return ServiceResponse.success("Thống kê đánh giá theo nhà xe", stats, StatusCodes.OK);
        } catch (ex) {
            const errorMessage = `Error getting review stats: ${(ex as Error).message}`;
            logger.error(errorMessage);
            return ServiceResponse.failure("Đã xảy ra lỗi khi thống kê đánh giá.", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }


}
