import { StationRepository } from './stationRepository';
import { StatusCodes } from 'http-status-codes';
import { ServiceResponse } from '@/common/models/serviceResponse';
import { logger } from '@/server';

export class StationService {
    private stationRepository: StationRepository;

    constructor() {
        this.stationRepository = new StationRepository();
    }

    // Lấy danh sách bến xe phổ biến nhất theo số lượng lịch trình
    async getMostPopularStations(limit = 5): Promise<ServiceResponse<any[]>> {
        try {
            const stations = await this.stationRepository.getPopularStations(limit);

            if (!stations || stations.length === 0) {
                return ServiceResponse.failure('Không tìm thấy bến xe phổ biến.', [], StatusCodes.NOT_FOUND);
            }

            return ServiceResponse.success('Lấy danh sách bến xe phổ biến thành công.', stations, StatusCodes.OK);
        } catch (ex) {
            const errorMessage = `Error getting most popular stations: ${(ex as Error).message}`;
            logger.error(errorMessage);
            return ServiceResponse.failure('Lỗi khi lấy bến xe phổ biến.', [], StatusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}