import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetUserSchema, AuthSchema } from "@/api/auth/authModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { authController } from "./authController";

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = express.Router();

authRegistry.register("Auth", AuthSchema);

authRouter.get("/:id", validateRequest(GetUserSchema), authController.getUser);
authRouter.post("/register", authController.register);



