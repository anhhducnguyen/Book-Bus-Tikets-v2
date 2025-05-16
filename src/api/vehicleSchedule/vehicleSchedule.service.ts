import { StatusCodes } from "http-status-codes";

import type { VehicleSchedule } from "./vehicleSchedule.model";
import { VehicleScheduleRepository } from "./vehicleSchedule.repository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class VehicleScheduleService {
  private vehicleScheduleRepository: VehicleScheduleRepository;

  constructor(repository: VehicleScheduleRepository = new VehicleScheduleRepository()) {
    this.vehicleScheduleRepository = repository;
  }

  // Hiển thị tất cả lịch trình xe với phân trang, sắp xếp, tìm kiếm
  async findAll(
    filter: { route_id?: number; bus_id?: number; status?: string },
    options: { sortBy?: string; limit?: number; page?: number }
  ): Promise<ServiceResponse<any>> {
    try {
      const result = await this.vehicleScheduleRepository.findAll(filter, options);
      return ServiceResponse.success("Vehicle schedules fetched successfully", result);
    } catch (ex) {
      logger.error(`Error fetching vehicle schedules: ${(ex as Error).message}`);
      return ServiceResponse.failure("Failed to fetch vehicle schedules", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  // Thêm mới lịch trình xe
  async createSchedule(
    data: Omit<VehicleSchedule, "id" | "created_at" | "updated_at">
  ): Promise<ServiceResponse<VehicleSchedule | null>> {
    try {
      const newSchedule = await this.vehicleScheduleRepository.createAsync(data);
      return ServiceResponse.success("Vehicle schedule created successfully", newSchedule, StatusCodes.CREATED);
    } catch (ex) {
      logger.error(`Error creating vehicle schedule: ${(ex as Error).message}`);
      return ServiceResponse.failure("Failed to create vehicle schedule", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  // Cập nhật lịch trình xe
  async updateSchedule(
    id: number,
    data: Partial<VehicleSchedule>
  ): Promise<ServiceResponse<VehicleSchedule | null>> {
    try {
      const schedule = await this.vehicleScheduleRepository.findByIdAsync(id);
      if (!schedule) {
        return ServiceResponse.failure("Vehicle schedule not found", null, StatusCodes.NOT_FOUND);
      }

      const updatedSchedule = await this.vehicleScheduleRepository.updateAsync(id, data);
      if (!updatedSchedule) {
        return ServiceResponse.failure("Failed to update vehicle schedule", null, StatusCodes.BAD_REQUEST);
      }

      return ServiceResponse.success("Vehicle schedule updated successfully", updatedSchedule);
    } catch (ex) {
      logger.error(`Error updating vehicle schedule with id ${id}: ${(ex as Error).message}`);
      return ServiceResponse.failure("Failed to update vehicle schedule", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  // Xóa lịch trình xe
  async deleteSchedule(id: number): Promise<ServiceResponse<VehicleSchedule | null>> {
    try {
      const schedule = await this.vehicleScheduleRepository.findByIdAsync(id);
      if (!schedule) {
        return ServiceResponse.failure("Vehicle schedule not found", null, StatusCodes.NOT_FOUND);
      }

      const deletedSchedule = await this.vehicleScheduleRepository.deleteAsync(id);
      return ServiceResponse.success("Vehicle schedule deleted successfully", deletedSchedule);
    } catch (ex) {
      logger.error(`Error deleting vehicle schedule with id ${id}: ${(ex as Error).message}`);
      return ServiceResponse.failure("Failed to delete vehicle schedule", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const vehicleScheduleService = new VehicleScheduleService();