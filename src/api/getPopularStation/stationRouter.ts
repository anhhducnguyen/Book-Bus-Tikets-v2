import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";

import { stationController } from "./stationController";
import { StationSchema } from "./stationModel";

// Khởi tạo OpenAPI registry
export const getPopularStationRegistry = new OpenAPIRegistry();

// Khởi tạo router
export const getPopularStationRouter: Router = express.Router();

// Đăng ký schema OpenAPI cho Station
getPopularStationRegistry.register("Station", StationSchema);

// Đăng ký endpoint: GET /stations/popular
getPopularStationRegistry.registerPath({
    method: "get",
    path: "/get-popular-station",
    tags: ["Statistical"],
    operationId: "getMostPopularStations",
    summary: "(Khách vãng lai) Lấy danh sách bến xe phổ biến nhất theo số lượng lịch trình",
    description: `Trường dữ liệu trả về:

    - station_id: ID của bến xe

    - station_name: Tên của bến xe

    - image: URL ảnh đại diện
    
    - schedule_count: Số lượng lịch trình của bến xe`,
    responses: {
        200: {
            description: "Lấy danh sách bến xe phổ biến thành công",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            message: { type: "string" },
                            stations: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        station_id: { type: "number" },
                                        station_name: { type: "string" },
                                        station_image: { type: "string" },
                                        schedule_count: { type: "number" },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        404: {
            description: "Không tìm thấy bến xe phổ biến nào",
        },
        500: {
            description: "Lỗi server nội bộ",
        },
    },
});

// Khai báo route handler
getPopularStationRouter.get("/get-popular-station", stationController.getMostPopularRouteBySchedules);
