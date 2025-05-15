import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders"; // Bạn đã xây dựng hàm này cho OpenAPI response
import { validateRequest } from "@/common/utils/httpHandlers"; // Nếu bạn muốn validate request data
import { bannerController } from "@/api/banners/bannerController"; // Controller để xử lý logic route
import { BannerSchema, CreateBannerSchema } from "./bannerModel"; // Schema Zod cho routes

import { permission } from "@/common/middleware/auth/permission";
import { authenticate } from "@/common/middleware/auth/authMiddleware";

// Khởi tạo OpenAPI registry
export const bannerRegistry = new OpenAPIRegistry();

// Khởi tạo router
export const bannerRouter: Router = express.Router();

bannerRouter.use(authenticate);

// Đăng ký schema OpenAPI cho Routes
bannerRegistry.register("Routes", BannerSchema);

// Đăng ký đường dẫn cho OpenAPI với method 'get'
bannerRegistry.registerPath({
  method: "get",
  path: "/banners",
  operationId: "getAllBanners",
  summary: "Lấy danh sách banner có hỗ trợ phân trang, tìm kiếm và lọc",
  tags: ["Banners"],
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
      name: "banner",
      in: "query",
      required: false,
      schema: { type: "string" },
      description: "Tìm theo đường dẫn banner (banner_url)",
    },
    {
      name: "position",
      in: "query",
      required: false,
      schema: { type: "string" },
      description: "Tìm theo vị trí hiển thị banner",
    },
    {
      name: "sortBy",
      in: "query",
      required: false,
      schema: {
        type: "string",
        enum: ["position", "banner_url"],
      },
      description: "Sắp xếp theo trường (position hoặc banner_url)",
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
  responses: createApiResponse(z.array(BannerSchema), "Thành công"),
});

// Đăng ký handler cho GET /banner
bannerRouter.get(
  "/",
  permission, 
  bannerController.getAllBanner
);
//them moi banner

bannerRegistry.registerPath({
    method: "post",
    path: "/banners",
    tags: ["Banners"],
    operationId: "createBanner",  // Thay 'operation' bằng 'operationId'
    summary: "Thêm mới banner",  // Thêm phần mô tả ngắn gọn về API
    requestBody: {
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              banner_url: { type: "string" },
              position:{type:"string"},
              
            },
            required: ["banner_url", "position"],
          },
        },
      },
    },
    responses: {
      201: {
        description: "banner created successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                id: { type: "number" },
                banner_url: { type: "string" },
                position: { type: "string" },
               
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

 bannerRouter.post("/", permission, validateRequest(CreateBannerSchema), bannerController.createBanner);
 bannerRegistry.registerPath({
  method: "delete",
  path: "/banners/{id}",
  operationId: "deleteBanner",
  summary: "Xóa banner theo ID",
  tags: ["Banners"],
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
          schema: BannerSchema,
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
//xoa 1 banner
 bannerRouter.delete("/:id", permission, bannerController.deleteBanner);
