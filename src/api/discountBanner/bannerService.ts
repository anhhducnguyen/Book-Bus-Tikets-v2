import { Banner } from '@/api/banners/bannerModel';
import { StatusCodes } from "http-status-codes";


import { BannerRepository } from "./bannerRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";



export class BannerService {
  private bannerRepository: BannerRepository;

  constructor() {
    this.bannerRepository = new BannerRepository();
  }

  async getLatestBannerById(position: string): Promise<ServiceResponse<Banner | null>> {
    try {
      const banner = await this.bannerRepository.getLatestBannerById(position);
      return ServiceResponse.success<Banner | null>(
        'Fetched latest banner successfully',
        banner,
        StatusCodes.OK
      );
    } catch (error) {
      const errorMessage = `Error fetching latest banner: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure<null>(
        'An error occurred while fetching latest banner.',
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }





}

