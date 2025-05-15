import type { Station } from "@/api/station/stationModel";
import { db } from "@/common/config/database";

export class StationRepository {
  // Tìm tất cả Station với phân trang, tìm kiếm và sắp xếp
  async findAllAsync(
    page: number,
    limit: number,
    search?: string,
    sortBy: string = "name",
    order: string = "asc"
  ): Promise<Station[]> {
    const query = db<Station>("stations");

    // Nếu có tìm kiếm, áp dụng điều kiện
    if (search) {
      query.where((qb) => {
        qb.where("name", "like", `%${search}%`)
          .orWhere("location", "like", `%${search}%`);
      });
    }

    // Xác thực trường sắp xếp hợp lệ
    const validSortFields = ["name", "location", "created_at", "updated_at"];
    if (validSortFields.includes(sortBy) && ["asc", "desc"].includes(order)) {
      query.orderBy(sortBy, order);
    }

    // Phân trang
    query.offset((page - 1) * limit).limit(limit);

    return await query.select("*");
  }

  // Tìm một Station theo ID
  async findByIdAsync(id: number): Promise<Station | null> {
    return await db<Station>("stations").where({ id }).first() || null;
  }

  // Tạo mới một Station
  async createAsync(station: Omit<Station, "id">): Promise<number> {
    const [newId] = await db<Station>("stations").insert(station);
    return newId;
  }

  // Cập nhật một Station
  async updateAsync(id: number, station: Partial<Station>): Promise<boolean> {
    const updatedRows = await db<Station>("stations").where({ id }).update(station);
    return updatedRows > 0;
  }

  // Xóa một Station
  async deleteAsync(id: number): Promise<boolean> {
    const deletedRows = await db<Station>("stations").where({ id }).del();
    return deletedRows > 0;
  }
}
