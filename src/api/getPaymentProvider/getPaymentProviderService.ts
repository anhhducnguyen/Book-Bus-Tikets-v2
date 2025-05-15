import { StatusCodes } from "http-status-codes";
import { PaymentRepository } from "./getPaymentProviderRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class PaymentService {
    private paymentRepository: PaymentRepository;

    constructor() {
        this.paymentRepository = new PaymentRepository();
    }

    // Thống kê nhà cung cấp thanh toán (số giao dịch và doanh thu)
    async getProviderStats(): Promise<ServiceResponse<any>> {
        try {
            const stats = await this.paymentRepository.getProviderStats();
            return ServiceResponse.success(
                "Thống kê nhà cung cấp thanh toán",
                stats,
                StatusCodes.OK
            );
        } catch (ex) {
            const errorMessage = `Error getting provider payment stats: ${(ex as Error).message}`;
            logger.error(errorMessage);
            return ServiceResponse.failure(
                "Đã xảy ra lỗi khi thống kê thanh toán.",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
}
