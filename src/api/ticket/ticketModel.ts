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
  seatId: z.number(),
  scheduleId: z.number(),
  departureTime: z.date(),
  arrivalTime: z.date(),
  seatType: z.enum(["LUXURY", "VIP", "STANDARD"]),
  price: z.number(),
  status: z.enum(["BOOKED", "CANCELLED"]),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Ticket = z.infer<typeof TicketSchema>;

// Validation cho các endpoint
export const BookTicketSchema = z.object({
  body: z.object({
    userId: commonValidations.id,
    routeId: commonValidations.id,
    busId: commonValidations.id,
    seatId: commonValidations.id,
  }),
});

export const CancelTicketSchema = z.object({
  params: z.object({ ticketId: commonValidations.id }),
});