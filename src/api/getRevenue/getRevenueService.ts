import { StatusCodes } from "http-status-codes";
import { RevenueRepository } from "./getRevenueRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class RevenueService {
    private revenueRepository: RevenueRepository;

    constructor() {
        this.revenueRepository = new RevenueRepository();
    }

    async getRevenue(type: string, value: string): Promise<ServiceResponse<any>> {
        try {
            let parsedValue: any;

            // Parse value tùy type
            switch (type) {
                case "day":
                    // value là chuỗi các ngày, ví dụ: "2023-10-01,2023-10-02"
                    parsedValue = value.split(",").map((d) => d.trim());
                    break;
                case "week":
                    // value dạng "2023-40" (năm-tuần)
                    const [yearW, week] = value.split("-");
                    parsedValue = { year: parseInt(yearW), week: parseInt(week) };
                    break;
                case "month":
                    // value dạng "2023-10" (năm-tháng)
                    const [yearM, month] = value.split("-");
                    parsedValue = { year: parseInt(yearM), month: parseInt(month) };
                    break;
                case "year":
                    // value dạng "2023"
                    parsedValue = parseInt(value);
                    break;
                default:
                    throw new Error("Unsupported type");
            }

            const revenueByRoute = await this.revenueRepository.getRevenueByRoute(type as any, parsedValue);
            const revenueByCompany = await this.revenueRepository.getRevenueByCompany(type as any, parsedValue);

            return ServiceResponse.success("Thống kê doanh thu thành công", {
                revenueByRoute,
                revenueByCompany,
            }, StatusCodes.OK);

        } catch (ex) {
            logger.error(`Error getting revenue stats: ${(ex as Error).message}`);
            return ServiceResponse.failure("Lỗi khi lấy thống kê doanh thu", null, StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}
