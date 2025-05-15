import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders"; // Bạn đã xây dựng hàm này cho OpenAPI response
import { validateRequest } from "@/common/utils/httpHandlers"; // Nếu bạn muốn validate request data
import { bannerController } from "./bannerController"; // Controller để xử lý logic route
import { BannerSchema, CreateBannerSchema } from "./bannerModel"; // Schema Zod cho routes

// Khởi tạo OpenAPI registry
export const discountBannerRegistry = new OpenAPIRegistry();

// Khởi tạo router
export const discountBannerRouter: Router = express.Router();

// Đăng ký schema OpenAPI cho Routes
discountBannerRegistry.register("Routes", BannerSchema);

//Đăng ký đường dẫn cho OpenAPI với method 'get' getLatestBannerById
discountBannerRegistry.registerPath({
  method: "get",
  path: "/discount-banner/{position}",
  tags: ["banners"],
  operationId: "getLatestBannerById",
  summary: "Get the latest banner by position",
  parameters: [
    {
      name: "position",
      in: "path",
      required: true,
      description: "Position of the banner (e.g., homepage, footer, sidebar)",
      schema: {
        type: "string",
        example: "homepage"
      }
    }
  ],
  responses: {
    200: {
      description: "Banner fetched successfully",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: { type: "number", example: 101 },
              banner_url: { type: "string" },
              position: { type: "string" },
              created_at: { type: "string" }
            }
          }
        }
      }
    },
    404: {
      description: "No banner found for the specified position"
    },
    500: {
      description: "Internal server error"
    }
  }
});
// Đăng ký handler cho GET /banners/:id
discountBannerRouter.get("/:position", bannerController.getLatestBannerById);



