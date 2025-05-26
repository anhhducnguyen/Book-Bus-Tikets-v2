import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { BookTicketInputSchema, CancelTicketSchema, RouteSchema, BusSchema, SeatSchema, TicketSchema, TicketSearchSchema, TicketSearchQueryOnly, PaymentSchema } from "@/api/ticket/ticketModel";
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
  tags: ["Book tickets"],
  summary: "Lựa chọn tuyến đường đi",
  description: `Lựa chọn tuyến đường đi:<br /> 
                - Chức năng này sẽ hiển thị danh sách tuyến đường để người dùng có thể lựa chọn tại chức năng đặt vé và để hướng tới đường dẫn cho chức năng lựa chọn xe<br />
                <br />
                <b>id</b>: Id tuyến đường<br />
                <b>departure_station_id</b>: Id bến xuất phát<br />
                <b>arrival_station_id</b>: Id bến đến<br />
                <b>price</b>: Giá tiền chuyến đi<br />
                <b>duration</b>: Khoảng thời gian hoàn thành chuyến đi tính bằng (phút)<br />
                <b>distance</b>: Khoảng cách giữa điểm đi và điểm đến tính bằng (km)<br />
                <b>created_at</b>: Thời gian tạo tuyến đường<br />
                <b>updated_at</b>: Thời gian cập nhật tuyến đường<br />`,
  responses: createApiResponse(z.array(RouteSchema), "Success"),
});
ticketRouter.get("/routes", ticketController.getRoutes);

// Lựa chọn xe đi
ticketRegistry.registerPath({
  method: "get",
  path: "/tickets/routes/{routeId}/buses",
  tags: ["Book tickets"],
  summary: "Lựa chọn xe đi",
  description: `Lựa chọn xe đi:<br /> 
                - Chức năng này sẽ cho phép người dùng nhập id tuyến đường mình chọn và hiển thị danh sách tất cả các xe khách trên tuyến đường đó<br />
                - Chức năng này ta cần nhập ID của tuyến đường mình chọn<br />
                routeId: Id tuyến đường<br />
                <br />
                <b>id</b>: Id xe khách<br />
                <b>name</b>: Tên xe<br />
                <b>license_plate</b>: Biển số xe<br />
                <b>capacity</b>: Số lượng ghế<br />
                <b>company_id</b>: Id nhà xe<br />
                <b>created_at</b>: Thời gian tạo xe<br />
                <b>updated_at</b>: Thời gian cập nhật xe<br />`,
  request: { params: z.object({ routeId: commonValidations.id }) },
  responses: createApiResponse(z.array(BusSchema), "Success"),
});
ticketRouter.get("/routes/:routeId/buses", authenticate, ticketController.getBusesByRoute);

// Lựa chọn ghế đi
ticketRegistry.registerPath({
  method: "get",
  path: "/tickets/buses/{busId}/seats",
  tags: ["Book tickets"],
  summary: "Lựa chọn ghế đi",
  description: `Lựa chọn ghế đi<br /> 
                - Tương tự, chức năng này sẽ cho phép người dùng nhập id xe khách mình chọn và hiển thị danh sách tất cả các ghế còn trống trên tuyến đường đó<br />
                - Chức năng này ta cần nhập ID của xe khách mình chọn<br />
                busId: Id xe khách<br />
                <br />
                <b>id</b>: Id ghế<br />
                <b>bus_id</b>: Id xe khách<br />
                <b>seat_number</b>: Tên số ghế VD: (A1, A2, A3, ...)<br />
                <b>seat_type</b>: Loại ghế ('LUXURY', 'VIP', 'STANDARD')<br />
                <b>status</b>: Trạng thái ('AVAILABLE', 'BOOKED')<br />
                <b>price_for_seat_type</b>: Giá tiền sẽ được cộng vào khi chọn loại ghế (VD: LUXURY + 100k, VIP + 50k, STANDARD + 0k)<br />
                <b>created_at</b>: Thời gian tạo ghế<br />
                <b>updated_at</b>: Thời gian cập nhật ghế<br />`,
  request: { params: z.object({ busId: commonValidations.id }) },
  responses: createApiResponse(z.array(SeatSchema), "Success"),
});
ticketRouter.get("/buses/:busId/seats", ticketController.getAvailableSeats);

