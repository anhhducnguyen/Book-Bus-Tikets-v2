import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import {
  VehicleScheduleSchema,
  CreateVehicleScheduleSchema,
  UpdateVehicleScheduleSchema,
  VehicleScheduleQuerySchema,
  DeleteVehicleScheduleSchema,
  GetVehicleScheduleSchema,
} from "./vehicleSchedule.model";
import { validateRequest } from "@/common/utils/httpHandlers";
import { vehicleScheduleController } from "./vehicleSchedule.controller";


export const vehicleScheduleRegistry = new OpenAPIRegistry();
export const vehicleScheduleRouter: Router = express.Router();

// vehicleScheduleRouter.use(authenticate);

vehicleScheduleRegistry.register("VehicleSchedule", VehicleScheduleSchema);

vehicleScheduleRegistry.registerPath({
  method: "get",
  path: "/vehicle-schedules",
  tags: ["VehicleSchedule"],
  operationId: "getVehicleSchedules",
  summary: "Hiển thị tất cả lịch trình của xe (phân trang, sắp xếp, tìm kiếm)",
  description: "Fetch all vehicle schedules with optional filters, pagination and sorting.",
  request: { query: VehicleScheduleQuerySchema.shape.query },
  responses: createApiResponse(z.array(VehicleScheduleSchema), "Success"),
});

vehicleScheduleRouter.get(
  "/",
  validateRequest(VehicleScheduleQuerySchema),
  vehicleScheduleController.getSchedules
);

// {
//   "route_id": 1,
//   "bus_id": 2,
//   "departure_time": "2025-06-01 08:00:00",
//   "arrival_time": "2025-06-01 10:00:00",
//   "available_seats": 30,
//   "total_seats": 40,
//   "status": "AVAILABLE"
// }

vehicleScheduleRegistry.registerPath({
  method: "post",
  path: "/vehicle-schedules",
  tags: ["VehicleSchedule"],
  operationId: "createVehicleSchedule",
  summary: "Thêm mới lịch trình xe",
  description: "Create a new vehicle schedule with the provided details.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateVehicleScheduleSchema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(VehicleScheduleSchema, "Vehicle schedule created successfully", 201),
});

vehicleScheduleRouter.post(
  "/",
  validateRequest(CreateVehicleScheduleSchema),
  vehicleScheduleController.createSchedule
);

// {
//   "available_seats": 25,
//   "status": "FULL"
// }

vehicleScheduleRegistry.registerPath({
  method: "put",
  path: "/vehicle-schedules/{id}",
  tags: ["VehicleSchedule"],
  operationId: "updateVehicleSchedule",
  summary: "Cập nhật lịch trình xe",
  description: "Update an existing vehicle schedule by ID.",
  request: {
    params: GetVehicleScheduleSchema.shape.params,
    body: {
      content: {
        "application/json": {
          schema: UpdateVehicleScheduleSchema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(VehicleScheduleSchema, "Vehicle schedule updated successfully", 200),
});

vehicleScheduleRouter.put(
  "/:id",
  validateRequest(UpdateVehicleScheduleSchema),
  vehicleScheduleController.updateSchedule
);

vehicleScheduleRegistry.registerPath({
  method: "delete",
  path: "/vehicle-schedules/{id}",
  tags: ["VehicleSchedule"],
  operationId: "deleteVehicleSchedule",
  summary: "Xóa lịch trình xe",
  description: "Delete a vehicle schedule by ID.",
  request: { params: DeleteVehicleScheduleSchema.shape.params },
  responses: createApiResponse(GetVehicleScheduleSchema, "Vehicle schedule deleted successfully"),
});

vehicleScheduleRouter.delete(
  "/:id",
  validateRequest(DeleteVehicleScheduleSchema),
  vehicleScheduleController.deleteSchedule
);