import type { Request, RequestHandler, Response } from "express";
import { stationService } from "./getStationPassengerService";

class GetStationPassengerController {
    // GET /stations/frequency
    public getStationFrequency: RequestHandler = async (_req: Request, res: Response) => {
        const response = await stationService.getStationFrequency();
        res.status(response.statusCode).json(response);
    };
}

export const stationController = new GetStationPassengerController();
