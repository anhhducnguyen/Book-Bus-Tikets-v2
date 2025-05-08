import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetCarSchema, CarSchema, CreateCarSchema } from "@/api/car/carModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { carController } from "./carController";

export const carRegistry = new OpenAPIRegistry();
export const carRouter: Router = express.Router();

carRegistry.register("Car", CarSchema);

carRegistry.registerPath({
    method: "get",
    path: "/cars",
    tags: ["Car"],
    responses: createApiResponse(z.array(CarSchema), "Success"),
});

carRouter.get("/", carController.getCars);

carRegistry.registerPath({
    method: "get",
    path: "/cars/{id}",
    tags: ["Car"],
    request: { params: GetCarSchema.shape.params },
    responses: createApiResponse(GetCarSchema, "Success"),
});

carRouter.get("/:id", validateRequest(GetCarSchema), carController.getCar);

carRegistry.registerPath({
    method: "delete",
    path: "/cars/{id}",
    tags: ["Car"],
    request: { params: GetCarSchema.shape.params },
    responses: createApiResponse(GetCarSchema, "Success"),
});

carRouter.delete("/:id", validateRequest(GetCarSchema), carController.deleteCar);


carRegistry.registerPath({
	method: "post",
	path: "/cars",
	tags: ["Car"],
	operationId: "createCar",
	summary: "Create a new car",
	request: {
	  body: {
		content: {
		  "application/json": {
			schema: CreateCarSchema.shape.body, // chỉ định schema body
		  },
		},
	  },
	},
	responses: createApiResponse(CarSchema, "Car created successfully", 201),
  });
  
  carRouter.post("/", validateRequest(CreateCarSchema), carController.createCar);





