import { StatusCodes } from "http-status-codes";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

import { ScheduleRepository } from "./findArrivalRepository";
import { SearchScheduleByStation } from "./findArrivalModel";

export class ScheduleService {
    private scheduleRepository = new ScheduleRepository();

    /**
     * Tìm kiếm lịch trình theo tên điểm đón, điểm đến và ngày khởi hành
     * @param params query params chưa validate
     */
    async search(params: unknown): Promise<ServiceResponse<any>> {
        // Validate params đầu vào bằng zod
        const parsed = SearchScheduleByStation.safeParse(params);
        if (!parsed.success) {
            return ServiceResponse.failure(
                "Dữ liệu đầu vào không hợp lệ",
                parsed.error.format(),
                StatusCodes.BAD_REQUEST
            );
        }

        const { departureStationName, arrivalStationName, departureDate } = parsed.data;

        try {
            // Tìm id điểm đón
            const departureStationId = await this.scheduleRepository.findStationIdByName(
                departureStationName
            );
            if (!departureStationId) {
                return ServiceResponse.failure(
                    `Không tìm thấy điểm đón: ${departureStationName}`,
                    null,
                    StatusCodes.NOT_FOUND
                );
            }

            // Tìm id điểm đến
            const arrivalStationId = await this.scheduleRepository.findStationIdByName(
                arrivalStationName
            );
            if (!arrivalStationId) {
                return ServiceResponse.failure(
                    `Không tìm thấy điểm đến: ${arrivalStationName}`,
                    null,
                    StatusCodes.NOT_FOUND
                );
            }

            // Tìm lịch trình
            const schedules = await this.scheduleRepository.searchSchedules(
                departureStationId,
                arrivalStationId,
                departureDate
            );

            return ServiceResponse.success(
                "Tìm thấy lịch trình phù hợp",
                schedules,
                StatusCodes.OK
            );
        } catch (error) {
            const msg = (error as Error).message || "Lỗi hệ thống";
            logger.error(`Lỗi tìm kiếm lịch trình: ${msg}`);

            return ServiceResponse.failure(
                "Đã xảy ra lỗi khi tìm kiếm lịch trình",
                null,
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }
    }
}
