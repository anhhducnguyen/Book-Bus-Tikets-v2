import type { Station } from "@/api/stations/stationModel"
import { db } from "@/common/config/database"; // Đảm bảo db được cấu hình đúng

export class StationRepository {
    
    async findAllAsync(): Promise<Station[]> {
        const rows = await db<Station>('stations').select('*');
        return rows;
    }

    
    async findByIdAsync(id: number): Promise<Station | null> {
        const station = await db<Station>('stations')
            .where({ id })
            .first();
        return station ?? null;
    }

   
}
