import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetRouteByIdSchema, RouteListItemSchema, RouteDetailSchema } from "@/api/route/routeModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { routeController } from "./routeController";

export const routeRegistry = new OpenAPIRegistry();
export const routeRouter: Router = express.Router();

// Đăng ký endpoint lấy chi tiết tuyến đường theo ID
// http://localhost:3000/routes/:id
routeRegistry.registerPath({
  method: "get",
  path: "/routes/{id}",
  tags: ["Routes"],
  summary: "(Khách vãng lai) Hiển thị thông tin chi tiết tuyến đường",
  request: { params: GetRouteByIdSchema.shape.params },
  responses: createApiResponse(RouteDetailSchema, "Success"),
});

routeRouter.get("/:id", validateRequest(GetRouteByIdSchema), routeController.getRoute);