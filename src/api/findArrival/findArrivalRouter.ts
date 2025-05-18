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
    summary: "Tìm kiếm lịch trình theo tên điểm đón, điểm đến và ngày khởi hành",
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
