// ticketModel.ts
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

// Schema cho Route
export const RouteSchema = z.object({
  id: z.number(),
  departureStationId: z.number(),
  arrivalStationId: z.number(),
  price: z.number(),
  duration: z.number(),
  distance: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Route = z.infer<typeof RouteSchema>;

// Schema cho Bus
export const BusSchema = z.object({
  id: z.number(),
  name: z.string(),
  licensePlate: z.string(),
  capacity: z.number(),
  companyId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Bus = z.infer<typeof BusSchema>;

// Schema cho Seat
export const SeatSchema = z.object({
  id: z.number(),
  busId: z.number(),
  seatNumber: z.string(),
  seatType: z.enum(["LUXURY", "VIP", "STANDARD"]),
  status: z.enum(["AVAILABLE", "BOOKED"]),
  priceForTypeSeat: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Seat = z.infer<typeof SeatSchema>;

// Schema cho Schedule
export const ScheduleSchema = z.object({
  id: z.number(),
  routeId: z.number(),
  busId: z.number(),
  departureTime: z.date(),
  arrivalTime: z.date(),
  availableSeats: z.number(),
  totalSeats: z.number(),
  status: z.enum(["AVAILABLE", "FULL", "CANCELLED"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Schedule = z.infer<typeof ScheduleSchema>;

// Schema cho Ticket
export const TicketSchema = z.object({
  id: z.number(),
  seat_id: z.number(),
  schedule_id: z.number(),
  departure_time: z.date(),
  arrival_time: z.date(),
  seat_type: z.enum(["LUXURY", "VIP", "STANDARD"]),
  price: z.number(),
  status: z.enum(["BOOKED", "CANCELLED"]),
  created_at: z.date(),
  updated_at: z.date(),
});
export type Ticket = z.infer<typeof TicketSchema>;

// Validation cho các endpoint
export const BookTicketInputSchema = z.object({
  userId: z.number().int().positive(),
  routeId: z.number().int().positive(),
  busId: z.number().int().positive(),
  seatId: z.number().int().positive(),
});
export type BookTicketInput = z.infer<typeof BookTicketInputSchema>;

export const CancelTicketSchema = z.object({
  params: z.object({ ticketId: commonValidations.id }),
});

// export const CancelTicketSchema = z.object({
//   params: z.object({
//     ticketId: commonValidations.id.openapi({ description: "ID vé cần hủy" }),
//   }),