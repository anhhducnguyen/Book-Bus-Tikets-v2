import type { BusReview } from "@/api/bus_reviews/busReviewModel";
import { db } from "@/common/config/database"; 

interface GetBusReviewOptions {
    page?: number;
    limit?: number;
    id?:number;
    bus_id?: number;
    user_id?: number;
    rating?: number;
    bus_name?: string;
    company_id?: number;
    company_name?: string;
    sortBy?: 'rating' | 'created_at' | 'updated_at';
    order?: 'asc' | 'desc';
  }
 
   interface PaginatedResult<T> {
      results: T[];
      page: number;
      limit: number;
      total: number;
      totalPages: number;
}
  export class BusReviewRepository {
  async findAllAsync(options: GetBusReviewOptions): Promise<PaginatedResult<BusReview>> {
    const {
      page = 1,
      limit = 10,
      bus_id,
      user_id,
      rating,
      bus_name,
      company_id,
      company_name,
      sortBy = 'created_at',
      order = 'desc',
    } = options;

    const offset = (page - 1) * limit;

    // Query filter gốc (chỉ dùng WHERE, JOIN)
    const baseQuery = db('bus_reviews as br')
      .join('buses as b', 'br.bus_id', 'b.id')
      .join('bus_companies as bc', 'b.company_id', 'bc.id')
      .modify(qb => {
        if (bus_id) qb.where('br.bus_id', bus_id);
        if (user_id) qb.where('br.user_id', user_id);
         if (rating != null) qb.where('br.rating', rating);
        if (bus_name) qb.where('b.name', 'like', `%${bus_name}%`);
        if (company_id) qb.where('bc.id', company_id);
        if (company_name) qb.where('bc.company_name', 'like', `%${company_name}%`);
      });

    // 🔹 Đếm tổng số bản ghi
    const [{ count }] = await baseQuery.clone().count<{ count: string }>({ count: '*' });
    const total = Number(count);
    const totalPages = Math.ceil(total / limit);

    // 🔹 Truy vấn dữ liệu phân trang
    const results = await baseQuery
      .clone()
      .select(
        'br.id',
        'br.rating',
        'br.review',
        'br.created_at',
        'br.updated_at',
        'b.id as bus_id',
        'b.name as bus_name',
        'bc.id as company_id',
        'bc.company_name'
      )
      .orderBy(`br.${sortBy}`, order)
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


    //them moi mot review
    async createBusReviewAsync(data: Omit<BusReview, "id" | "created_at" | "updated_at">): Promise<BusReview> {
            try {
                // Tính toán thời gian cho createdAt và updatedAt nếu chưa có
                const currentTime = new Date();
    
                //them 1 review moi
                const [id] = await db('bus_reviews').insert({
                    ...data,
                    created_at: currentTime,
                    updated_at: currentTime,
                  });
                  
                  const [newBusReview] = await db('bus_reviews').where({ id }).select('*');
                  
                  return newBusReview;
                  
            } catch (error:unknown) {
                throw new Error(`Error creating user: ${error.message}`);
            }
    
        }
    //Xoa mot binh luan
    async deleteBusReviewAsync(id: number): Promise<BusReview | null> {
            try {
                // Tìm review cần xóa
                const BusReviewToDelete = await db('bus_reviews').where({ id }).first();
        
                if (!BusReviewToDelete) {
                    return null; // Nếu không tìm review để xóa
                }
        
                // Thực hiện xóa binh luan
                await db('bus_reviews').where({ id }).del();
        
                // Trả về binh luan đã xóa
                return BusReviewToDelete;
            } catch (error: unknown) {
                throw new Error(`Error deleting review: ${(error instanceof Error) ? error.message : 'Unknown error'}`);
            }
        }
    
    
    

}
  

