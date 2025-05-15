import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders"; // Bạn đã xây dựng hàm này cho OpenAPI response
import { validateRequest } from "@/common/utils/httpHandlers"; // Nếu bạn muốn validate request data
import { routesController } from "@/api/routes/routesController"; // Controller để xử lý logic route
import { BusReviewSchema, CreateBusReviewSchema } from "@/api/bus_reviews/busReviewModel"; // Schema Zod cho routes
import { busReviewController } from "./busReviewController";

import { permission } from "@/common/middleware/auth/permission";
import { authenticate } from "@/common/middleware/auth/authMiddleware";

// Khởi tạo OpenAPI registry
export const busReviewRegistry = new OpenAPIRegistry();

// Khởi tạo router
export const busReviewRouter: Router = express.Router();

busReviewRouter.use(authenticate);

// Đăng ký schema OpenAPI cho Routes
busReviewRegistry.register("BusReview", BusReviewSchema);

// Đăng ký đường dẫn cho OpenAPI với method 'get'

busReviewRegistry.registerPath({
  method: "get",
  path: "/bus-reviews",
  operationId: "getAllBusReview",
  summary: "Lấy danh sách đánh giá xe có hỗ trợ phân trang, tìm kiếm và lọc",
  tags: ["Bus reviews"],
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
      name: "bus_id",
      in: "query",
      required: false,
      schema: { type: "number" },
      description: "Tìm review theo bus_id",
    },
    {
      name: "user_id",
      in: "query",
      required: false,
      schema: { type: "number" },
      description: "Tìm review theo user_id",
    },
    {
      name: "rating",
      in: "query",
      required: false,
      schema: { type: "number" },
      description: "Tìm review theo rating",
    },
    {
      name: "bus_name",
      in: "query",
      required: false,
      schema: { type: "string" },
      description: "Tìm review theo string",
    },
     {
      name: "company_name",
      in: "query",
      required: false,
      schema: { type: "string" },
      description: "Tìm review nha xe",
    },
    {
      name: "sortBy",
      in: "query",
      required: false,
      schema: {
        type: "string",
        enum: ['rating' , 'created_at' , 'updated_at'],
      },
      description: "Sắp xếp theo trường ('rating' | 'created_at' | 'updated_at')",
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
  responses: createApiResponse(z.array(BusReviewSchema), "Thành công"),
});
// Đăng ký handler cho GET /routes
busReviewRouter.get("/", permission, busReviewController.getAllBusReview);
//them moi review
busReviewRegistry.registerPath({
    method: "post",
    path: "/bus-reviews",
     tags: ["Bus reviews"],
    operationId: "createBusReview",  // Thay 'operation' bằng 'operationId'
    summary: "Thêm mới đánh giá xe",  // Thêm phần mô tả ngắn gọn về API
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              
              bus_id: {type: "number"},
              user_id: {type: "number"},
              rating: {type: "number"},
              review: {type: "string"},
            },
            required: ["bus_id", "user_id", "rating", "review"],
          },
        },
      },
    },
    responses: {
      201: {
        description: "Review created successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                bus_id: {type: "number"},
                user_id: {type: "number"},
                rating: {type: "number"},
                review: {type: "string"},
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
  //update review
 busReviewRouter.post("/", validateRequest(CreateBusReviewSchema), busReviewController.createBusReview);
 busReviewRegistry.registerPath({
   method: "delete",
   path: "/bus-reviews/{id}",
    tags: ["Bus reviews"],
   operationId: "deleteBusReview",
   summary: "Xóa đánh giá xe theo ID",
   
   parameters: [
     {
       name: "id",
       in: "path",
       required: true,
       schema: { type: "integer" },
       description: "ID của BusReview cần xóa",
     },
   ],
   responses: {
     200: {
       description: "BusReview đã được xóa thành công",
       content: {
         "application/json": {
           schema: BusReviewSchema,
         },
       },
     },
     404: {
       description: "Không tìm thấy BusReview",
     },
     500: {
       description: "Lỗi server nội bộ",
     },
   },
 });
 //xoa review
 busReviewRouter.delete("/:id", busReviewController.deleteBusReview);
