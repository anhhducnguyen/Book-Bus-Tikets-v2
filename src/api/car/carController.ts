import type { Request, RequestHandler, Response } from "express";

import { carService } from "@/api/car/carService";
import { pick } from "@/common/utils/pick";

class CarController {
    public getUsers: RequestHandler = async (_req: Request, res: Response) => {
        const filter = pick(_req.query, ['name']);
        const options = pick(_req.query, ['sortBy', 'limit', 'page']);
        const serviceResponse = await carService.findAll(filter, options);     

        res.status(serviceResponse.statusCode).json(serviceResponse);
    };

    public getUser: RequestHandler = async (req: Request, res: Response) => {
        const id = Number.parseInt(req.params.id as string, 10);
        const serviceResponse = await carService.findById(id);
        res.status(serviceResponse.statusCode).send(serviceResponse);
    };

    public deleteUser: RequestHandler = async (req: Request, res: Response) => {
        const id = Number.parseInt(req.params.id as string, 10);
        const serviceResponse = await carService.delete(id);
        res.status(serviceResponse.statusCode).send(serviceResponse);
    };

    public generateSeatByCarId: RequestHandler = async (req: Request, res: Response) => {
        const busId = Number.parseInt(req.params.id as string, 10);
        const serviceResponse = await carService.generateSeatByCarId(busId);
        res.status(serviceResponse.statusCode).send(serviceResponse);
    }
}

export const carController = new CarController();