// Đặt vé
ticketRegistry.registerPath({
  method: "post",
  path: "/tickets/booking",
  tags: ["Book tickets"],
  summary: "Đặt vé",
  description: `Đặt vé<br /> 
                - Chức năng này sẽ cho phép người dùng nhập id tuyến đường, id xe khách, id ghế mình chọn và phương thức thanh toán để đặt vé.<br />
                - Vé sẽ tự động được đặt cho người dùng hiện tại (dựa trên token xác thực)<br />
                - Chức năng này ta cần nhập body có dạng sau để đặt vé:<br />
                {<br />
                  "route_id": 1,<br />
                  "bus_id": 1,<br />
                  "seat_id": 1<br />
                  "paymentMethod": "ONLINE"<br />
                }<br />
                route_id: Id tuyến đường mình chọn<br />
                bus_Id: Id xe khách mình chọn<br />
                seat_id: Id ghế mình chọn<br />
                paymentMethod: Phương thức thanh toán ('ONLINE' hoặc 'CASH')<br />
                <b>Note: Nếu tuyến đường và xe không có trong lịch trình (schedule) thì sẽ có thông báo và vé sẽ không được đặt. Tương tự, xe phải thuộc tuyến đường mình chọn và ghế cũng phải thuộc chiếc xe đó.</b>`,
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
  method: "put",
  path: "/tickets/cancel/{ticketId}",
  tags: ["Book tickets"],
  summary: "Hủy vé",
  description: `Hủy vé<br /> 
                - Chức năng này sẽ cho phép người dùng nhập id vé xe và lý do hủy, sau đó chuyển sang trạng thái Cancelled(đã hủy)<br />
                - Chức năng này ta cần nhập ID của vé xe mình chọn và lý do hủy trong body<br />
                <b>Note: Người dùng chỉ có thể hủy vé của chính mình. Hãy xem lịch sử đặt vé và tìm vé mình vừa đặt.</b>
                ticketId: Id vé xe<br />
                Body:<br />
                {<br />
                  "reason": "Lý do hủy vé (ví dụ: Hủy do thay đổi lịch trình)"<br />
                }<br />`,
  request: {
    params: CancelTicketSchema.shape.params,
    body: {
      content: {
        "application/json": {
          schema: CancelTicketSchema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(
    z.null().openapi({ description: "No content" }),
    "Success"
  ),
});
ticketRouter.put("/cancel/:ticketId", authenticate, validateRequest(CancelTicketSchema), ticketController.cancelTicket);


// Lịch sử đặt vé theo trạng thái
ticketRegistry.registerPath({
  method: "get",
  path: "/tickets/history_status/{status}",
  tags: ["Booking history"],
  summary: "Lịch sử đặt vé theo trạng thái",
  description: `Lịch sử đặt vé theo trạng thái<br /> 
                - Chức năng này sẽ cho phép người dùng lựa chọn trạng thái vé xe và hiển thị danh sách lịch sử đặt vé theo trạng thái đó<br />
                - Chức năng này ta cần nhập ID của xe khách mình chọn<br />
                status: Trạng thái vé (BOOKED, CANCELED)<br />
                <br />
                <b>id</b>: Id vé<br />
                <b>schedule_id</b>: Id lịch trình<br />
                <b>seat_id</b>: Id ghế đã lựa chọn<br />
                <b>departure_time</b>: Thời gian khởi hành<br />
                <b>arrival_time</b>: Thời gian đến nơi<br />
                <b>seat_type</b>: Loại ghế đã lựa chọn ('LUXURY', 'VIP', 'STANDARD')<br />
                <b>price</b>: Giá tiền vé<br />
                <b>status</b>: Trạng thái của vé ('BOOKED', 'CANCELED')<br />
                <b>created_at</b>: Thời gian tạo vé<br />
                <b>updated_at</b>: Thời gian cập nhật vé<br />`,
  request: {
    params: z.object({
      status: z.enum(["BOOKED", "CANCELED"]),
    }),
  },
  responses: createApiResponse(z.array(TicketSchema), "Success"),
});
ticketRouter.get("/history_status/:status", authenticate, ticketController.getTicketsByStatus);

// Lịch sử đặt vé theo nhà xe
ticketRegistry.registerPath({
  method: "get",
  path: "/tickets/history_companyid/{companyId}",
  tags: ["Booking history"],
  summary: "Lịch sử đặt vé theo nhà xe",
  description: `Lịch sử đặt vé theo nhà xe<br /> 
                - Tương tự, chức năng này sẽ cho phép người dùng nhập id nhà xe mình chọn và hiển thị danh sách lịch sử đặt vé theo nhà xe đó<br />
                - Chức năng này ta cần nhập ID của xe khách mình chọn<br />
                companyId: Id nhà xe<br />
                <br />
                <b>id</b>: Id vé<br />
                <b>schedule_id</b>: Id lịch trình<br />
                <b>seat_id</b>: Id ghế đã lựa chọn<br />
                <b>departure_time</b>: Thời gian khởi hành<br />
                <b>arrival_time</b>: Thời gian đến nơi<br />
                <b>seat_type</b>: Loại ghế đã lựa chọn ('LUXURY', 'VIP', 'STANDARD')<br />
                <b>price</b>: Giá tiền vé<br />
                <b>status</b>: Trạng thái của vé ('BOOKED', 'CANCELED')<br />
                <b>created_at</b>: Thời gian tạo vé<br />
                <b>updated_at</b>: Thời gian cập nhật vé<br />`,
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
  tags: ["Booking history"],
  summary: "Xem tất cả lịch sử đặt vé",
  description: `Xem tất cả lịch sử đặt vé<br /> 
                - Chức năng này chỉ hiển thị danh sách lịch sử đặt vé<br />
                <br />
                <b>id</b>: Id vé<br />
                <b>schedule_id</b>: Id lịch trình<br />
                <b>seat_id</b>: Id ghế đã lựa chọn<br />
                <b>departure_time</b>: Thời gian khởi hành<br />
                <b>arrival_time</b>: Thời gian đến nơi<br />
                <b>seat_type</b>: Loại ghế đã lựa chọn ('LUXURY', 'VIP', 'STANDARD')<br />
                <b>price</b>: Giá tiền vé<br />
                <b>status</b>: Trạng thái của vé ('BOOKED', 'CANCELLED')<br />
                <b>created_at</b>: Thời gian tạo vé<br />
                <b>updated_at</b>: Thời gian cập nhật vé<br />`,
  responses: createApiResponse(z.array(TicketSchema), "Success"),
});
ticketRouter.get("/history", authenticate, ticketController.getTicketHistory);

// Thêm mới thông tin hủy vé xe dành cho admin
ticketRegistry.registerPath({
  method: "put",
  path: "/tickets/cancel_ticket/add/{ticketId}",
  tags: ["Ticket"],
  summary: "Cập nhật trạng thái vé thành CANCELED cho admin",
  description: `Cập nhật trạng thái vé thành CANCELED cho admin<br /> 
                - Chức năng này sẽ cho phép quản trị viên nhập id vé xe mình muốn hủy, trạng thái của vé đó sẽ chuyển sang CANCELED(Đã hủy) và giải phóng ghế<br />
                - Chức năng này ta cần nhập params với ticketId và body có dạng sau:<br />
                Params: {ticketId: "3"}<br />
                Body:<br />
                {<br />
                  "reason": "Hủy vé theo yêu cầu admin"<br />
                }<br />
                ticketId: Id vé xe<br />
                reason: Lý do hủy vé (bắt buộc)<br />`,
  request: {
    params: z.object({
      ticketId: z.string().regex(/^\d+$/, "Ticket ID must be a numeric string"),
    }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            reason: z.string().min(1, "Reason is required"),
          }),
        },
      },
    },
  },
  responses: createApiResponse(z.any(), "Success"),
});
ticketRouter.put("/cancel_ticket/add/:ticketId", authenticate, permission, ticketController.createCancelTicket);

