import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders"; // Bạn đã xây dựng hàm này cho OpenAPI response
import { validateRequest } from "@/common/utils/httpHandlers"; // Nếu bạn muốn validate request data
import { routesController } from "@/api/routes/routesController"; // Controller để xử lý logic route
import { RoutesSchema, CreateRoutesSchema } from "./routesModel"; // Schema Zod cho routes

// Khởi tạo OpenAPI registry
export const routesRegistry = new OpenAPIRegistry();

// Khởi tạo router
export const routesRouter: Router = express.Router();

// Đăng ký schema OpenAPI cho Routes
routesRegistry.register("Routes", RoutesSchema);

// Đăng ký đường dẫn cho OpenAPI với method 'get'
routesRegistry.registerPath({
  method: "get",
  path: "/routes",
  tags: ["Routes"],
  responses: createApiResponse(z.array(RoutesSchema), "Success"),
});

// Đăng ký handler cho GET /routes
routesRouter.get("/", routesController.getAllRoutes);
//them moi tuyen duong 
routesRegistry.registerPath({
    method: "post",
    path: "/routes",
    operationId: "createRoutes",  // Thay 'operation' bằng 'operationId'
    summary: "Create a new Routes",  // Thêm phần mô tả ngắn gọn về API
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              departure_station_id: { type: "number" },
              arrival_station_id:{type:"number"},
              price:{type:"number"},
              duration:{type:"number"},
              distance: {type:"number"},
            },
            required: ["name", "email", "age"],
          },
        },
      },
    },
    responses: {
      201: {
        description: "User created successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                id: { type: "number" },
                name: { type: "string" },
                email: { type: "string" },
                age: { type: "number" },
                createdAt: { type: "string", format: "date-time" },
                updatedAt: { type: "string", format: "date-time" },
              },
            },
          },
        },
      },
      400: {
        description: "Invalid input data",
      },
      500: {
        description: "Internal server error",
      },
    },
  });
 routesRouter.post("/", validateRequest(CreateRoutesSchema), routesController.createRoutes);
 routesRouter.put("/:id", validateRequest(CreateRoutesSchema), routesController.updateRoutes);
 routesRouter.delete("/:id", routesController.deleteRoutes);
