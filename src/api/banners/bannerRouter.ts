import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders"; // Bạn đã xây dựng hàm này cho OpenAPI response
import { validateRequest } from "@/common/utils/httpHandlers"; // Nếu bạn muốn validate request data
import { bannerController } from "@/api/banners/bannerController"; // Controller để xử lý logic route
import { BannerSchema, CreateBannerSchema } from "./bannerModel"; // Schema Zod cho routes

// Khởi tạo OpenAPI registry
export const bannerRegistry = new OpenAPIRegistry();

// Khởi tạo router
export const bannerRouter: Router = express.Router();

// Đăng ký schema OpenAPI cho Routes
bannerRegistry.register("Routes", BannerSchema);

// Đăng ký đường dẫn cho OpenAPI với method 'get'
bannerRegistry.registerPath({
  method: "get",
  path: "/banners",
  tags: ["banner"],
  responses: createApiResponse(z.array(BannerSchema), "Success"),
});

// Đăng ký handler cho GET /banner
bannerRouter.get("/", bannerController.getAllBanner);
//them moi tuyen duong 
bannerRegistry.registerPath({
    method: "post",
    path: "/banner",
    operationId: "createBanner",  // Thay 'operation' bằng 'operationId'
    summary: "Create a new Banner",  // Thêm phần mô tả ngắn gọn về API
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
 bannerRouter.post("/", validateRequest(CreateBannerSchema), bannerController.createBanner);
 
 bannerRouter.delete("/:id", bannerController.deleteBanner);
