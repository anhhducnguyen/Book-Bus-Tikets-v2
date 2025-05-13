import { StatusCodes } from "http-status-codes";  // Đảm bảo import StatusCodes
import type { Request, RequestHandler, Response } from "express";

import { stationService } from "@/api/stations/stationService";

class StationController {
  // Lấy tất cả stations
  public getStations: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await stationService.findAll();
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  // Lấy thông tin station theo id
  public getStation: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await stationService.findById(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  
}

export const stationController = new StationController();
