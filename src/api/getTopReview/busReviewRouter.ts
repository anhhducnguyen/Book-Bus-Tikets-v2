import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders"; // Bạn đã xây dựng hàm này cho OpenAPI response
import { validateRequest } from "@/common/utils/httpHandlers"; // Nếu bạn muốn validate request data
import { BusReviewSchema } from "./busReviewModel"; // Schema Zod cho routes
import { busReviewController } from "./busReviewController";

// Khởi tạo OpenAPI registry
export const getTopReviewRegistry = new OpenAPIRegistry();

// Khởi tạo router
export const getTopReviewRouter: Router = express.Router();

// Đăng ký schema OpenAPI cho Routes
getTopReviewRegistry.register("BusReview", BusReviewSchema);

// Đăng ký đường dẫn cho OpenAPI với method 'get'

getTopReviewRegistry.registerPath({
    method: "get",
    path: "/top/{arrivalStationId}",
    tags: ["Statistical"],
    operationId: "getTopReviewedRoutesByDestination",
    summary: "(Khách vãng lai) Lấy danh sách tuyến có đánh giá cao nhất theo điểm đến",
    description: `Trường dữ liệu trả về:

    - route_id: ID của tuyến đường

    - departure_station_id: ID của trạm khởi hành

    - arrival_station_id: ID của trạm đến

    - average_rating: Điểm đánh giá trung bình
    
    - review_count: Số lượng đánh giá
    `,
    parameters: [
        {
            name: "arrivalStationId",
            in: "path",
            required: true,
            schema: { type: "integer" },
            description: "ID của trạm đến",
        },
    ],
    responses: {
        200: {
            description: "Danh sách tuyến có đánh giá cao nhất",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            topRoutes: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        route_id: { type: "number" },
                                        departure_station_id: { type: "number" },
                                        arrival_station_id: { type: "number" },
                                        average_rating: { type: "number" },
                                        review_count: { type: "number" },
                                    },
                                },
                            },
                            message: { type: "string" },
                        },
                    },
                },
            },
        },
        400: { description: "Dữ liệu đầu vào không hợp lệ" },
        500: { description: "Lỗi hệ thống" },
    },
});

getTopReviewRouter.get("/top/:arrivalStationId", busReviewController.getTopReviews); 
