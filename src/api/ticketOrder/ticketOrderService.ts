import { StatusCodes } from "http-status-codes";
import { TicketOrderRepository } from "@/api/ticketOrder/ticketOrderRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { TicketOrder } from "@/api/ticketOrder/ticketOrderModel";

export class TicketOrderService {
  private ticketOrderRepository: TicketOrderRepository;

  constructor(repository: TicketOrderRepository = new TicketOrderRepository()) {
    this.ticketOrderRepository = repository;
  }

  async getAllTicketOrders(params: {
    page: number;
    limit: number;
    sortBy: string;
    order: "asc" | "desc";
    search: string;
  }): Promise<ServiceResponse<TicketOrder[] | null>> {
    try {
      const ticketOrders = await this.ticketOrderRepository.getAllTicketOrders(params);
      return ServiceResponse.success<TicketOrder[]>("Lấy danh sách vé thành công", ticketOrders);
    } catch (ex) {
      const error = ex as Error;
      logger.error(`Lỗi khi lấy danh sách vé: ${error.message}`);

      if (error.name === "NotFoundError") {
        return ServiceResponse.failure(error.message, null, StatusCodes.NOT_FOUND);
      }

      return ServiceResponse.failure(
        "Đã xảy ra lỗi khi lấy danh sách vé. " + error.message,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTicketOrdersByCompany(companyId: number): Promise<ServiceResponse<TicketOrder[] | null>> {
    try {
      const ticketOrders = await this.ticketOrderRepository.getTicketOrdersByCompany(companyId);
      return ServiceResponse.success<TicketOrder[]>("Lấy danh sách vé theo nhà xe thành công", ticketOrders);
    } catch (ex) {
      const error = ex as Error;
      logger.error(`Lỗi khi lấy vé cho nhà xe ${companyId}: ${error.message}`);

      if (error.name === "NotFoundError") {
        return ServiceResponse.failure(error.message, null, StatusCodes.NOT_FOUND);
      }

      return ServiceResponse.failure(
        "Đã xảy ra lỗi khi lấy vé theo nhà xe. " + error.message,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTicketOrdersByStatus(status: string): Promise<ServiceResponse<TicketOrder[] | null>> {
    try {
      const ticketOrders = await this.ticketOrderRepository.getTicketOrdersByStatus(status);
      return ServiceResponse.success<TicketOrder[]>("Lấy danh sách vé theo trạng thái thành công", ticketOrders);
    } catch (ex) {
      const error = ex as Error;
      logger.error(`Lỗi khi lấy vé với trạng thái ${status}: ${error.message}`);

      if (error.name === "NotFoundError") {
        return ServiceResponse.failure(error.message, null, StatusCodes.NOT_FOUND);
      }

      return ServiceResponse.failure(
        "Đã xảy ra lỗi khi lấy vé theo trạng thái. " + error.message,
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const ticketOrderService = new TicketOrderService();