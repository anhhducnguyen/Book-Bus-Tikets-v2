import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

// === Schema query params tìm kiếm lịch trình theo tên bến ===
export const SearchScheduleByStation = z.object({
    departureStationName: z
        .string()
        .min(1, "Tên điểm đón không được để trống")
        .openapi({ description: "Tên bến xe điểm đón" }),
    arrivalStationName: z
        .string()
        .min(1, "Tên điểm đến không được để trống")
        .openapi({ description: "Tên bến xe điểm đến" }),
    departureDate: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày phải theo định dạng YYYY-MM-DD")
        .openapi({ description: "Ngày khởi hành (YYYY-MM-DD)" }),
});

// === Schema cho dữ liệu trả về: lịch trình ===
export const ScheduleSchema = z.object({
    id: z.number().openapi({ description: "ID lịch trình" }),
    route_id: z.number().openapi({ description: "ID tuyến đường" }),
    bus_id: z.number().openapi({ description: "ID xe" }),
    departure_time: z
        .string()
        .openapi({ description: "Thời gian khởi hành (datetime ISO)" }),
    arrival_time: z
        .string()
        .openapi({ description: "Thời gian đến (datetime ISO)" }),
    available_seat: z.number().openapi({ description: "Số ghế còn trống" }),
    total_seats: z.number().openapi({ description: "Tổng số ghế trên xe" }),
    status: z
        .enum(["AVAILABLE", "FULL", "CANCELLED"])
        .openapi({ description: "Trạng thái lịch trình" }),
    created_at: z.string().openapi({ description: "Ngày tạo" }),
    updated_at: z.string().openapi({ description: "Ngày cập nhật" }),
});
