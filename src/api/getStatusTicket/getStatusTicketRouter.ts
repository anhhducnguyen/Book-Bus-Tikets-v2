import express, { type Router } from "express";
import { z } from "zod";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";

import { authenticate } from "@/common/middleware/auth/authMiddleware";
import { permission } from "@/common/middleware/auth/permission";
import { validateRequest } from "@/common/utils/httpHandlers";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";

import { ticketController } from "./getStatusTicketController";
import { TicketSchema, TicketStatsSchema } from "./getStatusTicketModel";

export const getStatusTicketRegistry = new OpenAPIRegistry();
export const getStatusTicketRouter: Router = express.Router();

// Yêu cầu đăng nhập trước khi dùng router
// ticketRouter.use(authenticate);

getStatusTicketRegistry.register("Ticket", TicketSchema);
getStatusTicketRegistry.register("TicketStatusStatistic", TicketStatsSchema);

/**
 * GET /tickets/status-statistics
 * Trả về thống kê trạng thái vé: BOOKED, CANCELLED
 */
getStatusTicketRegistry.registerPath({
    method: "get",
    path: "/status-statistics",
    tags: ["Statistical"],
    summary: "Thống kê trạng thái vé (BOOKED, CANCELLED)",
    responses: createApiResponse(
        z.array(TicketStatsSchema),
        "Success"
    ),
});

getStatusTicketRouter.get(
    "/status-statistics",
    authenticate,
    permission,
    ticketController.getStatusStatistics
);