// Hiển thi danh sách thông tin hủy theo vé xe
ticketRegistry.registerPath({
  method: "get",
  path: "/tickets/cancel_ticket/list",
  tags: ["Ticket"],
  summary: "Hiển thị danh sách thông tin hủy theo vé xe cho admin",
  description: `Hiển thị danh sách thông tin hủy theo vé xe cho admin<br /> 
                - Chức năng sẽ hiển thị danh sách các vé xe đã bị hủy cho quản trị viên<br />
                <br />
                <b>id</b>: Id vé<br />
                <b>schedule_id</b>: Id lịch trình<br />
                <b>seat_id</b>: Id ghế đã lựa chọn<br />
                <b>departure_time</b>: Thời gian khởi hành<br />
                <b>arrival_time</b>: Thời gian đến nơi<br />
                <b>seat_type</b>: Loại ghế đã lựa chọn ('LUXURY', 'VIP', 'STANDARD')<br />
                <b>price</b>: Giá tiền vé<br />
                <b>status</b>: Trạng thái của vé ('CANCELED')<br />
                <b>created_at</b>: Thời gian tạo vé<br />
                <b>updated_at</b>: Thời gian cập nhật vé<br />`,
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
                Note: Số điện thoại đăng ký cần có 10 số, mã vé phải được đặt bởi ngời dùng có số điện thoại đó.<br />
                <br />
                <b>id</b>: Id vé<br />
                <b>schedule_id</b>: Id lịch trình<br />
                <b>seat_id</b>: Id ghế đã lựa chọn<br />
                <b>departure_time</b>: Thời gian khởi hành<br />
                <b>arrival_time</b>: Thời gian đến nơi<br />
                <b>seat_type</b>: Loại ghế đã lựa chọn ('LUXURY', 'VIP', 'STANDARD')<br />
                <b>price</b>: Giá tiền vé<br />
                <b>status</b>: Trạng thái của vé ('BOOKED', 'CANCELED')<br />
                <b>created_at</b>: Thời gian tạo vé<br />
                <b>updated_at</b>: Thời gian cập nhật vé<br />`,
  request: {
    query: TicketSearchQueryOnly,
  },
  responses: createApiResponse(TicketSchema, "Successfully found the ticket", 200),
});

// Trong router:
ticketRouter.get("/search", validateRequest(TicketSearchSchema), ticketController.searchTicketByIdAndPhone);


// Xóa thông tin hủy vé
ticketRegistry.registerPath({
  method: "put",
  path: "/tickets/cancel_ticket/delete/{ticketId}",
  tags: ["Ticket"],
  summary: "Cập nhật trạng thái vé từ CANCELED thành BOOKED cho admin",
  description: `Cập nhật trạng thái vé từ CANCELED thành BOOKED cho admin<br /> 
                - Chức năng này sẽ cho phép quản trị viên nhập id vé xe đã hủy và chuyển trạng thái của vé đó từ CANCELED về BOOKED, kèm theo lý do khôi phục.<br />
                - Chức năng này ta cần nhập params với ticketId và body có dạng sau:<br />
                Params: {ticketId: "3"}<br />
                Body:<br />
                {<br />
                  "reason": "Khôi phục do lỗi hủy vé"<br />
                }<br />
                ticketId: Id vé xe<br />
                reason: Lý do khôi phục vé (bắt buộc)<br />`,
  request: {
    params: z.object({
      ticketId: z.string().regex(/^\d+$/, "Ticket ID must be a numeric string"),
    }),
    body: {
      content: {
        "application/json": {
          schema: z.object({
            reason: z.string().min(1, "Reason is required"),
          }),
        },
      },
    },
  },
  responses: createApiResponse(z.any(), "Success"),
});
ticketRouter.put("/cancel_ticket/delete/:ticketId", authenticate, permission, ticketController.deleteCancelledTicket);

// // Chọn phương thức thanh toán
// ticketRegistry.registerPath({
//   method: "post",
//   path: "tickets/payment/{ticketId}",
//   tags: ["Ticket"],
//   summary: "Chọn phương thức thanh toán",
//   description: `Chọn phương thức thanh toán<br />
//                 - Chức năng này sẽ cho phép nhập <br />
//                 - Chức năng này ta cần nhập body theo dạng sau: <br />
//                 {<br />
//                   "paymentMethod": "CASH", <br />
//                   "userId": 1, <br />
//                   "amount": 50 <br />
//                 }<br />
//                 "paymentMethod": Phương thức thanh toán ('CASH', 'ONLINE')<br />
//                 "userId": Id người dùng<br />
//                 "amount": Tổng số tiền thanh toán<br />`,
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
// ticketRouter.post("/payment/:ticketId", authenticate, ticketController.selectPaymentMethod);