import express, { type Router } from "express";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { busReviewController } from "./getBus_reviewController";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";

import { authenticate } from "@/common/middleware/auth/authMiddleware";
import { permission } from "@/common/middleware/auth/permission";

// Khởi tạo registry OpenAPI
export const getBus_reviewRegistry = new OpenAPIRegistry();

// Tạo router express
export const getBus_reviewRouter: Router = express.Router();

// Bảo vệ route


// === Thống kê đánh giá theo nhà xe ===
getBus_reviewRegistry.registerPath({
    method: "get",
    path: "/reviewbus-companies/review-stats",
    operationId: "getReviewStatsByCompany",

    summary: "Thống kê đánh giá (tích cực, tiêu cực) theo nhà xe",
    description: `Trường dữ liệu trả về:
    - **company_i**: ID của nhà xe

    - **company_name**: Tên nhà xe

    - **positive_reviews**: Số lượng đánh giá tích cực
    
    - **negative_reviews**: Số lượng đánh giá tiêu cực`,
    tags: ["Statistical"],
    responses: createApiResponse(
        z.array(
            z.object({
                company_id: z.number(),
                company_name: z.string(),
                positive_reviews: z.number(),
                negative_reviews: z.number(),
            })
        ),
        "Lấy thống kê đánh giá thành công"
    ),
});

getBus_reviewRouter.get(
    "/reviewbus-companies/review-stats",
    authenticate,
    permission,
    busReviewController.getReviewStatsByCompany
);

