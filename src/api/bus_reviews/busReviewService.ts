import { BusReviewRepository } from '@/api/bus_reviews/busReviewRepository';
import { BusReview } from '@/api/bus_reviews/busReviewModel';
import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";


interface GetBusReviewOptions {
    page?: number;
    limit?: number;
    id?:number;
    bus_id?: number;
    user_id?: number;
    rating?: number;
    bus_name?: string;
    company_id?: number;
    company_name?: string;
    sortBy?: 'rating' | 'created_at' | 'updated_at';
    order?: 'asc' | 'desc';
  }
    interface PaginatedResult<T> {
      results: T[];
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    }
export class BusReviewService {
  private busReviewRepository: BusReviewRepository;

  constructor() {
    this.busReviewRepository = new BusReviewRepository();
  }

  // Lấy danh sách các review với phân trang, tìm kiếm, sắp xếp
  async getAllBusReview(options: GetBusReviewOptions): Promise<PaginatedResult<BusReview>>{
    return await this.busReviewRepository.findAllAsync(options);
  }
  //Tao 1 review moi
  async createBusReview(data: Omit<BusReview, "id" | "created_at" | "updated_at">): Promise<ServiceResponse<BusReview| null>> {
    try {
        const newBusReview = await this.busReviewRepository.createBusReviewAsync(data);
        return ServiceResponse.success<BusReview>("review created successfully",newBusReview, StatusCodes.CREATED);
    } catch (ex) {
        const errorMessage = `Error creating Review: ${(ex as Error).message}`;
        logger.error(errorMessage);
        return ServiceResponse.failure("An error occurred while creating Route."+errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

//xoa review 
async deleteBusReview(id: number): Promise<ServiceResponse<BusReview | null>> {
    try {
        // Gọi phương thức xóa review trong repository
        const deletedBusReview = await this.busReviewRepository.deleteBusReviewAsync(id);

        if (!deletedBusReview) {
            
            return ServiceResponse.failure("Review not found.", null, StatusCodes.NOT_FOUND);
        }

        // Nếu xóa thành công
        return ServiceResponse.success<BusReview>("Route deleted successfully", deletedBusReview, StatusCodes.OK);
    } catch (ex) {
        const errorMessage = `Error deleting review: ${(ex as Error).message}`;
        logger.error(errorMessage);
        return ServiceResponse.failure("An error occurred while deleting review.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


}
