import express, { type Router } from "express";
import { z } from "zod";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

import { authenticate } from "@/common/middleware/auth/authMiddleware";
import { permission } from "@/common/middleware/auth/permission";
import { validateRequest } from "@/common/utils/httpHandlers";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";

import { bannerController } from "./bannerController";
import { BannerSchema } from "./bannerModel";

export const discountBannerRegistry = new OpenAPIRegistry();
export const discountBannerRouter: Router = express.Router();

// Đăng ký schema với OpenAPI
discountBannerRegistry.register("Banner", BannerSchema);

/**
 * GET /banners/featured
 * Lấy danh sách banner ưu đãi nổi bật theo vị trí (position)
 */
discountBannerRegistry.registerPath({
  method: "get",
  path: "/disount-banners",
  tags: ["Banner"],
  summary: "Lấy danh sách banner ưu đãi nổi bật theo vị trí",
  parameters: [
    {
      name: "position",
      in: "query",
      required: false,
      schema: {
        type: "string",
      },
      description: "Vị trí banner để lọc (TOP, BOTTOM, LEFT, RIGHT)",
    },
  ],

  responses: createApiResponse(
    z.array(BannerSchema),
    "Danh sách banner ưu đãi nổi bật"
  ),
});


// Router định nghĩa route
discountBannerRouter.get(
  "/disount-banners",
  // authenticate,
  // permission,
  // Nếu cần validate query param, có thể dùng validateRequest ở đây
  // validateRequest({
  //   query: z.object({ position: z.string().optional() }),
  // }),
  bannerController.getFeaturedBanners
);
