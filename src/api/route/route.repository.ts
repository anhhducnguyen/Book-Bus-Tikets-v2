import type { Route } from "@/api/route/route.model";
import { db } from "@/common/config/database";

// Dữ liệu mẫu tuyến đường (sample routes)
export const sampleRoutes: Route[] = [
  {
    id: 1,
    departure_station_id: 1,
    arrival_station_id: 2,
    price: 150000,
    duration: 180, // 3 hours
    distance: 120, // 120 km
    created_at: new Date(),
    updated_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
  },
  {
    id: 2,
    departure_station_id: 2,
    arrival_station_id: 3,
    price: 200000,
    duration: 240, // 4 hours
    distance: 180, // 180 km
    created_at: new Date(),
    updated_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days later
  },
  {
    id: 3,
    departure_station_id: 1,
    arrival_station_id: 3,
    price: 250000,
    duration: 300, // 5 hours
    distance: 240, // 240 km
    created_at: new Date(),
    updated_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days later
  },
];

// Định nghĩa kiểu trả về cho count
interface CountResult {
  count: string;
}

// Class RouteRepository để tương tác với cơ sở dữ liệu
export class RouteRepository {
  // Lấy tất cả tuyến đường
  async findAllAsync(): Promise<Route[]> {
    const rows = await db<Route>("routes").select("*");
    return rows as Route[];
    // return sampleRoutes;
  }

  // Tìm một tuyến đường theo ID
  async findByIdAsync(id: number): Promise<Route | null> {
    const route = await db<Route>("routes").where({ id }).first();
    return route ?? null;
  }

  // Thêm dữ liệu mẫu vào bảng routes (dùng cho mục đích testing)
  async insertSampleRoutes(): Promise<void> {
    // Kiểm tra xem bảng routes đã có dữ liệu chưa
    const routesCount = await db<Route>("routes").count("* as count").first<CountResult>();

    // Kiểm tra kiểu trả về đúng và truy xuất count
    if (routesCount && routesCount.count === "0") {
      // Chỉ insert dữ liệu mẫu nếu bảng routes rỗng
      await db<Route>("routes").insert(sampleRoutes);
      console.log("Sample routes inserted into the database.");
    } else {
      console.log("Routes data already exists.");
    }
  }
}