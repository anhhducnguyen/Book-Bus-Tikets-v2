import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { 
  GetBusCompanySchema, 
  BusCompanySchema, 
  CreateBusCompanySchema, 
  UpdateBusCompanySchema, 
  BusCompanyQuerySchema 
} from "@/api/busCompanies/busCompanyModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { busCompanyController } from "./busCompanyController";

export const busCompanyRegistry = new OpenAPIRegistry();
export const busCompanyRouter: Router = express.Router();

// Đăng ký model cho OpenAPI
busCompanyRegistry.register("BusCompany", BusCompanySchema);

// Lấy tất cả các nhà xe (có phân trang, tìm kiếm, sắp xếp)
busCompanyRegistry.registerPath({
  method: "get",
  path: "/bus-companies",
  tags: ["BusCompany"],
  summary: "Lấy tất cả các nhà xe với phân trang, tìm kiếm và sắp xếp",
  request: {
    query: BusCompanyQuerySchema,
  },
  responses: createApiResponse(z.array(BusCompanySchema), "Success"),
});
busCompanyRouter.get("/", validateRequest(BusCompanyQuerySchema), busCompanyController.getBusCompanies);

// Lấy thông tin chi tiết một nhà xe theo ID
busCompanyRegistry.registerPath({
  method: "get",
  path: "/bus-companies/{id}",
  tags: ["BusCompany"],
  summary: "Lấy thông tin chi tiết một nhà xe theo ID",
  request: { params: GetBusCompanySchema.shape.params },
  responses: createApiResponse(BusCompanySchema, "Success"),
});
busCompanyRouter.get("/:id", validateRequest(GetBusCompanySchema), busCompanyController.getBusCompany);

// Tạo mới một nhà xe
busCompanyRegistry.registerPath({
  method: "post",
  path: "/bus-companies",
  tags: ["BusCompany"],
  summary: "Tạo mới một nhà xe",
  request: { 
    body: {
      content: {
        "application/json": {
          schema: CreateBusCompanySchema.shape.body
        }
      }
    }
  },
  responses: createApiResponse(BusCompanySchema, "Tạo mới nhà xe thành công"),
});
busCompanyRouter.post("/", validateRequest(CreateBusCompanySchema), busCompanyController.createBusCompany);    

// Cập nhật thông tin nhà xe theo ID
busCompanyRegistry.registerPath({
  method: "put",
  path: "/bus-companies/{id}",
  tags: ["BusCompany"],
  summary: "Cập nhật thông tin nhà xe",
  request: { 
    params: UpdateBusCompanySchema.shape.params,
    body: {
      content: {
        "application/json": {
          schema: UpdateBusCompanySchema.shape.body
        }
      }
    }
  },
  responses: createApiResponse(BusCompanySchema, "Cập nhật nhà xe thành công"),
});
busCompanyRouter.put("/:id", validateRequest(UpdateBusCompanySchema), busCompanyController.updateBusCompany);

// Xóa một nhà xe theo ID
busCompanyRegistry.registerPath({
  method: "delete",
  path: "/bus-companies/{id}",
  tags: ["BusCompany"],
  summary: "Xóa một nhà xe",
  request: { params: GetBusCompanySchema.shape.params }, 
  responses: createApiResponse(z.object({ success: z.boolean() }), "Xóa nhà xe thành công"),
});
busCompanyRouter.delete("/:id", validateRequest(GetBusCompanySchema), busCompanyController.deleteBusCompany);
