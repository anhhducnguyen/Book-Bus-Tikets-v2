import { StatusCodes } from "http-status-codes";
import type { Station } from "@/api/station/stationModel";
import { StationRepository } from "@/api/station/stationRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class StationService {
  private stationRepository = new StationRepository();

  //  **Lấy tất cả các Station với phân trang, tìm kiếm và sắp xếp**
  async findAll(
    page: number,
    limit: number,
    search?: string,
    sortBy?: string,
    order?: string
  ): Promise<ServiceResponse<Station[] | null>> {
    try {
      const stations = await this.stationRepository.findAllAsync(page, limit, search, sortBy, order);

      if (!stations || stations.length === 0) {
        return ServiceResponse.failure("Không tìm thấy bến xe nào", null, StatusCodes.NOT_FOUND);
      }

      return ServiceResponse.success<Station[]>("Danh sách bến xe", stations);
    } catch (error) {
      const errorMessage = `Lỗi khi tìm tất cả bến xe: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Đã xảy ra lỗi khi truy xuất bến xe", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  //  **Lấy thông tin Station theo ID**
  async findById(id: number): Promise<ServiceResponse<Station | null>> {
    try {
      const station = await this.stationRepository.findByIdAsync(id);

      if (!station) {
        return ServiceResponse.failure("Bến xe không tồn tại", null, StatusCodes.NOT_FOUND);
      }

      return ServiceResponse.success<Station>("Thông tin bến xe", station);
    } catch (error) {
      const errorMessage = `Lỗi khi tìm bến xe với ID ${id}: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Đã xảy ra lỗi khi tìm bến xe", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  //  **Tạo mới một Station**
  async create(station: Omit<Station, "id">): Promise<ServiceResponse<number | null>> {
    try {
      const newId = await this.stationRepository.createAsync(station);
      return ServiceResponse.success<number>("Tạo mới bến xe thành công", newId);
    } catch (error) {
      const errorMessage = `Lỗi khi tạo mới bến xe: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Đã xảy ra lỗi khi tạo mới bến xe", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  //  **Cập nhật thông tin của một Station**
  async update(id: number, station: Partial<Station>): Promise<ServiceResponse<boolean>> {
    try {
      const isUpdated = await this.stationRepository.updateAsync(id, station);

      if (!isUpdated) {
        return ServiceResponse.failure("Bến xe không tồn tại hoặc không thể cập nhật", false, StatusCodes.NOT_FOUND);
      }

      return ServiceResponse.success<boolean>("Cập nhật bến xe thành công", true);
    } catch (error) {
      const errorMessage = `Lỗi khi cập nhật bến xe với ID ${id}: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Đã xảy ra lỗi khi cập nhật bến xe", false, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  //  **Xóa một Station theo ID**
  async delete(id: number): Promise<ServiceResponse<boolean>> {
    try {
      const isDeleted = await this.stationRepository.deleteAsync(id);

      if (!isDeleted) {
        return ServiceResponse.failure("Bến xe không tồn tại hoặc không thể xóa", false, StatusCodes.NOT_FOUND);
      }

      return ServiceResponse.success<boolean>("Xóa bến xe thành công", true);
    } catch (error) {
      const errorMessage = `Lỗi khi xóa bến xe với ID ${id}: ${(error as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("Đã xảy ra lỗi khi xóa bến xe", false, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const stationService = new StationService();
