import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { BookTicketInputSchema, CancelTicketSchema, RouteSchema, BusSchema, SeatSchema, TicketSchema } from "@/api/ticket/ticketModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { ticketController } from "./ticketController";

export const ticketRegistry = new OpenAPIRegistry();
export const ticketRouter: Router = express.Router();

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