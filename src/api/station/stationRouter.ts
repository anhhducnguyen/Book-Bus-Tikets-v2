import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { 
  GetStationSchema, 
  StationSchema, 
  CreateStationSchema, 
  UpdateStationSchema, 
  StationQuerySchema 
} from "@/api/station/stationModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { stationController } from "./stationController";

export const stationRegistry = new OpenAPIRegistry();
export const stationRouter: Router = express.Router();

// Đăng ký model cho OpenAPI
stationRegistry.register("Station", StationSchema);

// Lấy tất cả các bến xe (có phân trang, tìm kiếm, sắp xếp)
stationRegistry.registerPath({
  method: "get",
  path: "/stations",
  tags: ["Station"],
  summary: "Lấy tất cả các bến xe với phân trang, tìm kiếm và sắp xếp",
  request: {
    query: StationQuerySchema,
  },
  responses: createApiResponse(z.array(StationSchema), "Success"),
});
stationRouter.get("/", validateRequest(StationQuerySchema), stationController.getStations);

// Lấy thông tin chi tiết một bến xe theo ID
stationRegistry.registerPath({
  method: "get",
  path: "/stations/{id}",
  tags: ["Station"],
  summary: "Lấy thông tin chi tiết một bến xe theo ID",
  request: { params: GetStationSchema.shape.params },
  responses: createApiResponse(StationSchema, "Success"),
});
stationRouter.get("/:id", validateRequest(GetStationSchema), stationController.getStation);

// Tạo mới một bến xe
stationRegistry.registerPath({
  method: "post",
  path: "/stations",
  tags: ["Station"],
  summary: "Tạo mới một bến xe",
  request: { 
    body: {
      content: {
        "application/json": {
          schema: CreateStationSchema.shape.body
        }
      }
    }
  },
  responses: createApiResponse(StationSchema, "Tạo mới bến xe thành công"),
});
stationRouter.post("/", validateRequest(CreateStationSchema), stationController.createStation);    

// Cập nhật thông tin bến xe theo ID
stationRegistry.registerPath({
  method: "put",
  path: "/stations/{id}",
  tags: ["Station"],
  summary: "Cập nhật thông tin bến xe",
  request: { 
    params: UpdateStationSchema.shape.params,
    body: {
      content: {
        "application/json": {
          schema: UpdateStationSchema.shape.body
        }
      }
    }
  },
  responses: createApiResponse(StationSchema, "Cập nhật bến xe thành công"),
});
stationRouter.put("/:id", validateRequest(UpdateStationSchema), stationController.updateStation);

// Xóa một bến xe theo ID
stationRegistry.registerPath({
  method: "delete",
  path: "/stations/{id}",
  tags: ["Station"],
  summary: "Xóa một bến xe",
  request: { params: GetStationSchema.shape.params }, 
  responses: createApiResponse(z.object({ success: z.boolean() }), "Xóa bến xe thành công"),
});
stationRouter.delete("/:id", validateRequest(GetStationSchema), stationController.deleteStation);
