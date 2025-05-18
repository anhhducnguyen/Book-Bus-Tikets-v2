// import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
// import express, { type Router } from "express";
// import { z } from "zod";
// import { commonValidations } from "@/common/utils/commonValidation";

// import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
// import { BookTicketInputSchema, CancelTicketSchema, RouteSchema, BusSchema, PaymentSchema, SeatSchema, TicketSchema, TicketSearchSchema, TicketSearchQueryOnly } from "@/api/ticket/ticketModel";
// import { validateRequest } from "@/common/utils/httpHandlers";
// import { ticketController } from "./ticketController";
// import { permission } from "@/common/middleware/auth/permission";

// export const ticketRegistry = new OpenAPIRegistry();
// export const ticketRouter: Router = express.Router();

// // Lựa chọn tuyến đường đi
// ticketRegistry.registerPath({
//   method: "get",
//   path: "/tickets/routes",
//   tags: ["Ticket"],
//   summary: "Lựa chọn tuyến đường đi",
//   responses: createApiResponse(z.array(RouteSchema), "Success"),
// });
// ticketRouter.get("/routes", ticketController.getRoutes);

// // Lựa chọn xe đi
// ticketRegistry.registerPath({
//   method: "get",
//   path: "/tickets/routes/{routeId}/buses",
//   tags: ["Ticket"],
//   summary: "Lựa chọn xe đi",
//   request: { params: z.object({ routeId: commonValidations.id }) },
//   responses: createApiResponse(z.array(BusSchema), "Success"),
// });
// ticketRouter.get("/routes/:routeId/buses", ticketController.getBusesByRoute);

// // Lựa chọn ghế đi
// ticketRegistry.registerPath({
//   method: "get",
//   path: "/tickets/buses/{busId}/seats",
//   tags: ["Ticket"],
//   summary: "Lựa chọn ghế đi",
//   request: { params: z.object({ busId: commonValidations.id }) },
//   responses: createApiResponse(z.array(SeatSchema), "Success"),
// });
// ticketRouter.get("/buses/:busId/seats", ticketController.getAvailableSeats);

// // Đặt vé
// ticketRegistry.registerPath({
//   method: "post",
//   path: "/tickets/booking",
//   tags: ["Ticket"],
//   summary: "Đặt vé",
//   request: {
//     body: {
//       content: {
//         "application/json": {
//           schema: BookTicketInputSchema, // Sử dụng schema đầu vào trực tiếp
//         },
//       },
//     },
//   },
//   responses: createApiResponse(TicketSchema, "Success"),
// });
// ticketRouter.post("/tickets", ticketController.bookTicket);

// // Hủy vé
// ticketRegistry.registerPath({
//   method: "delete",
//   path: "/tickets/cancel/{ticketId}",
//   tags: ["Ticket"],
//   summary: "Hủy vé",
//   request: { params: CancelTicketSchema.shape.params },
//   responses: createApiResponse(z.void(), "Success"),
// });
// ticketRouter.delete("/tickets/:ticketId", validateRequest(CancelTicketSchema), ticketController.cancelTicket);

// // Lịch sử đặt vé theo trạng thái
// ticketRegistry.registerPath({
//   method: "get",
//   path: "/tickets/history_status/{status}",
//   tags: ["Ticket"],
//   summary: "Lịch sử đặt vé theo trạng thái",
//   request: {
//     params: z.object({
//       status: z.enum(["BOOKED", "CANCELLED"]),
//     }),
//   },
//   responses: createApiResponse(z.array(TicketSchema), "Success"),
// });

// // Thêm route mới: Lịch sử đặt vé theo nhà xe
// ticketRegistry.registerPath({
//   method: "get",
//   path: "/tickets/history_companyid/{companyId}",
//   tags: ["Ticket"],
//   summary: "Lịch sử đặt vé theo nhà xe",
//   request: {
//     params: z.object({
//       companyId: z.string().regex(/^\d+$/, "Company ID must be a numeric string"),
//     }),
//   },
//   responses: createApiResponse(z.array(TicketSchema), "Success"),
// });
// ticketRouter.get("/history/:status", ticketController.getTicketsByStatus);

// ticketRouter.get("/tickets/history/:companyId", ticketController.getTicketsByCompany);

