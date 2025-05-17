import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { 
	GetUserSchema,
	UserSchema, 
	CreateUserSchema,
	UserQuerySchema,
	PaginatedUsersResponseSchema
} from "@/api/user/userModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { userController } from "./userController";

import { authenticate } from "@/common/middleware/auth/authMiddleware";
import { permission } from "@/common/middleware/auth/permission";

export const userRegistry = new OpenAPIRegistry();
export const userRouter: Router = express.Router();

userRouter.use(authenticate);

userRegistry.register("User", UserSchema);

userRegistry.registerPath({
	method: "get",
	path: "/users",
	tags: ["User"],
	summary: "Hiển thị tất cả người dùng (phân trang, sắp xếp theo id hoặc email, tìm kiếm theo email)",
	request: { query: UserQuerySchema.shape.query },
	// responses: createApiResponse(z.array(UserSchema), "Success"),
	responses: createApiResponse(PaginatedUsersResponseSchema, "Success"),

});

userRouter.get("/",
	permission,
	userController.getUsers
);

userRegistry.registerPath({
	method: "get",
	path: "/users/{id}",
	tags: ["User"],
	summary: "Lấy thông tin người dùng theo id",
	request: { params: GetUserSchema.shape.params },
	responses: createApiResponse(UserSchema, "Success"),
});

userRouter.get("/:id",
	permission,
	validateRequest(GetUserSchema),
	userController.getUser
);

userRegistry.registerPath({
	method: "post",
	path: "/users",
	tags: ["User"],
	operationId: "createUser",
	summary: "Thêm mới người dùng",
		description: `
Thêm mới người dùng

  - **name**: Tên người dùng

  - **email**: Email người dùng

  - **age**: Tuổi người dùng
  
`,
	request: {
		body: {
			content: {
				"application/json": {
					schema: CreateUserSchema.shape.body,
				},
			},
		},
	},
	responses: createApiResponse(UserSchema, "User created successfully", 201),
});

userRouter.post("/",
	permission,
	validateRequest(CreateUserSchema),
	userController.createUser
);


userRegistry.registerPath({
  method: "delete",
  path: "/users/{id}",
  tags: ["User"],
  summary: "Xóa người dùng theo id",
  request: {
	params: GetUserSchema.shape.params,
  },
  responses: createApiResponse(z.object({ success: z.boolean() }), "Xóa bến xe thành công"),
});
userRouter.delete("/:id", validateRequest(GetUserSchema), userController.deleteStation);
