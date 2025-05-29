import { StatusCodes } from "http-status-codes";
import { PaymentProviderRepository } from "@/api/paymentProvider/paymentProvider.repository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { PaymentProvider } from "@/api/paymentProvider/paymentProvider.model";

export class PaymentProviderService {
    private paymentProviderRepository: PaymentProviderRepository;

    constructor(repository: PaymentProviderRepository = new PaymentProviderRepository()) {
        this.paymentProviderRepository = repository;
    }

    // Lấy danh sách tất cả nhà cung cấp thanh toán từ cơ sở dữ liệu, có hỗ trợ lọc và phân trang
    async findAll(filter: any, options: any): Promise<ServiceResponse<any>> {
        try {
            const result = await this.paymentProviderRepository.findAllAsync(filter, options);
            return ServiceResponse.success("Lấy danh sách nhà cung cấp thanh toán thành công", result);
        } catch (error) {
            logger.error(`Lỗi khi lấy danh sách nhà cung cấp thanh toán: ${(error as Error).message}`);
            return ServiceResponse.failure("Không thể lấy danh sách nhà cung cấp thanh toán", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    // Lấy thông tin một nhà cung cấp thanh toán theo ID
    async findById(id: number): Promise<ServiceResponse<any>> {
        try {
            const provider = await this.paymentProviderRepository.findByIdAsync(id);
            if (!provider) {
                return ServiceResponse.failure("Không tìm thấy nhà cung cấp thanh toán", null, StatusCodes.NOT_FOUND);
            }
            return ServiceResponse.success("Đã tìm thấy nhà cung cấp thanh toán", provider);
        } catch (ex) {
            const errorMessage = `Lỗi khi tìm nhà cung cấp thanh toán với ID ${id}: ${(ex as Error).message}`;
            logger.error(errorMessage);
            return ServiceResponse.failure("Đã xảy ra lỗi khi tìm nhà cung cấp thanh toán", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    // Tạo mới một nhà cung cấp thanh toán
    async createPaymentProvider(data: Omit<PaymentProvider, "id" | "created_at" | "updated_at">): Promise<ServiceResponse<any>> {
        try {
            const newProvider = await this.paymentProviderRepository.createPaymentProviderAsync(data);
            return ServiceResponse.success("Tạo nhà cung cấp thanh toán thành công", newProvider, StatusCodes.CREATED);
        } catch (ex) {
            const errorMessage = `Lỗi khi tạo nhà cung cấp thanh toán: ${(ex as Error).message}`;
            logger.error(errorMessage);
            if (errorMessage.includes("đã tồn tại với loại")) {
                return ServiceResponse.failure(errorMessage, null, StatusCodes.CONFLICT);
            }
            return ServiceResponse.failure("Đã xảy ra lỗi khi tạo nhà cung cấp thanh toán", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    // Xóa một nhà cung cấp thanh toán theo ID
    async deletePaymentProvider(id: number): Promise<ServiceResponse<any>> {
        try {
            const deleted = await this.paymentProviderRepository.deletePaymentProviderAsync(id);
            if (!deleted) {
                return ServiceResponse.failure("Không tìm thấy nhà cung cấp thanh toán để xoá", null, StatusCodes.NOT_FOUND);
            }
            return ServiceResponse.success("Xoá nhà cung cấp thanh toán thành công", null);
        } catch (error) {
            logger.error(`Lỗi khi xoá nhà cung cấp thanh toán với ID ${id}: ${(error as Error).message}`);
            return ServiceResponse.failure("Đã xảy ra lỗi khi xoá nhà cung cấp thanh toán", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export const paymentProviderService = new PaymentProviderService();
