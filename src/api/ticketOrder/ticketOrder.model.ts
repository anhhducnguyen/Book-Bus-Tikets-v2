import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const paginationSchema = z.object({
  page: z.coerce.number().min(1).optional().openapi({ example: 1 }),
  limit: z.coerce.number().min(1).max(100).optional().openapi({ example: 10 }),
  sortBy: z.string().optional().openapi({ example: "created_at" }),
  order: z.enum(["asc", "desc"]).optional().openapi({ example: "desc" }),
  search: z.string().optional().openapi({ example: "Nguyen Van A" }),
});

export const TicketOrderSchema = z.object({
  ticketId: z.number(),
  status: z.string(),
  createdAt: z.string().datetime(),
  userName: z.string(),
  email: z.string(),
  seatNumber: z.string(),
  routeName: z.string(),
  departureTime: z.string().datetime(),
  arrivalTime: z.string().datetime(),
  departureStation: z.string(),
  arrivalStation: z.string(),
  companyName: z.string(),
  licensePlate: z.string(),
});

export type TicketOrder = z.infer<typeof TicketOrderSchema>;

export const GetAllTicketOrdersSchema = z.object({
  query: paginationSchema,
});

export const GetTicketOrdersByCompanySchema = z.object({
  params: z.object({
    companyId: z.coerce.number().openapi({ example: 3 }),
  }),
  query: paginationSchema,
});

export const GetTicketOrdersByStatusSchema = z.object({
  params: z.object({
    status: z.string().openapi({ example: "CONFIRMED" }),
  }),
  query: paginationSchema,
});