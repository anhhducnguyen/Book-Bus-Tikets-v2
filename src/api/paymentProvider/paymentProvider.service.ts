import { StatusCodes } from "http-status-codes";

import type { PaymentProvider } from "@/api/paymentProvider/paymentProvider.model";
import { PaymentProviderRepository } from "@/api/paymentProvider/paymentProvider.repository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class PaymentProviderService {
    private repository: PaymentProviderRepository;

    constructor(repository: PaymentProviderRepository = new PaymentProviderRepository()) {
        this.repository = repository;
    }

    // Lấy danh sách nhà cung cấp thanh toán với phân trang, lọc, sắp xếp
    async findAll(filter: any, options: any) {
        try {
            const result = await this.repository.findAllAsync(filter, options);
            return ServiceResponse.success("Danh sách nhà cung cấp thanh toán", result);
        } catch (error) {
            logger.error("Lỗi khi lấy danh sách payment providers:", error);
            return ServiceResponse.failure("Không thể lấy danh sách nhà cung cấp", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    // Lấy thông tin chi tiết của một nhà cung cấp theo ID
    async findById(id: number): Promise<ServiceResponse<PaymentProvider | null>> {
        try {
            const provider = await this.repository.findByIdAsync(id);
            if (!provider) {
                return ServiceResponse.failure("Không tìm thấy nhà cung cấp", null, StatusCodes.NOT_FOUND);
            }
            return ServiceResponse.success<PaymentProvider>("Tìm thấy nhà cung cấp", provider);
        } catch (ex) {
            const errorMessage = `Lỗi khi tìm nhà cung cấp với id ${id}: ${(ex as Error).message}`;
            logger.error(errorMessage);
            return ServiceResponse.failure("Có lỗi xảy ra khi tìm nhà cung cấp", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

// Khởi tạo instance mặc định
export const paymentProviderService = new PaymentProviderService();