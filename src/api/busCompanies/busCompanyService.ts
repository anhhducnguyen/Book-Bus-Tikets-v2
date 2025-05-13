import { StatusCodes } from "http-status-codes";

import type { BusCompany } from "@/api/busCompanies/busCompanyModel";
import { BusCompanyRepository } from "@/api/busCompanies/busCompanyRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class BusCompanyService {
  private busCompanyRepository: BusCompanyRepository;

  constructor(repository: BusCompanyRepository = new BusCompanyRepository()) {
    this.busCompanyRepository = repository;
  }

  async findAll(page: number, limit: number, search?: string, sortBy?: string, order?: string) {
    try {
      const busCompanies = await this.busCompanyRepository.findAllAsync(page, limit, search, sortBy, order);
      if (!busCompanies.length) {
        return ServiceResponse.failure("No Bus Companies found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success("Bus Companies found", busCompanies);
    } catch (ex) {
      logger.error(`Error finding all bus companies: ${(ex as Error).message}`);
      return ServiceResponse.failure("Error retrieving bus companies.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async findById(id: number) {
    try {
      const busCompany = await this.busCompanyRepository.findByIdAsync(id);
      if (!busCompany) {
        return ServiceResponse.failure("Bus Company not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success("Bus Company found", busCompany);
    } catch (ex) {
      logger.error(`Error finding bus company with id ${id}: ${(ex as Error).message}`);
      return ServiceResponse.failure("Error finding bus company.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async create(busCompany: Omit<BusCompany, "id">) {
    try {
        const newId = await this.busCompanyRepository.createAsync(busCompany);
        const createdCompany = await this.busCompanyRepository.findByIdAsync(newId);
        return ServiceResponse.success("Bus Company created successfully", createdCompany);        
    } catch (ex) {
      logger.error(`Error creating bus company: ${(ex as Error).message}`);
      return ServiceResponse.failure("Error creating bus company.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async update(id: number, busCompany: Partial<BusCompany>): Promise<ServiceResponse<boolean>> {
    try {
      const isUpdated = await this.busCompanyRepository.updateAsync(id, busCompany);
      if (!isUpdated) {
        return ServiceResponse.failure("Bus Company not found or not updated", false, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<boolean>("Bus Company updated successfully", true);
    } catch (ex) {
      logger.error(`Error updating bus company with id ${id}: ${(ex as Error).message}`);
      return ServiceResponse.failure("An error occurred while updating bus company.", false, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: number) {
    try {
      const isDeleted = await this.busCompanyRepository.deleteAsync(id);
      if (!isDeleted) {
        return ServiceResponse.failure("Bus Company not found", false, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success("Bus Company deleted successfully", true);
    } catch (ex) {
      logger.error(`Error deleting bus company: ${(ex as Error).message}`);
      return ServiceResponse.failure("Error deleting bus company.", false, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const busCompanyService = new BusCompanyService();
