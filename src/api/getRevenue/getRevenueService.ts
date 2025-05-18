import { RevenueStatisticRepository } from './getRevenueRepository';
import { StatusCodes } from 'http-status-codes';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

export class RevenueStatisticService {
    private revenueRepo: RevenueStatisticRepository;

    constructor() {
        this.revenueRepo = new RevenueStatisticRepository();
    }

    // Thống kê doanh thu theo tuyến đường
    async getRevenueByRoute(payload: { start_date: string; end_date: string }): Promise<ServiceResponse<any[]>> {
        try {
            const { start_date, end_date } = payload;
            const data = await this.revenueRepo.getRevenueByRoute(start_date, end_date);

            if (!data || data.length === 0) {
                return ServiceResponse.failure('Không tìm thấy doanh thu theo tuyến đường.', [], StatusCodes.NOT_FOUND);
            }

            return ServiceResponse.success('Lấy doanh thu theo tuyến đường thành công.', data, StatusCodes.OK);
        } catch (ex) {
            const errorMessage = `Error getting revenue by route: ${(ex as Error).message}`;
            logger.error(errorMessage);
            return ServiceResponse.failure('Lỗi khi lấy doanh thu theo tuyến đường.', [], StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    // Thống kê doanh thu theo công ty
    async getRevenueByCompany(payload: { start_date: string; end_date: string }): Promise<ServiceResponse<any[]>> {
        try {
            const { start_date, end_date } = payload;
            const data = await this.revenueRepo.getRevenueByCompany(start_date, end_date);

            if (!data || data.length === 0) {
                return ServiceResponse.failure('Không tìm thấy doanh thu theo công ty.', [], StatusCodes.NOT_FOUND);
            }

            return ServiceResponse.success('Lấy doanh thu theo công ty thành công.', data, StatusCodes.OK);
        } catch (ex) {
            const errorMessage = `Error getting revenue by company: ${(ex as Error).message}`;
            logger.error(errorMessage);
            return ServiceResponse.failure('Lỗi khi lấy doanh thu theo công ty.', [], StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}
