import { StatusCodes } from "http-status-codes";
import { BannerRepository } from "./bannerRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { Banner } from "./bannerModel";

export class BannerService {
  private bannerRepository: BannerRepository;

  constructor(repository: BannerRepository = new BannerRepository()) {
    this.bannerRepository = repository;
  }

  // Lấy banner ưu đãi nổi bật, có thể lọc theo vị trí và giới hạn 5 banner
  async getFeaturedBanners(position?: string): Promise<ServiceResponse<Banner[] | null>> {
    try {
      const banners = await this.bannerRepository.findByPosition(position, 5);
      return ServiceResponse.success("Lấy banner ưu đãi nổi bật thành công", banners);
    } catch (error) {
      const message = `Error fetching featured banners: ${(error as Error).message}`;
      logger.error(message);
      return ServiceResponse.failure(
        "Lấy banner ưu đãi thất bại",
        null, // null hợp lệ vì Promise trả về kiểu Banner[] | null
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

}

export const bannerService = new BannerService();
