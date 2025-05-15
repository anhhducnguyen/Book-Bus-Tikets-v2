import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import {
  BusCompanySchema,
  GetBusCompanySchema,
  CreateBusCompanySchema,
  UpdateBusCompanySchema,
  BusCompanyQuerySchema
} from "./busCompanyModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { busCompanyController } from "./busCompanyController";

import { authenticate } from "@/common/middleware/auth/authMiddleware";
import { permission } from "@/common/middleware/auth/permission";

export const busCompanyRegistry = new OpenAPIRegistry();
export const busCompanyRouter: Router = express.Router();

//  Đăng ký model cho OpenAPI
busCompanyRegistry.register("BusCompany", BusCompanySchema);

//  GET /bus-companies
busCompanyRegistry.registerPath({
  method: "get",
  path: "/bus-companies",
  tags: ["BusCompany"],
  summary: "Lấy danh sách nhà xe",
  request: { query: BusCompanyQuerySchema.shape.query },
  responses: createApiResponse(z.array(BusCompanySchema), "Danh sách nhà xe"),
});
busCompanyRouter.get("/", validateRequest(BusCompanyQuerySchema), busCompanyController.getCompanies);

//  GET /bus-companies/:id
busCompanyRegistry.registerPath({
  method: "get",
  path: "/bus-companies/{id}",
  tags: ["BusCompany"],
  summary: "Lấy thông tin nhà xe",
  request: { params: GetBusCompanySchema.shape.params },
  responses: createApiResponse(BusCompanySchema, "Chi tiết nhà xe"),
});
busCompanyRouter.get("/:id", validateRequest(GetBusCompanySchema), busCompanyController.getCompany);

//  POST /bus-companies
busCompanyRegistry.registerPath({
  method: "post",
  path: "/bus-companies",
  tags: ["BusCompany"],
  summary: "Tạo mới nhà xe",
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateBusCompanySchema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(BusCompanySchema, "Tạo nhà xe thành công"),
});
busCompanyRouter.post("/", authenticate, permission, validateRequest(CreateBusCompanySchema), busCompanyController.createCompany);

//  PUT /bus-companies/:id
busCompanyRegistry.registerPath({
  method: "put",
  path: "/bus-companies/{id}",
  tags: ["BusCompany"],
  summary: "Cập nhật nhà xe",
  request: {
    params: UpdateBusCompanySchema.shape.params,
    body: {
      content: {
        "application/json": {
          schema: UpdateBusCompanySchema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(BusCompanySchema, "Cập nhật thành công"),
});
busCompanyRouter.put("/:id", authenticate, permission, validateRequest(UpdateBusCompanySchema), busCompanyController.updateCompany);

//  DELETE /bus-companies/:id
busCompanyRegistry.registerPath({
  method: "delete",
  path: "/bus-companies/{id}",
  tags: ["BusCompany"],
  summary: "Xóa nhà xe",
  request: { params: GetBusCompanySchema.shape.params },
  responses: createApiResponse(z.object({ success: z.boolean() }), "Xóa thành công"),
});
busCompanyRouter.delete("/:id", authenticate, permission, validateRequest(GetBusCompanySchema), busCompanyController.deleteCompany);
