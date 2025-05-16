import { StatusCodes } from "http-status-codes";
import { TicketRepository } from "./getStatusTicketRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class TicketService {
    private ticketRepository: TicketRepository;

    constructor(repository: TicketRepository = new TicketRepository()) {
        this.ticketRepository = repository;
    }

    // Thống kê số lượng vé theo trạng thái (BOOKED, CANCELLED)
    async getStatusStatistics(): Promise<ServiceResponse<any>> {
        try {
            const stats = await this.ticketRepository.countByStatus();
            return ServiceResponse.success("Trang thái vé cập nhật thành công", stats);
        } catch (error) {
            const message = `Error fetching ticket status statistics: ${(error as Error).message}`;
            logger.error(message);
            return ServiceResponse.failure("Failed to fetch ticket status statistics", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export const ticketService = new TicketService();
