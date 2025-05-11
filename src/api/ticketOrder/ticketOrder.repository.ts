import { db } from "@/common/config/database";

export class TicketOrderRepository {
  async getAllTicketOrders({
    page = 1,
    limit = 10,
    sortBy = "tickets.id",
    order = "desc",
    search = "",
  }: {
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: "asc" | "desc";
    search?: string;
  }) {
    const offset = (page - 1) * limit;

    if (!sortBy.includes(".")) {
    sortBy = `tickets.id`;
    sortBy = `tickets.status`;
    sortBy = `users.first_name`;
    sortBy = `users.email`;
    sortBy = `schedules.departure_time`;
    sortBy = `routes.price`;
    sortBy = `buses.license_plate`;
    sortBy = `bus_companies.company_name`;
    sortBy = `seats.seat_number`;
    }

    const query = db("tickets")
      .select(
        "tickets.id as ticketId",
        "tickets.status",
        "users.first_name as first_name",
        "users.email as userEmail",
        "schedules.departure_time",
        "routes.price as price",
        "buses.license_plate",
        "bus_companies.company_name as busCompanyName",
        "seats.seat_number"
      )
      .join("payments", "tickets.id", "payments.ticket_id")
      .join("users", "payments.user_id", "users.id")
      .join("schedules", "tickets.schedule_id", "schedules.id")
      .join("routes", "schedules.route_id", "routes.id")
      .join("buses", "schedules.bus_id", "buses.id") 
      .join("bus_companies", "buses.company_id", "bus_companies.id")
      .join("seats", "tickets.seat_id", "seats.id")
      
    if (search) {
      query.where(function() {
        this.where("users.first_name", "like", `%${search}%`)
          .orWhere("users.email", "like", `%${search}%`);
      });
    }
    query.orderBy(sortBy, order)
      .limit(limit)
      .offset(offset);
    console.log("Query:", query.toSQL().sql); 

    return await query;
  }

  async getTicketOrdersByCompany(companyId: number) {

    const query = db("tickets")
      .select(
        "tickets.id as ticketId",
        "tickets.status",
        "users.first_name as first_name",
        "users.email as userEmail",
        "schedules.departure_time",
        "routes.price as price",
        "buses.license_plate",
        "bus_companies.company_name as busCompanyName",
        "seats.seat_number"
      )
      .join("payments", "tickets.id", "payments.ticket_id")
      .join("users", "payments.user_id", "users.id")
      .join("schedules", "tickets.schedule_id", "schedules.id")
      .join("routes", "schedules.route_id", "routes.id")
      .join("buses", "schedules.bus_id", "buses.id") 
      .join("bus_companies", "buses.company_id", "bus_companies.id")
      .join("seats", "tickets.seat_id", "seats.id")
      .where("bus_companies.id", companyId)

    return await query;
  }

  async getTicketOrdersByStatus(status: string) { 

    const query = db("tickets")
    .select(
      "tickets.id as ticketId",
      "tickets.status",
      "users.first_name as first_name",
      "users.email as userEmail",
      "schedules.departure_time",
      "routes.price as price",
      "buses.license_plate",
      "bus_companies.company_name as busCompanyName",
      "seats.seat_number"
    )
    .join("payments", "tickets.id", "payments.ticket_id")
    .join("users", "payments.user_id", "users.id")
    .join("schedules", "tickets.schedule_id", "schedules.id")
    .join("routes", "schedules.route_id", "routes.id")
    .join("buses", "schedules.bus_id", "buses.id") 
    .join("bus_companies", "buses.company_id", "bus_companies.id")
    .join("seats", "tickets.seat_id", "seats.id")
    .where("tickets.status", status)

    console.log("Query:", query.toSQL().sql);

    return await query;
  }
}