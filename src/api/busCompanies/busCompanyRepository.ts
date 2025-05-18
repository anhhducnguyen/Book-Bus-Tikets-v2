import type { BusCompany } from "./busCompanyModel";
import { db } from "@/common/config/database";

export class BusCompanyRepository {
  // 🔍 Tìm tất cả nhà xe với phân trang, tìm kiếm và sắp xếp
  async findAllAsync(
    page: number,
    limit: number,
    search?: string,
    sortBy: string = "company_name",
    order: string = "asc"
  ): Promise<BusCompany[]> {
    const query = db<BusCompany>("bus_companies");

    if (search) {
      query.where("company_name", "like", `%${search}%`);
    }

    const validSortFields = ["company_name", "created_at", "updated_at"];
    if (validSortFields.includes(sortBy) && ["asc", "desc"].includes(order)) {
      query.orderBy(sortBy, order);
    }

    query.offset((page - 1) * limit).limit(limit);

    return await query.select("*");
  }

  // Tìm một nhà xe theo ID
  async findByIdAsync(id: number): Promise<BusCompany | null> {
    return await db<BusCompany>("bus_companies").where({ id }).first() || null;
  }

  // Tạo mới một nhà xe
  async createAsync(data: Omit<BusCompany, "id">): Promise<number> {
    const [newId] = await db<BusCompany>("bus_companies").insert(data);
    return newId;
  }

  // Cập nhật nhà xe
  async updateAsync(id: number, data: Partial<BusCompany>): Promise<boolean> {
    const updatedRows = await db<BusCompany>("bus_companies").where({ id }).update(data);
    return updatedRows > 0;
  }

  // Xóa nhà xe
  async deleteAsync(id: number): Promise<boolean> {
    const deletedRows = await db<BusCompany>("bus_companies").where({ id }).del();
    return deletedRows > 0;
  }
}
