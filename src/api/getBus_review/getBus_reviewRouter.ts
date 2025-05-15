import express, { type Router } from "express";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { busReviewController } from "./getBus_reviewController";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";


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
    tags: ["Bus Reviews"],
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
    busReviewController.getReviewStatsByCompany
);

