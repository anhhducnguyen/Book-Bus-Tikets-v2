import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetStationSchema, StationSchema } from "@/api/station/stationModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { stationController } from "./stationController";

export const stationRegistry = new OpenAPIRegistry();
export const stationRouter: Router = express.Router();

stationRegistry.register("Station", StationSchema);

stationRegistry.registerPath({
  method: "get",
  path: "/stations",
  tags: ["Station"],
  responses: createApiResponse(z.array(StationSchema), "Success"),
});

stationRouter.get("/", stationController.getStations);

stationRegistry.registerPath({
  method: "get",
  path: "/stations/{id}",
  tags: ["Station"],
  request: { params: GetStationSchema.shape.params },
  responses: createApiResponse(StationSchema, "Success"),
});

stationRouter.get("/:id", validateRequest(GetStationSchema), stationController.getStation);