// // Xem tất cả lịch sử đặt vé
// ticketRegistry.registerPath({
//   method: "get",
//   path: "/tickets/history",
//   tags: ["Ticket"],
//   summary: "Xem tất cả lịch sử đặt vé",
//   responses: createApiResponse(z.array(TicketSchema), "Success"),
// });
// ticketRouter.get("/tickets/history", ticketController.getTicketHistory);

// // Chọn phương thức thanh toán
// ticketRegistry.registerPath({
//   method: "post",
//   path: "/tickets/payment/{ticketId}",
//   tags: ["Ticket"],
//   summary: "Chọn phương thức thanh toán",
//   request: {
//     params: z.object({
//       ticketId: z.string().regex(/^\d+$/, "Ticket ID must be a numeric string"),
//     }),
//     body: {
//       content: {
//         "application/json": {
//           schema: z.object({
//             paymentMethod: z.enum(["ONLINE", "CASH"]),
//             userId: z.number(),
//             amount: z.number().positive(),
//           }),
//         },
//       },
//     },
//   },
//   responses: createApiResponse(PaymentSchema, "Success"),
// });
// ticketRouter.post("/payment/:ticketId", ticketController.selectPaymentMethod);

// // Xóa thông tin hủy vé
// ticketRegistry.registerPath({
//   method: "delete",
//   path: "/tickets/cancel_ticket/delete/{ticketId}",
//   tags: ["Ticket"],
//   summary: "Xóa thông tin hủy vé",
//   request: {
//     params: z.object({
//       ticketId: z.string().regex(/^\d+$/, "Ticket ID must be a numeric string"),
//     }),
//   },
//   responses: createApiResponse(z.any(), "Success"),
// });
// ticketRouter.delete("/cancel_ticket/delete/:ticketId", permission, ticketController.deleteCancelledTicket);


// // Hiển thi danh sách thông tin hủy theo vé xe
// ticketRegistry.registerPath({
//   method: "get",
//   path: "/tickets/cancel_ticket/list",
//   tags: ["Ticket"],
//   summary: "Hiển thi danh sách thông tin hủy theo vé xe cho admin",
//   request: {
//     params: z.object({}).strict(), // Không cần tham số
//   },
//   responses: createApiResponse(z.array(TicketSchema), "Success"),
// });
// ticketRouter.get("/cancel_ticket/list", permission, ticketController.getCancelledTickets);

// //  Tra cứu vé xe bằng mã vé với số điện thoại
// ticketRegistry.registerPath({
//   method: "get",
//   path: "/tickets/search",
//   tags: ["Ticket"],
//   operationId: "searchTicket",
//   summary: "Tra cứu vé xe bằng mã vé và số điện thoại",
//   request: {
//     query: TicketSearchQueryOnly,
//   },
//   responses: createApiResponse(TicketSchema, "Successfully found the ticket", 200),
// });

// // Trong router:
// ticketRouter.get("/search", validateRequest(TicketSearchSchema), ticketController.searchTicketByIdAndPhone);


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

// ticketRouter.use(authenticate);

// Lựa chọn tuyến đường đi
ticketRegistry.registerPath({
  method: "get",
  path: "/tickets/routes",
  tags: ["Ticket"],
  summary: "Lựa chọn tuyến đường đi",
  description: `Lựa chọn tuyến đường đi:<br /> 
                - Chức năng này sẽ hiển thị danh sách tuyến đường để người dùng có thể lựa chọn tại chức năng đặt vé và để hướng tới đường dẫn cho chức năng lựa chọn xe<br />`,
  responses: createApiResponse(z.array(RouteSchema), "Success"),
});
ticketRouter.get("/routes", ticketController.getRoutes);

// Lựa chọn xe đi
ticketRegistry.registerPath({
  method: "get",
  path: "/tickets/routes/{routeId}/buses",
  tags: ["Ticket"],
  summary: "Lựa chọn xe đi",
  description: `Lựa chọn xe đi:<br /> 
                - Chức năng này sẽ cho phép người dùng nhập id tuyến đường mình chọn và hiển thị danh sách tất cả các xe khách trên tuyến đường đó<br />
                - Chức năng này ta cần nhập ID của tuyến đường mình chọn<br />
                routeId: Id tuyến đường<br />`,
  request: { params: z.object({ routeId: commonValidations.id }) },
  responses: createApiResponse(z.array(BusSchema), "Success"),
});
ticketRouter.get("/routes/:routeId/buses", authenticate, ticketController.getBusesByRoute);

