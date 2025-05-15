// // ticketModel.ts
// import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
// import { z } from "zod";
// import { commonValidations } from "@/common/utils/commonValidation";

// extendZodWithOpenApi(z);

// // Schema cho Route
// export const RouteSchema = z.object({
//   id: z.number(),
//   departure_station_id: z.number(),
//   arrival_station_id: z.number(),
//   price: z.number(),
//   duration: z.number(),
//   distance: z.number(),
//   created_at: z.date(),
//   updated_at: z.date(),
// });
// export type Route = z.infer<typeof RouteSchema>;

// // Schema cho Bus
// export const BusSchema = z.object({
//   id: z.number(),
//   name: z.string(),
//   license_plate: z.string(),
//   capacity: z.number(),
//   company_id: z.number(),
//   created_at: z.date(),
//   updated_at: z.date(),
// });
// export type Bus = z.infer<typeof BusSchema>;

// // Schema cho Seat
// export const SeatSchema = z.object({
//   id: z.number(),
//   bus_id: z.number(),
//   seat_number: z.string(),
//   seat_type: z.enum(["LUXURY", "VIP", "STANDARD"]),
//   status: z.enum(["AVAILABLE", "BOOKED"]),
//   price_for_type_seat: z.number(),
//   created_at: z.date(),
//   updated_at: z.date(),
// });
// export type Seat = z.infer<typeof SeatSchema>;

// // Schema cho Schedule
// export const ScheduleSchema = z.object({
//   id: z.number(),
//   route_id: z.number(),
//   bus_id: z.number(),
//   departure_time: z.date(),
//   arrival_time: z.date(),
//   available_seats: z.number(),
//   total_seats: z.number(),
//   status: z.enum(["AVAILABLE", "FULL", "CANCELLED"]),
//   created_at: z.date(),
//   updated_at: z.date(),
// });
// export type Schedule = z.infer<typeof ScheduleSchema>;

// // Schema cho Ticket
// export const TicketSchema = z.object({
//   id: z.number(),
//   seat_id: z.number(),
//   schedule_id: z.number(),
//   departure_time: z.date(),
//   arrival_time: z.date(),
//   seat_type: z.enum(["LUXURY", "VIP", "STANDARD"]),
//   price: z.number(),
//   status: z.enum(["BOOKED", "CANCELLED"]),
//   created_at: z.date(),
//   updated_at: z.date(),
// });
// export type Ticket = z.infer<typeof TicketSchema>;

// // Validation cho các endpoint
// export const BookTicketInputSchema = z.object({
//   user_id: z.number().int().positive(),
//   route_id: z.number().int().positive(),
//   bus_id: z.number().int().positive(),
//   seat_id: z.number().int().positive(),
// });
// export type BookTicketInput = z.infer<typeof BookTicketInputSchema>;

// Schema cho Payment
export const PaymentSchema = z.object({
  id: z.number(),
  payment_provider_id: z.number().optional(),
  user_id: z.number().optional(),
  ticket_id: z.number(),
  payment_method: z.enum(["ONLINE", "CASH"]),
  amount: z.number(),
  status: z.enum(["PENDING", "COMPLETED", "FAILED"]),
  created_at: z.date(),
  updated_at: z.date(),
});
export type Payment = z.infer<typeof PaymentSchema>;

// export const CancelTicketSchema = z.object({
//   params: z.object({ ticketId: commonValidations.id }),
// });

// export const TicketSearchQueryOnly = z.object({
//   ticketId: z.string().regex(/^\d+$/, "The ticket code must be a number."),
//   phoneNumber: z.string().regex(/^0\d{9}$/, "The phone number must be a 10-digit number starting with 0."),
// });
// export const TicketSearchSchema = z.object({
//   query: TicketSearchQueryOnly,
//   body: z.any().optional(),
//   params: z.any().optional(),
// });
// export type TicketSearchQuery = z.infer<typeof TicketSearchQueryOnly>;


// ticketModel.ts
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

// Schema cho Route
export const RouteSchema = z.object({
  id: z.number(),
  departure_station_id: z.number(),
  arrival_station_id: z.number(),
  price: z.number(),
  duration: z.number(),
  distance: z.number(),
  created_at: z.date(),
  updated_at: z.date(),
});
export type Route = z.infer<typeof RouteSchema>;

// Schema cho Bus
export const BusSchema = z.object({
  id: z.number(),
  name: z.string(),
  license_plate: z.string(),
  capacity: z.number(),
  company_id: z.number(),
  created_at: z.date(),
  updated_at: z.date(),
});
export type Bus = z.infer<typeof BusSchema>;

// Schema cho Seat
export const SeatSchema = z.object({
  id: z.number(),
  bus_id: z.number(),
  seat_number: z.string(),
  seat_type: z.enum(["LUXURY", "VIP", "STANDARD"]),
  status: z.enum(["AVAILABLE", "BOOKED"]),
  price_for_type_seat: z.number(),
  created_at: z.date(),
  updated_at: z.date(),
});
export type Seat = z.infer<typeof SeatSchema>;

// Schema cho Schedule
export const ScheduleSchema = z.object({
  id: z.number(),
  route_id: z.number(),
  bus_id: z.number(),
  departure_time: z.date(),
  arrival_time: z.date(),
  available_seats: z.number(),
  total_seats: z.number(),
  status: z.enum(["AVAILABLE", "FULL", "CANCELLED"]),
  created_at: z.date(),
  updated_at: z.date(),
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
  user_id: z.number().int().positive(),
  route_id: z.number().int().positive(),
  bus_id: z.number().int().positive(),
  seat_id: z.number().int().positive(),
});
export type BookTicketInput = z.infer<typeof BookTicketInputSchema>;

export const CancelTicketSchema = z.object({
  params: z.object({ ticketId: commonValidations.id }),
});

export const TicketSearchQueryOnly = z.object({
  ticketId: z.string().regex(/^\d+$/, "The ticket code must be a number."),
  phoneNumber: z.string().regex(/^0\d{9}$/, "The phone number must be a 10-digit number starting with 0."),
});
export const TicketSearchSchema = z.object({
  query: TicketSearchQueryOnly,
  body: z.any().optional(),
  params: z.any().optional(),
});
export type TicketSearchQuery = z.infer<typeof TicketSearchQueryOnly>;