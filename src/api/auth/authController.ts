import type { Request, RequestHandler, Response } from "express";

import { authService } from "@/api/auth/authService";

class AuthController {
    public getUser: RequestHandler = async (req: Request, res: Response) => {
        const id = Number.parseInt(req.params.id as string, 10);
        const serviceResponse = await authService.findById(id);
        res.status(serviceResponse.statusCode).send(serviceResponse);
    };

    public register: RequestHandler = async (req, res) => {
        const serviceResponse = await authService.register(req.body);
        res.status(serviceResponse.statusCode).send(serviceResponse);
    };
}

export const authController = new AuthController();
