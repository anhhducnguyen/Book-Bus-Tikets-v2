// src/api/ticketOrder/ticketOrderModel.ts
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

// Enum các trường có thể sắp xếp
const SortFieldsEnum = z.enum([
  "tickets.id",
  "tickets.status",
  "users.email",
  "schedules.departure_time",
  "routes.price",
  "buses.license_plate",
  "bus_companies.company_name",
  "seats.seat_number",
]);

// Enum trạng thái vé
export const TicketStatusEnum = z.enum([
  "BOOKED",
  "CANCELED",
]);

// Schema phân trang và tìm kiếm
export const paginationSchema = z.object({
  page: z.coerce.number().min(1).optional().openapi({ example: 1, description: "Trang hiện tại" }),
  limit: z.coerce.number().min(1).max(100).optional().openapi({ example: 10, description: "Số lượng mỗi trang" }),
  sortBy: SortFieldsEnum.optional().openapi({ example: "tickets.id", description: "Trường sắp xếp" }),
  order: z.enum(["asc", "desc"]).optional().openapi({ example: "desc", description: "Thứ tự sắp xếp" }),
  search: z.string().optional().openapi({ example: "jane.doe@example.com", description: "Tìm kiếm theo email" }),
});

// Schema dữ liệu đơn đặt vé
export const TicketOrderSchema = z.object({
  ticketId: z.number().openapi({ example: 1 }),
  status: TicketStatusEnum.openapi({ example: "BOOKED", description: "Trạng thái vé" }),
  createdAt: z.string().datetime().openapi({ example: "2025-05-11T08:30:00Z" }),
  userName: z.string().openapi({ example: "Jane Doe" }),
  email: z.string().openapi({ example: "jane.doe@example.com" }),
  seatNumber: z.string().openapi({ example: "A1" }),
  routeName: z.string().openapi({ example: "Hà Nội - Sài Gòn" }),
  departureTime: z.string().datetime().openapi({ example: "2025-05-11T09:00:00Z" }),
  arrivalTime: z.string().datetime().openapi({ example: "2025-05-11T17:00:00Z" }),
  departureStation: z.string().openapi({ example: "Bến xe Mỹ Đình" }),
  arrivalStation: z.string().openapi({ example: "Bến xe Miền Đông" }),
  companyName: z.string().openapi({ example: "Xe khách ABC" }),
  licensePlate: z.string().openapi({ example: "30F-123.45" }),
});

// Schema: Lấy tất cả đơn đặt vé (GET /ticket-orders)
export const GetAllTicketOrdersSchema = z.object({
  query: paginationSchema,
}).openapi("GetAllTicketOrdersRequest");

// Schema: Lấy đơn đặt vé theo nhà xe (GET /ticket-orders/company/:companyId)
export const GetTicketOrdersByCompanySchema = z.object({
  params: z.object({
    companyId: z.coerce.number().openapi({ example: 3, description: "ID của nhà xe" }),
  }),
}).openapi("GetTicketOrdersByCompanyRequest");

// Schema: Lấy đơn đặt vé theo trạng thái (GET /ticket-orders/status/:status)
export const GetTicketOrdersByStatusSchema = z.object({
  params: z.object({
    status: TicketStatusEnum.openapi({ example: "CANCELED", description: "Trạng thái vé" }),
  }),
}).openapi("GetTicketOrdersByStatusRequest");

export type TicketOrder = z.infer<typeof TicketOrderSchema>;
