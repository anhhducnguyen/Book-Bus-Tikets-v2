import { db } from "@/common/config/database"; // Đảm bảo db được cấu hình đúng
import { Banner } from "./bannerModel";

export class BannerRepository {

    // Lấy 1 banner mới nhất theo thời gian tạo
    // Giả sử bạn có trường created_at trong bảng banners
    // để xác định thời gian tạo banner
    async getLatestBannerById(position: string): Promise<Banner | null> {
        try {
            const banner = await db<Banner>('banners')
                .where({ position })
                .orderBy('created_at', 'desc') // Giả sử bạn có trường created_at để sắp xếp
                .first(); // Lấy banner mới nhất

            return banner ?? null; // Trả về null nếu không tìm thấy banner
        } catch (error: unknown) {
            throw new Error(`Error fetching latest banner: ${(error instanceof Error) ? error.message : 'Unknown error'}`);
        }
    }

}
