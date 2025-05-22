import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import {
  GetCarSchema,
  CarSchema,
  CreateCarSchema,
  UpdateCarSchema,
  CarQuerySchema,
  CarDescriptionItemSchema
} from "@/api/car/carModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { carController } from "./carController";

import { permission } from "@/common/middleware/auth/permission";
import { authenticate } from "@/common/middleware/auth/authMiddleware";

export const carRegistry = new OpenAPIRegistry();
export const carRouter: Router = express.Router();

// carRouter.use(authenticate);

carRegistry.register("Car", CarSchema);

carRegistry.registerPath({
  method: "get",
  path: "/cars/popular-garage",
  tags: ["Car"],
  summary: "Nhà xe phổ biến",
  // description: "Trả về top 10 nhà xe phổ biến nhất dựa trên số lượng và điểm đánh giá trung bình.",
  description: `
  Trả về top 10 nhà xe phổ biến nhất dựa trên số lượt đánh giá và điểm trung bình.

  - **company_id**: ID của nhà xe

  - **company_name**: Tên của nhà xe

  - **image**: URL ảnh đại diện

  - **descriptions**: Mô tả chi tiết

  - **total_buses**: Tổng số xe thuộc nhà xe này

  - **avg_rating**: Điểm đánh giá trung bình (làm tròn 1 chữ số thập phân)

  - **total_reviews**: Tổng số lượt đánh giá

`,

  responses: createApiResponse(z.object({ garage: z.string() }), "Success"),
});

carRouter.get("/popular-garage", carController.PopularGarage);

carRegistry.registerPath({
  method: "get",
  path: "/cars",
  tags: ["Car"],
  operationId: "getCars",
  summary: "Hiển thị tất cả xe (phân trang, sắp xếp, tìm kiếm)",
  description: "Fetch all cars with optional filters and pagination.",
  request: { query: CarQuerySchema.shape.query },
  responses: createApiResponse(z.array(CarSchema), "Success"),
  // responses: createApiResponse(z.array(CarDescriptionSchema), "Success"),
});

carRouter.get(
  "/",
  authenticate,
  permission,
  carController.getCars
);

carRegistry.registerPath({
  method: "get",
  path: "/cars/{id}",
  tags: ["Car"],
  operationId: "getCar",
  summary: "Lấy thông tin xe theo id",
  description: `
Lấy thông tin chi tiết của xe theo id của xe

  - **name**: Tên của xe

  - **descriptions**: Mô tả chi tiết

  - **license_plate**: Biển số xe

  - **capacity**: Sức chứa của xe

  - **company_id**: ID của nhà xe

`,
  request: { params: GetCarSchema.shape.params },
  responses: createApiResponse(GetCarSchema, "Success"),
});

carRouter.get(
  "/:id",
  authenticate,
  permission,
  validateRequest(GetCarSchema),
  carController.getCar);

carRegistry.registerPath({
  method: "delete",
  path: "/cars/{id}",
  tags: ["Car"],
  operationId: "deleteCar",
  summary: "Xóa xe",
  description: "Xóa xe theo id của xe",
  request: { params: GetCarSchema.shape.params },
  responses: createApiResponse(GetCarSchema, "Success"),
});

carRouter.delete(
  "/:id",
  authenticate,
  permission,
  validateRequest(GetCarSchema),
  carController.deleteCar
);

carRegistry.registerPath({
  method: "post",
  path: "/cars",
  tags: ["Car"],
  operationId: "createCar",
  summary: "Thêm mới xe",
  // description: "Create a new car with the provided details.",
  description: `
Thêm mới xe với các trường thông tin bắt buộc 

  - **name**: Tên của xe

  - **descriptions**: Mô tả chi tiết

  - **license_plate**: Biển số xe

  - **capacity**: Sức chứa của xe

  - **company_id**: ID của nhà xe

`,
  request: {
    body: {
      content: {
        "application/json": {
          schema: CreateCarSchema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(CarSchema, "Car created successfully", 201),
});

carRouter.post(
  "/",
  authenticate,
  permission,
  validateRequest(CreateCarSchema),
  carController.createCar
);

carRegistry.registerPath({
  method: "put",
  path: "/cars/{id}",
  tags: ["Car"],
  operationId: "updateCar",
  summary: "Cập nhật xe",
  description: `
Cập nhật thông tin xe theo id của xe

  - **name**: Tên của xe

  - **descriptions**: Mô tả chi tiết

  - **license_plate**: Biển số xe

  - **capacity**: Sức chứa của xe

  - **company_id**: ID của nhà xe

`,
  request: {
    params: z.object({
      id: z.number().int().openapi({
        description: "The ID of the car to update",
        example: 5,
      }),
    }),
    body: {
      content: {
        "application/json": {
          schema: UpdateCarSchema.shape.body,
        },
      },
    },
  },
  responses: createApiResponse(CarSchema, "Car updated successfully", 200),
});

carRouter.put(
  "/:id",
  authenticate,
  permission,
  validateRequest(UpdateCarSchema),
  carController.updateCar
);

carRegistry.registerPath({
  method: "post",
  path: "/cars/{id}/seats",
  tags: ["Seat"],
  summary: "Thêm mới ghế theo xe",
  description: "Generate seats for a car by bus id",
  request: { params: GetCarSchema.shape.params },
  responses: createApiResponse(GetCarSchema, "Success"),
});

carRouter.post(
  "/:id/seats",
  authenticate,
  permission,
  validateRequest(GetCarSchema),
  carController.generateSeatByCarId
);






