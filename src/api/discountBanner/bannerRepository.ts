import { db } from "@/common/config/database";
import { Banner } from "./bannerModel";

export class BannerRepository {
    /**
     * Lấy banner mới nhất theo vị trí hiển thị
     * @param position - vị trí banner (ví dụ: 'homepage-top', 'sidebar')
     */
    async findByPosition(position?: string, limit: number = 5): Promise<Banner[]> {
        const query = db<Banner>("banners").select("*").orderBy("id", "desc");
        if (position) query.where({ position }).limit(limit);
        return query;
    }
}
