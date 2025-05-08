import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetUserSchema, UserSchema, CreateUserSchema } from "@/api/user/userModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { userController } from "./userController";

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRegistry.register("User", UserSchema);

userRegistry.registerPath({
	method: "get",
	path: "/users",
	tags: ["User"],
	responses: createApiResponse(z.array(UserSchema), "Success"),
});

userRouter.get("/", userController.getUsers);

userRegistry.registerPath({
	method: "get",
	path: "/users/{id}",
	tags: ["User"],
	request: { params: GetUserSchema.shape.params },
	responses: createApiResponse(UserSchema, "Success"),
});

userRouter.get("/:id", validateRequest(GetUserSchema), userController.getUser);

userRegistry.registerPath({
	method: "post",
	path: "/users",
	tags: ["User"],
	operationId: "createUser",
	summary: "Create a new user",
	request: {
	  body: {
		content: {
		  "application/json": {
			schema: CreateUserSchema.shape.body, // chỉ định schema body
		  },
		},
	  },
	},
	responses: createApiResponse(UserSchema, "User created successfully", 201),
  });
  
userRouter.post("/", validateRequest(CreateUserSchema), userController.createUser);
