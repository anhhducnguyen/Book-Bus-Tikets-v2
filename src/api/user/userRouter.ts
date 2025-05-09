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
	operationId: "createUser",  // Thay 'operation' bằng 'operationId'
	summary: "Create a new user",  // Thêm phần mô tả ngắn gọn về API
	requestBody: {
	  content: {
		"application/json": {
		  schema: {
			type: "object",
			properties: {
			  name: { type: "string" },
			  email: { type: "string", format: "email" },
			  age: { type: "integer", minimum: 18 },
			},
			required: ["name", "email", "age"],
		  },
		},
	  },
	},
	responses: {
	  201: {
		description: "User created successfully",
		content: {
		  "application/json": {
			schema: {
			  type: "object",
			  properties: {
				id: { type: "number" },
				name: { type: "string" },
				email: { type: "string" },
				age: { type: "number" },
				createdAt: { type: "string", format: "date-time" },
				updatedAt: { type: "string", format: "date-time" },
			  },
			},
		  },
		},
	  },
	  400: {
		description: "Invalid input data",
	  },
	  500: {
		description: "Internal server error",
	  },
	},
  });
  
  // Đăng ký phương thức POST trên userRouter
  userRouter.post("/", validateRequest(CreateUserSchema), userController.createUser);