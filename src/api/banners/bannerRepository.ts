import type { Routes } from "@/api/routes/routesModel";
import { db } from "@/common/config/database"; // Đảm bảo db được cấu hình đúng
import { Banner } from "./bannerModel";

interface GetBannerOptions {
    page?: number;
    limit?: number;
    banner?: string;
    position?: string;
    sortBy?: 'position' | 'banner_url';
    order?: 'asc' | 'desc';
  }
  interface PaginatedResult<T> {
      results: T[];
      page: number;
      limit: number;
      total: number;
      totalPages: number;
   }
  
    export class BannerRepository {
   async findAllAsync(options: GetBannerOptions): Promise<PaginatedResult<Banner>> {
  const {
    page = 1,
    limit = 10,
    banner,
    position,
    sortBy = 'position',
    order = 'asc',
  } = options;

  const offset = (page - 1) * limit;

  // Base query (chỉ lọc điều kiện, không limit/offset)
  const baseQuery = db<Banner>('banners').modify(qb => {
    if (banner) {
      qb.where('banner_url', 'like', `%${banner}%`);
    }
    if (position) {
      qb.where('position', 'like', `%${position}%`);
    }
  });

  // Đếm tổng số bản ghi thỏa điều kiện
  const [{ count }] = await baseQuery.clone().count('* as count');
  const total = Number(count);
  const totalPages = Math.ceil(total / limit);

  // Lấy dữ liệu phân trang
  const results = await baseQuery
    .clone()
    .select('*')
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

    
    async createBannerAsync(data: Omit<Banner, 'id'>): Promise<Banner> {
        try {
          const [id] = await db('banners').insert({ ...data });
      
          const [newBanner] = await db('banners')
            .where({ id })
            .select('*');
      
          return newBanner;
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(`Error creating banner: ${error.message}`);
          }
          throw new Error('Unknown error occurred while creating banner');
        }
      }
      async deleteBannerAsync(id: number): Promise<Banner | null> {
        try {
            // Tìm banner cần xóa
            const bannerToDelete = await db('banners').where({ id }).first();
    
            if (!bannerToDelete) {
                return null; // Nếu không tìm thấy banner để xóa
            }
    
            // Thực hiện xóa banner
            await db('banners').where({ id }).del();
    
            // Trả về banner đã xóa
            return bannerToDelete;
        } catch (error: unknown) {
            throw new Error(`Error deleting banner: ${(error instanceof Error) ? error.message : 'Unknown error'}`);
        }
    }
      
  }
  
    
    
    
      
    
    
    
    
    


  

