import type { Request, RequestHandler, Response } from "express";

import { routeService } from "@/api/route/route.service";

class RouteController {
  // Lấy tất cả tuyến đường
  public getRoutes: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await routeService.findAll();
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  // Lấy thông tin chi tiết tuyến đường theo ID
  public getRoute: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await routeService.findById(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const routeController = new RouteController();