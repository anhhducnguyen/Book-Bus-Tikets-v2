import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetRouterSchema, RouterSchema } from "@/api/router/routerModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { routerController } from "./routerController";

export const routerRegistry = new OpenAPIRegistry();
export const routerRouter: Router = express.Router();

routerRegistry.register("Router", RouterSchema);

routerRegistry.registerPath({
    method: "get",
    path: "/router",
    tags: ["Router"],
    responses: createApiResponse(z.array(RouterSchema), "Success"),
});

routerRouter.get("/", routerController.getUsers);




