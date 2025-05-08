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
  async findAllAsync(): Promise<Station[]> {
    const rows = await db<Station>("stations").select("*");
    return rows as Station[];
    // return stations;
  }

  // Tìm Station theo ID
  async findByIdAsync(id: number): Promise<Station | null> {
    const station = await db<Station>("stations")
      .where({ id })
      .first();

    return station ?? null;
  }
}
