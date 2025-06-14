// findArrivalRoute.ts
import express, { Router } from "express";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

import { scheduleController } from "./findArrivalController";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { SearchScheduleByStation, ScheduleSchema } from "./findArrivalModel";

export const findArrivalRegistry = new OpenAPIRegistry();
export const findArrivalRouter: Router = express.Router();

// Đăng ký endpoint vào OpenAPI
findArrivalRegistry.registerPath({
    method: "get",
    path: "/search/find-arrival",
    operationId: "searchSchedulesByStationName",
    summary: "(Khách vãng lai) Tìm kiếm lịch trình theo tên điểm đón, điểm đến và ngày khởi hành",
    description: `Trường dữ liệu trả về:
    - id: ID của lịch trình

    - bus_id: ID của xe

    - route_id: ID của tuyến đường

    - departure_time: Thời gian khởi hành

    - arrival_time: Thời gian đến   

    - available_seats: Số ghế còn trống

    - total_seats: Tổng số ghế

    - status: Trạng thái của lịch trình`,
    tags: ["Statistical"],
    request: {
        query: SearchScheduleByStation,
    },
    responses: createApiResponse(
        ScheduleSchema.array(),
        "Danh sách lịch trình phù hợp"
    ),
});

// Router Express
findArrivalRouter.get("/find-arrival", scheduleController.search);
