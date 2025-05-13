import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { BookTicketInputSchema, CancelTicketSchema, RouteSchema, BusSchema, SeatSchema, TicketSchema } from "@/api/ticket/ticketModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { ticketController } from "./ticketController";

import { permission } from "@/common/middleware/auth/permission";
import { authenticate } from "@/common/middleware/auth/authMiddleware";

export const ticketRegistry = new OpenAPIRegistry();
export const ticketRouter: Router = express.Router();

ticketRouter.use(authenticate);

// Lựa chọn tuyến đường đi
ticketRegistry.registerPath({
  method: "get",
  path: "/routes",
  tags: ["Ticket"],
  responses: createApiResponse(z.array(RouteSchema), "Success"),
});
ticketRouter.get("/routes", ticketController.getRoutes);

// Lựa chọn xe đi
ticketRegistry.registerPath({
  method: "get",
  path: "/routes/:routeId/buses",
  tags: ["Ticket"],
  request: { params: z.object({ routeId: commonValidations.id }) },
  responses: createApiResponse(z.array(BusSchema), "Success"),
});
ticketRouter.get("/routes/:routeId/buses", ticketController.getBusesByRoute);

// Lựa chọn ghế đi
ticketRegistry.registerPath({
  method: "get",
  path: "/buses/:busId/seats",
  tags: ["Ticket"],
  request: { params: z.object({ busId: commonValidations.id }) },
  responses: createApiResponse(z.array(SeatSchema), "Success"),
});
ticketRouter.get("/buses/:busId/seats", ticketController.getAvailableSeats);

// Đặt vé
ticketRegistry.registerPath({
  method: "post",
  path: "/tickets",
  tags: ["Ticket"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: BookTicketInputSchema, // Sử dụng schema đầu vào trực tiếp
        },
      },
    },
  },
  responses: createApiResponse(TicketSchema, "Success"),
});
ticketRouter.post("/tickets", ticketController.bookTicket);

// Hủy vé
ticketRegistry.registerPath({
  method: "delete",
  path: "/tickets/:ticketId",
  tags: ["Ticket"],
  request: { params: CancelTicketSchema.shape.params },
  responses: createApiResponse(z.void(), "Success"),
});
ticketRouter.delete("/tickets/:ticketId", validateRequest(CancelTicketSchema), ticketController.cancelTicket);

// Lịch sử đặt vé theo trạng thái
ticketRegistry.registerPath({
  method: "get",
  path: "/history/:status",
  tags: ["Ticket"],
  request: {
    params: z.object({
      status: z.enum(["BOOKED", "CANCELLED"]),
    }),
  },
  responses: createApiResponse(z.array(TicketSchema), "Success"),
});

// Thêm route mới: Lịch sử đặt vé theo nhà xe
ticketRegistry.registerPath({
  method: "get",
  path: "/tickets/history/:companyId",
  tags: ["Ticket"],
  request: {
    params: z.object({
      companyId: z.string().regex(/^\d+$/, "Company ID must be a numeric string"),
    }),
  },
  responses: createApiResponse(z.array(TicketSchema), "Success"),
});
ticketRouter.get("/history/:status", ticketController.getTicketsByStatus);

ticketRouter.get("/tickets/history/:companyId", ticketController.getTicketsByCompany);

// Xem tất cả lịch sử đặt vé
ticketRegistry.registerPath({
  method: "get",
  path: "/tickets/history",
  tags: ["Ticket"],
  responses: createApiResponse(z.array(TicketSchema), "Success"),
});
ticketRouter.get("/tickets/history", ticketController.getTicketHistory);
