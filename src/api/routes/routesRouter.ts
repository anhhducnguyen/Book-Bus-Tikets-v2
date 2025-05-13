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
// 


// Đăng ký handler cho GET /routes
routesRegistry.registerPath({
  method: "get",
  path: "/routes",
  operationId: "getAllRoutes",
  summary: "Lấy danh sách routes có hỗ trợ phân trang, tìm kiếm và lọc",
  tags: ["Routes"],
  parameters: [
    {
      name: "page",
      in: "query",
      required: false,
      schema: { type: "integer", minimum: 1 },
      description: "Số trang (mặc định: 1)",
    },
    {
      name: "limit",
      in: "query",
      required: false,
      schema: { type: "integer", minimum: 1 },
      description: "Số lượng bản ghi mỗi trang (mặc định: 10)",
    },
    {
      name: "departure_station_id",
      in: "query",
      required: false,
      schema: { type: "number" },
      description: "Tìm theo departure_station",
    },
    {
      name: "arrival_station_id",
      in: "query",
      required: false,
      schema: { type: "number" },
      description: "Tìm theo vị trí hiển thị arrival_station",
    },
    {
      name: "sortBy",
      in: "query",
      required: false,
      schema: {
        type: "string",
        enum: ['price' , 'duration' , 'distance' , 'created_at'],
      },
      description: "Sắp xếp theo trường ('price' | 'duration' | 'distance' | 'created_at')",
    },
    {
      name: "order",
      in: "query",
      required: false,
      schema: {
        type: "string",
        enum: ["asc", "desc"],
      },
      description: "Thứ tự sắp xếp (tăng dần hoặc giảm dần)",
    },
  ],
  responses: createApiResponse(z.array(RoutesSchema), "Thành công"),
});
routesRouter.get("/", routesController.getAllRoutes);
//them moi tuyen duong 
routesRegistry.registerPath({
    method: "post",
    path: "/routes",
    tags: ["Routes"],
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
 //update tuyen duong theo id
 routesRouter.put("/:id", validateRequest(CreateRoutesSchema), routesController.updateRoutes);
 //Xoa tuyen duong
 routesRegistry.registerPath({
   method: "delete",
   path: "/routes/{id}",
   operationId: "deleteRoutes",
   summary: "Xóa routes theo ID",
   tags: ["Routes"],
   parameters: [
     {
       name: "id",
       in: "path",
       required: true,
       schema: { type: "integer" },
       description: "ID của banner cần xóa",
     },
   ],
   responses: {
     200: {
       description: "Banner đã được xóa thành công",
       content: {
         "application/json": {
           schema: RoutesSchema,
         },
       },
     },
     404: {
       description: "Không tìm thấy banner",
     },
     500: {
       description: "Lỗi server nội bộ",
     },
   },
 });
 routesRouter.delete("/:id", routesController.deleteRoutes);
