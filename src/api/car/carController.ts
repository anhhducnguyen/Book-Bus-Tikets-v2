import type { Request, RequestHandler, Response } from "express";

import { carService } from "@/api/car/carService";

class CarController {
    public getUsers: RequestHandler = async (_req: Request, res: Response) => {
        const serviceResponse = await carService.findAll();
        res.status(serviceResponse.statusCode).send(serviceResponse);
    };

    public getUser: RequestHandler = async (req: Request, res: Response) => {
        const id = Number.parseInt(req.params.id as string, 10);
        const serviceResponse = await carService.findById(id);
        res.status(serviceResponse.statusCode).send(serviceResponse);
    };
}

export const carController = new CarController();
