import type { BusCompany } from "@/api/busCompanies/busCompanyModel";
import { db } from "@/common/config/database";

export class BusCompanyRepository {
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

    if (["company_name", "created_at", "updated_at"].includes(sortBy) && ["asc", "desc"].includes(order)) {
      query.orderBy(sortBy, order);
    } else {
      query.orderBy("company_name", "asc");
    }

    query.offset((page - 1) * limit).limit(limit);
    const rows = await query.select("*");
    return rows as BusCompany[];
  }

  async findByIdAsync(id: number): Promise<BusCompany | null> {
    const busCompany = await db<BusCompany>("bus_companies").where({ id }).first();
    return busCompany ?? null;
  }

  async createAsync(busCompany: Omit<BusCompany, "id">): Promise<number> {
    const [newId] = await db<BusCompany>("bus_companies").insert(busCompany);
    return newId;
  }

  async updateAsync(id: number, busCompany: Partial<BusCompany>): Promise<boolean> {
    const updatedRows = await db<BusCompany>("bus_companies")
      .where({ id })
      .update(busCompany);
    return updatedRows > 0;
  }

  async deleteAsync(id: number): Promise<boolean> {
    const deletedRows = await db<BusCompany>("bus_companies").where({ id }).del();
    return deletedRows > 0;
  }
}
