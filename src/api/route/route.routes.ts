import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetRouteSchema, RouteSchema } from "@/api/route/route.model";
import { validateRequest } from "@/common/utils/httpHandlers";
import { routeController } from "./route.controller";

export const routeRegistry = new OpenAPIRegistry();
export const routeRouter: Router = express.Router();

// Đăng ký schema cho Route
routeRegistry.register("Route", RouteSchema);

// Đăng ký API endpoint: Lấy tất cả tuyến đường
routeRegistry.registerPath({
  method: "get",
  path: "/routes",
  tags: ["Route"],
  responses: createApiResponse(z.array(RouteSchema), "Success"),
});

routeRouter.get("/", routeController.getRoutes);

// Đăng ký API endpoint: Lấy chi tiết tuyến đường theo ID
routeRegistry.registerPath({
  method: "get",
  path: "/routes/{id}",
  tags: ["Route"],
  request: { params: GetRouteSchema.shape.params },
  responses: createApiResponse(RouteSchema, "Success"),
});

routeRouter.get("/:id", validateRequest(GetRouteSchema), routeController.getRoute);