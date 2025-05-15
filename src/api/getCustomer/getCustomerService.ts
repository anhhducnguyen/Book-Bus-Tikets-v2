import { StatusCodes } from "http-status-codes";
import { CustomerRepository } from "./getCustomerRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

interface CustomerStats {
    newCustomers: number;
    loyalCustomers: number;
}

export class CustomerService {
    private repository = new CustomerRepository();

    // 📊 Thống kê khách hàng mới và trung thành
    async getCustomerStats(): Promise<ServiceResponse<CustomerStats | null>> {
        try {
            const rawStats = await this.repository.getCustomerBookingStats();

            if (!rawStats || rawStats.length === 0) {
                return ServiceResponse.failure("Không có dữ liệu thống kê", null, StatusCodes.NOT_FOUND);
            }

            const result: CustomerStats = {
                newCustomers: 0,
                loyalCustomers: 0,
            };

            for (const row of rawStats) {
                const count = Number(row.booking_count); // Ép kiểu về number

                if (count === 1) {
                    result.newCustomers++;
                } else if (count > 1) {
                    result.loyalCustomers++;
                }
            }


            return ServiceResponse.success("Thống kê khách hàng", result);
        } catch (error) {
            logger.error(`Lỗi thống kê khách hàng: ${(error as Error).message}`);
            return ServiceResponse.failure("Lỗi hệ thống", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

export const customerService = new CustomerService();
