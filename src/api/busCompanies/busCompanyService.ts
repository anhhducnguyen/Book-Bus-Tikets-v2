import { StatusCodes } from "http-status-codes";
import type { BusCompany } from "./busCompanyModel";
import { BusCompanyRepository } from "./busCompanyRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class BusCompanyService {
  private repository = new BusCompanyRepository();

  // 🔍 Lấy danh sách nhà xe
  async findAll(page: number, limit: number, search?: string, sortBy?: string, order?: string): Promise<ServiceResponse<BusCompany[] | null>> {
    try {
      const data = await this.repository.findAllAsync(page, limit, search, sortBy, order);

      if (!data || data.length === 0) {
        return ServiceResponse.failure("Không tìm thấy nhà xe nào", null, StatusCodes.NOT_FOUND);
      }

      return ServiceResponse.success("Danh sách nhà xe", data);
    } catch (error) {
      logger.error(`❌ Lỗi lấy danh sách nhà xe: ${(error as Error).message}`);
      return ServiceResponse.failure("Lỗi hệ thống", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  // 🔍 Lấy chi tiết theo ID
  async findById(id: number): Promise<ServiceResponse<BusCompany | null>> {
    try {
      const company = await this.repository.findByIdAsync(id);
      if (!company) {
        return ServiceResponse.failure("Không tìm thấy nhà xe", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success("Thông tin nhà xe", company);
    } catch (error) {
      logger.error(`❌ Lỗi lấy nhà xe ID ${id}: ${(error as Error).message}`);
      return ServiceResponse.failure("Lỗi hệ thống", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  // 🆕 Tạo mới
  async create(data: Omit<BusCompany, "id">): Promise<ServiceResponse<number | null>> {
    try {
      const newId = await this.repository.createAsync(data);
      return ServiceResponse.success("Tạo nhà xe thành công", newId);
    } catch (error) {
      logger.error(`❌ Lỗi tạo nhà xe: ${(error as Error).message}`);
      return ServiceResponse.failure("Lỗi hệ thống", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  // ✏️ Cập nhật
  async update(id: number, data: Partial<BusCompany>): Promise<ServiceResponse<boolean>> {
    try {
      const updated = await this.repository.updateAsync(id, data);
      if (!updated) {
        return ServiceResponse.failure("Không tìm thấy hoặc không thể cập nhật nhà xe", false, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success("Cập nhật thành công", true);
    } catch (error) {
      logger.error(`❌ Lỗi cập nhật nhà xe ID ${id}: ${(error as Error).message}`);
      return ServiceResponse.failure("Lỗi hệ thống", false, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  // ❌ Xóa
  async delete(id: number): Promise<ServiceResponse<boolean>> {
    try {
      const deleted = await this.repository.deleteAsync(id);
      if (!deleted) {
        return ServiceResponse.failure("Không tìm thấy hoặc không thể xóa nhà xe", false, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success("Xóa nhà xe thành công", true);
    } catch (error) {
      logger.error(`❌ Lỗi xóa nhà xe ID ${id}: ${(error as Error).message}`);
      return ServiceResponse.failure("Lỗi hệ thống", false, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const busCompanyService = new BusCompanyService();