// Lựa chọn ghế đi
ticketRegistry.registerPath({
  method: "get",
  path: "/tickets/buses/{busId}/seats",
  tags: ["Ticket"],
  summary: "Lựa chọn ghế đi",
  description: `Lựa chọn ghế đi<br /> 
                - Tương tự, chức năng này sẽ cho phép người dùng nhập id xe khách mình chọn và hiển thị danh sách tất cả các ghế trên tuyến đường đó<br />
                - Chức năng này ta cần nhập ID của xe khách mình chọn<br />
                busId: Id xe khách<br />`,
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
  description: `Đặt vé<br /> 
                - Chức năng này sẽ cho phép người dùng nhập id user của mình, id tuyến đường, id xe khách và id ghế mình chọn để đặt vé.<br />
                - Chức năng này ta cần nhập body có dạng sau để đặt vé:<br />
                {<br />
                  "user_id": 1,<br />
                  "route_id": 1,<br />
                  "bus_id": 1,<br />
                  "seat_id": 1<br />
                }<br />
                user_id: Id của người dùng<br />
                route_id: Id tuyến đường mình chọn<br />
                bus_Id: Id xe khách mình chọn<br />
                seat_id: Id ghế mình chọn<br />
                Note: Nếu tuyến đường và xe không có trong lịch trình (schedule) thì sẽ có thông báo và vé sẽ không được đặt. Tương tự, xe phải thuộc tuyến đường mình chọn và ghế cũng phải thuộc chiếc xe đó.`,
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
ticketRouter.post("/booking", authenticate, ticketController.bookTicket);

// Hủy vé
ticketRegistry.registerPath({
  method: "delete",
  path: "/tickets/cancel/{ticketId}",
  tags: ["Ticket"],
  summary: "Hủy vé",
  description: `Hủy vé<br /> 
                - Chức năng này sẽ cho phép người dùng nhập id vé xe và chuyển sang trạng thái Cancelled(đã hủy)<br />
                - Chức năng này ta cần nhập ID của vé xe mình chọn<br />
                ticketId: Id vé xe<br />`,
  request: { params: CancelTicketSchema.shape.params },
  responses: createApiResponse(
    z.null().openapi({ description: "No content" }),
    "Success"
  ),
});
ticketRouter.delete("/cancel/:ticketId", authenticate, validateRequest(CancelTicketSchema), ticketController.cancelTicket);


// Lịch sử đặt vé theo trạng thái
ticketRegistry.registerPath({
  method: "get",
  path: "/tickets/history_status/{status}",
  tags: ["Ticket"],
  summary: "Lịch sử đặt vé theo trạng thái",
  description: `Lịch sử đặt vé theo trạng thái<br /> 
                - Chức năng này sẽ cho phép người dùng lựa chọn trạng thái vé xe và hiển thị danh sách lịch sử đặt vé theo trạng thái đó<br />
                - Chức năng này ta cần nhập ID của xe khách mình chọn<br />
                status: Trạng thái vé (BOOKED, CANCELLED)<br />`,
  request: {
    params: z.object({
      status: z.enum(["BOOKED", "CANCELLED"]),
    }),
  },
  responses: createApiResponse(z.array(TicketSchema), "Success"),
});
ticketRouter.get("/history_status/:status", authenticate, ticketController.getTicketsByStatus);

// Lịch sử đặt vé theo nhà xe
ticketRegistry.registerPath({
  method: "get",
  path: "/tickets/history_companyid/{companyId}",
  tags: ["Ticket"],
  summary: "Lịch sử đặt vé theo nhà xe",
  description: `Lịch sử đặt vé theo nhà xe<br /> 
                - Tương tự, chức năng này sẽ cho phép người dùng nhập id nhà xe mình chọn và hiển thị danh sách lịch sử đặt vé theo nhà xe đó<br />
                - Chức năng này ta cần nhập ID của xe khách mình chọn<br />
                companyId: Id nhà xe<br />`,
  request: {
    params: z.object({
      companyId: z.string().regex(/^\d+$/, "Company ID must be a numeric string"),
    }),
  },
  responses: createApiResponse(z.array(TicketSchema), "Success"),
});
ticketRouter.get("/history_companyid/:companyId", authenticate, ticketController.getTicketsByCompany);

// Xem tất cả lịch sử đặt vé
ticketRegistry.registerPath({
  method: "get",
  path: "/tickets/history",
  tags: ["Ticket"],
  summary: "Xem tất cả lịch sử đặt vé",
  description: `Xem tất cả lịch sử đặt vé<br /> 
                - Chức năng này chỉ hiển thị danh sách lịch sử đặt vé<br />`,
  responses: createApiResponse(z.array(TicketSchema), "Success"),
});
ticketRouter.get("/history", authenticate, ticketController.getTicketHistory);

// Thêm mới thông tin hủy vé xe dành cho admin
ticketRegistry.registerPath({
  method: "post",
  path: "/tickets/cancel_ticket/add",
  tags: ["Ticket"],
  summary: "Thêm mới thông tin hủy vé xe dành cho admin",
  description: `Thêm mới thông tin hủy vé xe dành cho admin<br /> 
                - Chức năng này sẽ cho phép quản trị viên nhập id vé xe mình muốn hủy và trạng thái của vé đó sẽ chuyển sang CANCELLED(Đã hủy)<br />
                - Chức năng này ta cần nhập body có dạng sau:<br />
                {<br />
                  "ticketId": "3"<br />
                }<br />
                ticketId: Id vé xe<br />`,
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
ticketRouter.post("/cancel_ticket/add", authenticate, permission, ticketController.createCancelTicket);

// Hiển thi danh sách thông tin hủy theo vé xe
ticketRegistry.registerPath({
  method: "get",
  path: "/tickets/cancel_ticket/list",
  tags: ["Ticket"],
  summary: "Hiển thị danh sách thông tin hủy theo vé xe cho admin",
  description: `Hiển thị danh sách thông tin hủy theo vé xe cho admin<br /> 
                - Chức năng sẽ hiển thị danh sách các vé xe đã bị hủy cho quản trị viên<br />`,
  request: {
    params: z.object({}).strict(), // Không cần tham số
  },
  responses: createApiResponse(z.array(TicketSchema), "Success"),
});
ticketRouter.get("/cancel_ticket/list", authenticate, permission, ticketController.getCancelledTickets);

//  Tra cứu vé xe bằng mã vé với số điện thoại
ticketRegistry.registerPath({
  method: "get",
  path: "/tickets/search",
  tags: ["Ticket"],
  operationId: "searchTicket",
  summary: "Tra cứu vé xe bằng mã vé và số điện thoại",
  description: `Tra cứu vé xe bằng mã vé và số điện thoại<br /> 
                - Chức năng này sẽ cho phép tất cả mọi người có thể tra cứu vé xe bằng mã vé và số điện thoại của người đặt vé đó.<br />
                - Chức năng này ta cần nhập ID của vé xe và ID của user đã đặt vé đó<br />
                ticketId: Id vé xe<br />
                phoneNumber: Số điện thoại có người đặt mã vé đó.<br />
                - VD: Mã vé 1 cửa người dùng 1 đặt với số điện thoại là 0256568962<br />
                Note: Số điện thoại đăng ký cần có 10 số, mã vé phải được đặt bởi ngời dùng có số điện thoại đó.`,
  request: {
    query: TicketSearchQueryOnly,
  },
  responses: createApiResponse(TicketSchema, "Successfully found the ticket", 200),
});

// Trong router:
ticketRouter.get("/search", validateRequest(TicketSearchSchema), ticketController.searchTicketByIdAndPhone);


// Xóa thông tin hủy vé
ticketRegistry.registerPath({
  method: "delete",
  path: "/tickets/cancel_ticket/delete/{ticketId}",
  tags: ["Ticket"],
  summary: "Xóa thông tin hủy vé cho admin",
  description: `Xóa thông tin hủy vé cho admin<br /> 
                - Chức năng này sẽ cho phép quản trị viên nhập id vé xe đã hủy mình muốn xóa và xóa vé xe đó khỏi danh sách<br />
                - Chức năng này ta cần nhập ID của vé xe đã hủy<br />
                ticketId: Id vé xe<br />`,
  request: {
    params: z.object({
      ticketId: z.string().regex(/^\d+$/, "Ticket ID must be a numeric string"),
    }),
  },
  responses: createApiResponse(z.any(), "Success"),
});
ticketRouter.delete("/cancel_ticket/delete/:ticketId", authenticate, permission, ticketController.deleteCancelledTicket);
