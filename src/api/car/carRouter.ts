import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetCarSchema, CarSchema } from "@/api/car/carModel";
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

carRouter.get("/", carController.getUsers);

carRegistry.registerPath({
    method: "get",
    path: "/cars/{id}",
    tags: ["Car"],
    request: { params: GetCarSchema.shape.params },
    responses: createApiResponse(GetCarSchema, "Success"),
});

carRouter.get("/:id", validateRequest(GetCarSchema), carController.getUser);

carRegistry.registerPath({
    method: "delete",
    path: "/cars/{id}",
    tags: ["Car"],
    request: { params: GetCarSchema.shape.params },
    responses: createApiResponse(GetCarSchema, "Success"),
});

carRouter.delete("/:id", validateRequest(GetCarSchema), carController.deleteUser);




