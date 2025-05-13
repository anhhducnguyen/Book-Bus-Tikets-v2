import type { Station } from "@/api/station/stationModel";
import { db } from "@/common/config/database";

// Dữ liệu mẫu cho bảng Stations
export const stations: Station[] = [
  {
    id: 1,
    name: "Bến xe Miền Đông",
    image: "mien-dong.png",
    wallpaper: "mien-dong-wallpaper.jpg",
    descriptions: "Bến xe lớn nhất khu vực phía Nam.",
    location: "Tp. Hồ Chí Minh",
    created_at: new Date(),
    updated_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // +5 ngày
  },
  {
    id: 2,
    name: "Bến xe Giáp Bát",
    image: "giap-bat.png",
    wallpaper: "giap-bat-wallpaper.jpg",
    descriptions: "Bến xe trung tâm của Hà Nội.",
    location: "Hà Nội",
    created_at: new Date(),
    updated_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // +5 ngày
  },
];

export class StationRepository {
  // Lấy toàn bộ danh sách Station
  // async findAllAsync(): Promise<Station[]> {
  //   const rows = await db<Station>("stations").select("*");
  //   return rows as Station[];
  //   // return stations;
  // }

  async findAllAsync(
    page: number,
    limit: number,
    search?: string,
    sortBy: string = "name",
    order: string = "asc"
  ): Promise<Station[]> {
    // Khởi tạo query builder từ Knex
    const query = db<Station>("stations");

    // Nếu có search, tìm kiếm trên các cột 'name' và 'location'
    if (search) {
      query.where((qb) => {
        qb.where("name", "like", `%${search}%`)
          .orWhere("location", "like", `%${search}%`);
      });
    }

    // Thêm điều kiện sắp xếp, mặc định là theo 'name' và 'asc'
    if (["name", "location", "created_at", "updated_at"].includes(sortBy) && ["asc", "desc"].includes(order)) {
      query.orderBy(sortBy, order);
    } else {
      // Nếu không hợp lệ, fallback về mặc định
      query.orderBy("name", "asc");
    }

    // Thêm điều kiện phân trang
    query.offset((page - 1) * limit).limit(limit);

    // Thực hiện truy vấn và trả về kết quả
    const rows = await db<Station>("stations").select("*");
    return rows as Station[];

  }

  // Tìm Station theo ID
  async findByIdAsync(id: number): Promise<Station | null> {
    const station = await db<Station>("stations")
      .where({ id })
      .first();

    return station ?? null;
  }

  async createAsync(station: Omit<Station, "id">): Promise<number> {
    const [newId] = await db<Station>("stations").insert(station);
    return newId;
  }

  async updateAsync(id: number, station: Partial<Station>): Promise<boolean> {
    const updatedRows = await db<Station>("stations")
      .where({ id })
      .update(station);
    return updatedRows > 0;
  }

  async deleteAsync(id: number): Promise<boolean> {
    const deletedRows = await db<Station>("stations")
      .where({ id })
      .del();
    return deletedRows > 0;
  }
}
