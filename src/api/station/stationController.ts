import type { Request, RequestHandler, Response } from "express";
import { stationService } from "@/api/station/stationService";

class StationController {
  public getStations: RequestHandler = async (req: Request, res: Response) => {
    // Lấy ra các giá trị từ query và ép kiểu
    const page = Number(req.query.page) || 1;             // Mặc định là 1 nếu không có
    const limit = Number(req.query.limit) || 10;          // Mặc định là 10 nếu không có
    const search = req.query.search as string | undefined;
    const sortBy = (req.query.sortBy as string) || "name"; // Mặc định là "name"
    const order = (req.query.order as string) || "asc";    // Mặc định là "asc"

    const serviceResponse = await stationService.findAll(page, limit, search, sortBy, order);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getStation: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await stationService.findById(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public createStation: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await stationService.create(req.body);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public updateStation: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id, 10);
    const serviceResponse = await stationService.update(id, req.body);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public deleteStation: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id, 10);
    const serviceResponse = await stationService.delete(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const stationController = new StationController();
