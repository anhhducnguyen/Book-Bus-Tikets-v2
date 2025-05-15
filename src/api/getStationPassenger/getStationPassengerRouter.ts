import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { getStationPassengerSchema, CreateStationSchema } from "./getStationPassengerModel";
import { stationController } from "./getStationPassengerController";

import { authenticate } from "@/common/middleware/auth/authMiddleware";
import { permission } from "@/common/middleware/auth/permission";
import { validateRequest } from "@/common/utils/httpHandlers";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { commonValidations } from "@/common/utils/commonValidation";
import { get } from "http";

// Registry & Router
export const getStationPassengerRegistry = new OpenAPIRegistry();
export const getStationPassengerRouter: Router = express.Router();

// stationRouter.use(authenticate);

// === Register Schemas ===
getStationPassengerRegistry.register("Station", getStationPassengerSchema);



// === GET /stations/frequency - Thống kê tần suất hoạt động của bến xe ===
getStationPassengerRegistry.registerPath({
  method: "get",
  path: "/getStationPassenger/frequency",
  tags: ["Statistical"],
  operationId: "getStationFrequency",
  summary: "Thống kê tần suất hoạt động tại các bến xe (dựa vào số lượng khách)",
  responses: createApiResponse(z.any(), "Thành công"),
});
getStationPassengerRouter.get("/frequency",
  authenticate,
  permission, 
  stationController.getStationFrequency);

