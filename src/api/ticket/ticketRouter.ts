import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { BookTicketInputSchema, CancelTicketSchema, RouteSchema, BusSchema, SeatSchema, TicketSchema, TicketSearchSchema, TicketSearchQueryOnly } from "@/api/ticket/ticketModel";
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
  path: "/tickets/routes",
  tags: ["Ticket"],
  summary: "Lựa chọn tuyến đường đi",
  responses: createApiResponse(z.array(RouteSchema), "Success"),
});
ticketRouter.get("/routes", ticketController.getRoutes);

// Lựa chọn xe đi
ticketRegistry.registerPath({
  method: "get",
  path: "/tickets/routes/{routeId}/buses",
  tags: ["Ticket"],
  summary: "Lựa chọn xe đi",
  request: { params: z.object({ routeId: commonValidations.id }) },
  responses: createApiResponse(z.array(BusSchema), "Success"),
});
ticketRouter.get("/routes/:routeId/buses", ticketController.getBusesByRoute);

// Lựa chọn ghế đi
ticketRegistry.registerPath({
  method: "get",
  path: "/tickets/buses/{busId}/seats",
  tags: ["Ticket"],
  summary: "Lựa chọn ghế đi",
  request: { params: z.object({ busId: commonValidations.id }) },
  responses: createApiResponse(z.array(SeatSchema), "Success"),
});
ticketRouter.get("/buses/:busId/seats", ticketController.getAvailableSeats);

// Đặt vé
ticketRegistry.registerPath({
  method: "post",
  path: "/tickets/booking",
  tags: ["Ticket"],
  summary: "Đặt vé",
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
ticketRouter.post("/booking", ticketController.bookTicket);

// Hủy vé
ticketRegistry.registerPath({
  method: "delete",
  path: "/tickets/cancel/{ticketId}",
  tags: ["Ticket"],
  summary: "Hủy vé",
  request: { params: CancelTicketSchema.shape.params },
  responses: createApiResponse(
    z.null().openapi({ description: "No content" }),
    "Success"
  ),
});
ticketRouter.delete("/cancel/:ticketId", validateRequest(CancelTicketSchema), ticketController.cancelTicket);


// Lịch sử đặt vé theo trạng thái
ticketRegistry.registerPath({
  method: "get",
  path: "/tickets/history_status/{status}",
  tags: ["Ticket"],
  summary: "Lịch sử đặt vé theo trạng thái",
  request: {
    params: z.object({
      status: z.enum(["BOOKED", "CANCELLED"]),
    }),
  },
  responses: createApiResponse(z.array(TicketSchema), "Success"),
});
ticketRouter.get("/history_status/:status", ticketController.getTicketsByStatus);

// Lịch sử đặt vé theo nhà xe
ticketRegistry.registerPath({
  method: "get",
  path: "/tickets/history_companyid/{companyId}",
  tags: ["Ticket"],
  summary: "Lịch sử đặt vé theo nhà xe",
  request: {
    params: z.object({
      companyId: z.string().regex(/^\d+$/, "Company ID must be a numeric string"),
    }),
  },
  responses: createApiResponse(z.array(TicketSchema), "Success"),
});
ticketRouter.get("/history_companyid/:companyId", ticketController.getTicketsByCompany);

// Xem tất cả lịch sử đặt vé
ticketRegistry.registerPath({
  method: "get",
  path: "/tickets/history",
  tags: ["Ticket"],
  summary: "Xem tất cả lịch sử đặt vé",
  responses: createApiResponse(z.array(TicketSchema), "Success"),
});
ticketRouter.get("/history", ticketController.getTicketHistory);

// Thêm mới thông tin hủy vé xe dành cho admin
ticketRegistry.registerPath({
  method: "post",
  path: "/tickets/cancel_ticket/add",
  tags: ["Ticket"],
  summary: "Thêm mới thông tin hủy vé xe dành cho admin",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.object({
            ticketId: z.string().regex(/^\d+$/, "Ticket ID must be a numeric string"),
          }),
        },
      },
    },
  },
  responses: createApiResponse(z.any(), "Success"),
});
ticketRouter.post("/cancel_ticket/add", ticketController.createCancelTicket);

// Hiển thi danh sách thông tin hủy theo vé xe
ticketRegistry.registerPath({
  method: "get",
  path: "/tickets/cancel_ticket/list",
  tags: ["Ticket"],
  summary: "Hiển thi danh sách thông tin hủy theo vé xe cho admin",
  request: {
    params: z.object({}).strict(), // Không cần tham số
  },
  responses: createApiResponse(z.array(TicketSchema), "Success"),
});
ticketRouter.get("/cancel_ticket/list", ticketController.getCancelledTickets);

//  Tra cứu vé xe bằng mã vé với số điện thoại
ticketRegistry.registerPath({
  method: "get",
  path: "/tickets/search",
  tags: ["Ticket"],
  operationId: "searchTicket",
  summary: "Tra cứu vé xe bằng mã vé và số điện thoại",
  request: {
    query: TicketSearchQueryOnly,
  },
  responses: createApiResponse(TicketSchema, "Successfully found the ticket", 200),
});

// Trong router:
ticketRouter.get("/search", validateRequest(TicketSearchSchema), ticketController.searchTicketByIdAndPhone);
