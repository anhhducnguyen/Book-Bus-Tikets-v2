import type { Routes } from "@/api/routes/routesModel";
import { db } from "@/common/config/database"; // Đảm bảo db được cấu hình đúng

interface GetRoutesOptions {
    page?: number;
    limit?: number;
    departure_station_id?: number;
    arrival_station_id?: number;
    sortBy?: 'price' | 'duration' | 'distance' | 'created_at';
    order?: 'asc' | 'desc';
  }
  
  export class RouteRepository {
    async findAllAsync(options: GetRoutesOptions): Promise<Routes[]> {
      const {
        page = 1,
        limit = 10,
        departure_station_id,
        arrival_station_id,
        sortBy = 'created_at',
        order = 'asc',
      } = options;
  
      const offset = (page - 1) * limit;
  
      const query = db<Routes>('routes')
        .select('*')
        .modify(qb => {
          if (departure_station_id) {
            qb.where('departure_station_id', departure_station_id);
          }
          if (arrival_station_id) {
            qb.where('arrival_station_id', arrival_station_id);
          }
        })
        .orderBy(sortBy, order)
        .offset(offset)
        .limit(limit);
  
      const rows = await query;
      return rows;
    }
    //them moi mot tuyen duong
    async createRoutesAsync(data: Omit<Routes, "id" | "created_at" | "updated_at">): Promise<Routes> {
            try {
                // Tính toán thời gian cho createdAt và updatedAt nếu chưa có
                const currentTime = new Date();
    
                //them 1 tuyen duong moi
                const [id] = await db('routes').insert({
                    ...data,
                    created_at: currentTime,
                    updated_at: currentTime,
                  });
                  
                  const [newRoutes] = await db('routes').where({ id }).select('*');
                  
                  return newRoutes;
                  
            } catch (error:unknown) {
                throw new Error(`Error creating user: ${error.message}`);
            }
        }
    //cap nhat tuyen duong
    async updateRoutesAsync(data: Omit<Routes, "id" | "created_at" | "updated_at">, id: number): Promise<Routes> {
        try {
            const currentTime = new Date();
    
            // Cập nhật dữ liệu
            await db('routes').where({ id }).update({
                ...data,
                created_at: currentTime,  // nếu created_at phải được cập nhật, nếu không bỏ qua nó
                updated_at: currentTime,
            });
    
            // Lấy bản ghi đã cập nhật
            const [newRoutes] = await db('routes').where({ id }).select('*');
    
            return newRoutes;
        } catch (error: unknown) {
            throw new Error(`Error updating route: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    //Xoa mot tuyen duong
    async deleteRoutesAsync(id: number): Promise<Routes | null> {
        try {
            // Tìm tuyến đường cần xóa
            const routeToDelete = await db('routes').where({ id }).first();
    
            if (!routeToDelete) {
                return null; // Nếu không tìm thấy tuyến đường để xóa
            }
    
            // Thực hiện xóa tuyến đường
            await db('routes').where({ id }).del();
    
            // Trả về tuyến đường đã xóa
            return routeToDelete;
        } catch (error: unknown) {
            throw new Error(`Error deleting route: ${(error instanceof Error) ? error.message : 'Unknown error'}`);
        }
    }
    
    

}
  

