import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetSeatSchema, SeatSchema } from "@/api/seat/seatModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { seatController } from "./seatController";

export const seatRegistry = new OpenAPIRegistry();
export const seatRoter: Router = express.Router();

seatRegistry.register("User", SeatSchema);

seatRegistry.registerPath({
	method: "get",
	path: "/seats",
	tags: ["Seat"],
	summary: "Get all seats",
	responses: createApiResponse(z.array(SeatSchema), "Success"),
});

seatRoter.get("/", seatController.getSeats);

seatRegistry.registerPath({
	method: "get",
	path: "/seats/{id}",
	tags: ["Seat"],
	summary: "Get seat by id",
	request: { params: GetSeatSchema.shape.params },
	responses: createApiResponse(SeatSchema, "Success"),
});

seatRoter.get("/:id", validateRequest(GetSeatSchema), seatController.getSeat);

seatRegistry.registerPath({
	method: "delete",
	path: "/seats/{id}",
	tags: ["Seat"],
	summary: "Delete seat by bus id",
	request: { params: GetSeatSchema.shape.params },
	responses: createApiResponse(SeatSchema, "Success"),
});

seatRoter.delete("/:id", validateRequest(GetSeatSchema), seatController.deleteSeat);



