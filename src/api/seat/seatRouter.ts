import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetSeatSchema, SeatSchema } from "@/api/seat/seatModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { seatController } from "./seatController";

import { permission } from "@/common/middleware/auth/permission";
import { authenticate } from "@/common/middleware/auth/authMiddleware";

export const seatRegistry = new OpenAPIRegistry();
export const seatRoter: Router = express.Router();

seatRoter.use(authenticate);

seatRegistry.register("User", SeatSchema);

seatRegistry.registerPath({
	method: "get",
	path: "/seats",
	tags: ["Seat"],
	summary: "Hiển thị danh sách tất cả chỗ ngồi",
	responses: createApiResponse(z.array(SeatSchema), "Success"),
});

seatRoter.get("/", permission, seatController.getSeats);

seatRegistry.registerPath({
	method: "get",
	path: "/seats/{id}",
	tags: ["Seat"],
	summary: "Hiển thị danh sách ghế theo xe",
	request: { params: GetSeatSchema.shape.params },
	responses: createApiResponse(SeatSchema, "Success"),
});

seatRoter.get("/:id", permission, validateRequest(GetSeatSchema), seatController.getSeat);

seatRegistry.registerPath({
	method: "delete",
	path: "/seats/{id}",
	tags: ["Seat"],
	summary: "Xóa ghế theo xe",
	request: { params: GetSeatSchema.shape.params },
	responses: createApiResponse(SeatSchema, "Success"),
});

seatRoter.delete("/:id", permission, validateRequest(GetSeatSchema), seatController.deleteSeat);



