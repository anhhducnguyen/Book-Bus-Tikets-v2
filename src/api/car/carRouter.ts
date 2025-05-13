import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetCarSchema, CarSchema, CreateCarSchema, UpdateCarSchema } from "@/api/car/carModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { carController } from "./carController";

import { permission } from "@/common/middleware/auth/permission";
import { authenticate } from "@/common/middleware/auth/authMiddleware";

export const carRegistry = new OpenAPIRegistry();
export const carRouter: Router = express.Router();

carRouter.use(authenticate);

carRegistry.register("Car", CarSchema);

carRegistry.registerPath({
  method: "get",
  path: "/cars/popular-garage",
  tags: ["Car"],
  summary: "Get the most popular garage",
  description: "Get the most popular garage",
  responses: createApiResponse(z.object({ garage: z.string() }), "Success"),
});

carRouter.get("/popular-garage", carController.PopularGarage);

carRegistry.registerPath({
    method: "get",
    path: "/cars",
    tags: ["Car"],
    operationId: "getCars",
    summary: "Get all cars",
    description: "Fetch all cars with optional filters and pagination.",
    responses: createApiResponse(z.array(CarSchema), "Success"),
});

carRouter.get(
  "/",
  permission, 
  carController.getCars
);

carRegistry.registerPath({
    method: "get",
    path: "/cars/{id}",
    tags: ["Car"],
    operationId: "getCar",
    summary: "Get a car by ID",
    description: "Fetch a car by its ID.",
    request: { params: GetCarSchema.shape.params },
    responses: createApiResponse(GetCarSchema, "Success"),
});

carRouter.get(
  "/:id", 
  permission,
  validateRequest(GetCarSchema), 
  carController.getCar);

carRegistry.registerPath({
    method: "delete",
    path: "/cars/{id}",
    tags: ["Car"],
    operationId: "deleteCar",
    summary: "Delete a car by ID",
    description: "Delete a car by its ID.",
    request: { params: GetCarSchema.shape.params },
    responses: createApiResponse(GetCarSchema, "Success"),
});

carRouter.delete(
  "/:id",
  permission, 
  validateRequest(GetCarSchema), 
  carController.deleteCar
);

carRegistry.registerPath({
	method: "post",
	path: "/cars",
	tags: ["Car"],
	operationId: "createCar",
	summary: "Create a new car",
  description: "Create a new car with the provided details.",
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
  permission,
  validateRequest(CreateCarSchema), 
  carController.createCar
);

carRegistry.registerPath({
  method: "put",
  path: "/cars/{id}",
  tags: ["Car"],
  operationId: "updateCar",
  summary: "Update an existing car",
  description: "Update an existing car with the provided details.",
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
  permission,
  validateRequest(UpdateCarSchema), 
  carController.updateCar
);

carRegistry.registerPath({
    method: "post",
    path: "/cars/{id}/seats",
    tags: ["Seat"],
    summary: "Generate seats for a car by bus id",
    description: "Generate seats for a car by bus id",
    request: { params: GetCarSchema.shape.params },
    responses: createApiResponse(GetCarSchema, "Success"),
});

carRouter.post(
  "/:id/seats", 
  permission,
  validateRequest(GetCarSchema), 
  carController.generateSeatByCarId
);






