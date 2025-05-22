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
  
  interface PaginatedResult<T> {
  results: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export class RouteRepository {
   async findAllAsync(options: GetRoutesOptions): Promise<PaginatedResult<Routes>> {
    const {
      page = 1,
      limit = 10,
      departure_station_id,
      arrival_station_id,
      sortBy = 'routes.created_at', // lưu ý: cần prefix table
      order = 'asc',
    } = options;

    const offset = (page - 1) * limit;

    // Base query with joins
    const baseQuery = db('routes')
      .join('stations as departure', 'routes.departure_station_id', 'departure.id')
      .join('stations as arrival', 'routes.arrival_station_id', 'arrival.id')
      .modify(qb => {
        if (departure_station_id) {
          qb.where('routes.departure_station_id', departure_station_id);
        }
        if (arrival_station_id) {
          qb.where('routes.arrival_station_id', arrival_station_id);
        }
      });

    // Đếm tổng
    const [{ count }] = await baseQuery.clone().count('* as count');
    const total = Number(count);
    const totalPages = Math.ceil(total / limit);

    // Lấy dữ liệu
    const results = await baseQuery
      .clone()
      .select(
        'routes.*',
        'departure.name as departure_name',
        'departure.image as departure_image',
        'arrival.name as arrival_name',
        'arrival.image as arrival_image'
      )
      .orderBy(sortBy, order)
      .offset(offset)
      .limit(limit);

    return {
      results,
      page,
      limit,
      total,
      totalPages
    };
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
        const routeToDelete = await db('routes').where({ id }).first();
        if (!routeToDelete) return null;

        await db.transaction(async (trx) => {
            // 1. Lấy schedule_id liên quan đến route
            const schedules = await trx('schedules')
                .where('route_id', id)
                .select('id');
            const scheduleIds = schedules.map((s) => s.id);

            // 2. Lấy ticket_id liên quan đến các schedule
            let ticketIds: number[] = [];
            if (scheduleIds.length > 0) {
                const tickets = await trx('tickets')
                    .whereIn('schedule_id', scheduleIds)
                    .select('id');
                ticketIds = tickets.map((t) => t.id);
            }

            // 3. Xóa payments liên quan đến tickets
            if (ticketIds.length > 0) {
                await trx('payments')
                    .whereIn('ticket_id', ticketIds)
                    .del();
            }

            // 4. Xóa tickets
            if (ticketIds.length > 0) {
                await trx('tickets')
                    .whereIn('id', ticketIds)
                    .del();
            }

            // 5. Xóa schedules
            if (scheduleIds.length > 0) {
                await trx('schedules')
                    .whereIn('id', scheduleIds)
                    .del();
            }

            // 6. Xóa cancellation_policies
            await trx('cancellation_policies')
                .where('route_id', id)
                .del();

            // 7. Xóa route
            await trx('routes')
                .where({ id })
                .del();
        });

        return routeToDelete;
    } catch (error: unknown) {
        throw new Error(`Error deleting route: ${(error instanceof Error) ? error.message : 'Unknown error'}`);
    }
}

}
