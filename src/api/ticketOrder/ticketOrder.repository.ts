import { db } from "@/common/config/database";

export class TicketOrderRepository {
  async getAllTicketOrders({
    page = 1,
    limit = 10,
    sortBy = "tickets.created_at",
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

    const query = db("tickets")
      .select(
        "tickets.id as ticketId",
        "tickets.status",
        "users.name as userName",
        "users.email as userEmail",
        "schedules.departure_time",
        "routes.name as routeName",
        "from_station.name as fromStation",
        "to_station.name as toStation",
        "buses.license_plate",
        "bus_companies.name as busCompanyName",
        "seats.seat_number"
      )
      .join("users", "tickets.user_id", "users.id")
      .join("schedules", "tickets.schedule_id", "schedules.id")
      .join("routes", "schedules.route_id", "routes.id")
      .join("stations as from_station", "routes.from_station_id", "from_station.id")
      .join("stations as to_station", "routes.to_station_id", "to_station.id")
      .join("buses", "schedules.bus_id", "buses.id")
      .join("bus_companies", "buses.bus_company_id", "bus_companies.id")
      .join("seats", "tickets.seat_id", "seats.id")
      .where((builder) => {
        if (search) {
          builder.where("users.name", "like", `%${search}%`)
            .orWhere("routes.name", "like", `%${search}%`)
            .orWhere("bus_companies.name", "like", `%${search}%`);
        }
      })
      .orderBy(sortBy, order)
      .limit(limit)
      .offset(offset);

    return await query;
  }

  async getTicketOrdersByCompany(companyId: number, {
    page = 1,
    limit = 10,
    sortBy = "tickets.created_at",
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

    const query = db("tickets")
      .select(
        "tickets.id as ticketId",
        "tickets.status",
        "users.name as userName",
        "schedules.departure_time",
        "routes.name as routeName",
        "bus_companies.name as busCompanyName"
      )
      .join("users", "tickets.user_id", "users.id")
      .join("schedules", "tickets.schedule_id", "schedules.id")
      .join("routes", "schedules.route_id", "routes.id")
      .join("buses", "schedules.bus_id", "buses.id")
      .join("bus_companies", "buses.bus_company_id", "bus_companies.id")
      .where("bus_companies.id", companyId)
      .andWhere((builder) => {
        if (search) {
          builder.where("users.name", "like", `%${search}%`)
            .orWhere("routes.name", "like", `%${search}%`);
        }
      })
      .orderBy(sortBy, order)
      .limit(limit)
      .offset(offset);

    return await query;
  }

  async getTicketOrdersByStatus(status: string, {
    page = 1,
    limit = 10,
    sortBy = "tickets.created_at",
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

    const query = db("tickets")
      .select(
        "tickets.id as ticketId",
        "tickets.status",
        "users.name as userName",
        "schedules.departure_time",
        "routes.name as routeName"
      )
      .join("users", "tickets.user_id", "users.id")
      .join("schedules", "tickets.schedule_id", "schedules.id")
      .join("routes", "schedules.route_id", "routes.id")
      .where("tickets.status", status)
      .andWhere((builder) => {
        if (search) {
          builder.where("users.name", "like", `%${search}%`)
            .orWhere("routes.name", "like", `%${search}%`);
        }
      })
      .orderBy(sortBy, order)
      .limit(limit)
      .offset(offset);

    return await query;
  }
}