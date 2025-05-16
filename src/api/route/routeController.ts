import type { Request, RequestHandler, Response } from "express";
import { routeService } from "@/api/route/routeService";

class RouteController {
  // Lấy danh sách tuyến đường
  public getRoutes: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await routeService.findAll();
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  // Lấy chi tiết tuyến đường theo ID
  public getRoute: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await routeService.findById(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const routeController = new RouteController();