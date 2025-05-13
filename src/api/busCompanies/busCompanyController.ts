import type { Request, RequestHandler, Response } from "express";
import { busCompanyService } from "@/api/busCompanies/busCompanyService";

class BusCompanyController {
  public getBusCompanies: RequestHandler = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string | undefined;
    const sortBy = (req.query.sortBy as string) || "company_name";
    const order = (req.query.order as string) || "asc";

    const serviceResponse = await busCompanyService.findAll(page, limit, search, sortBy, order);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getBusCompany: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await busCompanyService.findById(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public createBusCompany: RequestHandler = async (req: Request, res: Response) => {
    const serviceResponse = await busCompanyService.create(req.body);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public updateBusCompany: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id, 10); // Lấy ID từ URL params
    const serviceResponse = await busCompanyService.update(id, req.body); // Cập nhật với ID và body
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public deleteBusCompany: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id, 10);
    const serviceResponse = await busCompanyService.delete(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const busCompanyController = new BusCompanyController();
