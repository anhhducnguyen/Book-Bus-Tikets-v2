
import { Banner } from '@/api/banners/bannerModel';
import { StatusCodes } from "http-status-codes";


import { BannerRepository } from "@/api/banners/bannerRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";


interface GetRoutesOptions {
  page?: number;
  limit?: number;
  banner_url?: string;
  position?: string;
  sortBy?: 'position' | 'banner_url';
  order?: 'asc' | 'desc';
}

export class BannerService {
  private bannerRepository: BannerRepository;

  constructor() {
    this.bannerRepository = new BannerRepository();
  }

  // Lấy danh sách các banner với phân trang, tìm kiếm, sắp xếp
  async getAllBanner(options: GetRoutesOptions): Promise<Banner[]> {
    return await this.bannerRepository.findAllAsync(options);
  }
  //Tao 1 banner moi
  async createBanner(data: Omit<Banner, "id">): Promise<ServiceResponse<Banner| null>> {
    try {
        const newBanner = await this.bannerRepository.createBannerAsync(data);
        return ServiceResponse.success<Banner>("Banner created successfully",newBanner, StatusCodes.CREATED);
    } catch (ex) {
        const errorMessage = `Error creating Banner: ${(ex as Error).message}`;
        logger.error(errorMessage);
        return ServiceResponse.failure("An error occurred while creating Banner.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

//xoa banner theo id 
async deleteBanner(id: number): Promise<ServiceResponse<Banner | null>> {
    try {
        // Gọi phương thức xóa banner trong repository
        const deletedBanner = await this.bannerRepository.deleteBannerAsync(id);

        if (!deletedBanner) {
            // Nếu không tìm thấy banner cần xóa
            return ServiceResponse.failure("Banner not found.", null, StatusCodes.NOT_FOUND);
        }

        // Nếu xóa thành công
        return ServiceResponse.success<Banner>("Banner deleted successfully", deletedBanner, StatusCodes.OK);
    } catch (ex) {
        const errorMessage = `Error deleting Banner: ${(ex as Error).message}`;
        logger.error(errorMessage);
        return ServiceResponse.failure("An error occurred while deleting Banner.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
}


}
