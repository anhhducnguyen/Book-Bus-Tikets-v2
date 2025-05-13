import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { PaymentProviderSchema, GetPaymentProviderSchema } from "@/api/paymentProvider/paymentProvider.model";
import { validateRequest } from "@/common/utils/httpHandlers";
import { paymentProviderController } from "./paymentProvider.controller";

import { ROLES } from "@/common/constants/role";
import { authenticate, authorize } from "@/common/middleware/auth/authMiddleware";

export const paymentProviderRegistry = new OpenAPIRegistry();
export const paymentProviderRouter: Router = express.Router();

paymentProviderRegistry.register("PaymentProvider", PaymentProviderSchema);

// Endpoint: Get all payment providers
paymentProviderRegistry.registerPath({
    method: "get",
    path: "/payment-providers",
    tags: ["PaymentProvider"],
    responses: createApiResponse(z.array(PaymentProviderSchema), "Success"),
});

paymentProviderRouter.get("/",
    authenticate,
    authorize([ROLES.ADMIN, ROLES.USER]),
    paymentProviderController.getPaymentProviders
);

// Endpoint: Get a specific payment provider by ID
// paymentProviderRegistry.registerPath({
//     method: "get",
//     path: "/payment-providers/{providerId}",
//     tags: ["PaymentProvider"],
//     request: { params: GetPaymentProviderSchema.shape.params },
//     responses: createApiResponse(PaymentProviderSchema, "Success"),
// });

// paymentProviderRouter.get("/:providerId",
//     authenticate,
//     authorize([ROLES.ADMIN, ROLES.USER]),
//     validateRequest(GetPaymentProviderSchema),
//     paymentProviderController.getPaymentProviderById
// );