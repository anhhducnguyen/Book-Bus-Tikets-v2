import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetRouteByIdSchema, RouteListItemSchema, RouteDetailSchema } from "@/api/route/route.model";
import { validateRequest } from "@/common/utils/httpHandlers";
import { routeController } from "./route.controller";

export const routeRegistry = new OpenAPIRegistry();
export const routeRouter: Router = express.Router();

// Đăng ký các schema
routeRegistry.register("RouteListItem", RouteListItemSchema);
routeRegistry.register("RouteDetail", RouteDetailSchema);

// Đăng ký endpoint lấy danh sách tuyến đường
// http://localhost:3000/routes
routeRegistry.registerPath({
  method: "get",
  path: "/routes",
  tags: ["Routes"],
  responses: createApiResponse(z.array(RouteListItemSchema), "Success"),
});

routeRouter.get("/", routeController.getRoutes);

// Đăng ký endpoint lấy chi tiết tuyến đường theo ID
// http://localhost:3000/routes/:id
routeRegistry.registerPath({
  method: "get",
  path: "/routes/{id}",
  tags: ["Routes"],
  request: { params: GetRouteByIdSchema.shape.params },
  responses: createApiResponse(RouteDetailSchema, "Success"),
});

routeRouter.get("/:id", validateRequest(GetRouteByIdSchema), routeController.getRoute);