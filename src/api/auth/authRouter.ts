import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { AuthSchema, SignUpSchema } from "@/api/auth/authModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { authController } from "./authController";
import passport from "passport";
import { localLoginMiddleware } from "@/common/middleware/auth/localLoginMiddleware";
import { authenticateJWT } from "@/common/middleware/auth/authenticateJWT"

export const authRegistry = new OpenAPIRegistry();
export const authRouter: Router = express.Router();

authRegistry.register("Auth", AuthSchema);

authRouter.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/auth/fail" }),
    (req, res) => {
      console.log("🔥 User google:", req.user); 
    //   res.redirect("/auth/success");
    res.json({
        data: req.user
    })
    }
);

authRegistry.registerPath({
	method: "post",
	path: "/register",
	tags: ["Auth"],
	summary: "Create a new account",
    description: "Create a new account",
        request: {
        body: {
            content: {
            "application/json": {
                schema: SignUpSchema.shape.body, 
            },
            },
        },
    },
    responses: createApiResponse(AuthSchema, "Register account successfully", 201),
});

authRouter.post(
    "/reset-password",
    authController.resetPassword  
);

authRouter.post(
    "/reset-password/confirm",
    authController.confirmResetPassword  
);
  

authRouter.post(
    "/register", 
    validateRequest(SignUpSchema), 
    authController.register
);

authRouter.post(
    "/login",
    localLoginMiddleware  
);

authRouter.post("/logout", authenticateJWT, authController.logout);







