import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";

import { routesController } from "@/api/popularRoute/popularRouteController"; // Controller để xử lý logic route
import { RoutesSchema, CreateRoutesSchema } from "./popularRouteModel"; // Schema Zod cho routes

// Khởi tạo OpenAPI registry
export const popularRouteRegistry = new OpenAPIRegistry();

// Khởi tạo router
export const popularRouteRouter: Router = express.Router();

// Đăng ký schema OpenAPI cho Routes
popularRouteRegistry.register("Routes", RoutesSchema);

// Tìm tuyến đường phổ biến nhất
popularRouteRegistry.registerPath({
  method: "get",
  path: "/popular-route",
  tags: ["Statistical"],
  operationId: "getMostPopularRoute",  // Thay 'operation' bằng 'operationId'
  summary: "Lấy tuyến đường phổ biên",  // Mô tả ngắn gọn về API
  responses: {
    200: {
      description: "Most popular route found successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "number" },
              departure_station: { type: "number" },
              arrival_station: { type: "number" },
              price: { type: "number" },
              image: { type: "string" },
              duration: { type: "number" },
              distance: { type: "number" },
              trip_count: { type: "number" },  // Số chuyến đi cho tuyến đường này
              createdAt: { type: "string", format: "date-time" },
              updatedAt: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    404: {
      description: "No popular route found",
    },
    500: {
      description: "Internal server error",
    },
  },
});
popularRouteRouter.get("/popular-route", routesController.getMostPopularRouteBySchedules);