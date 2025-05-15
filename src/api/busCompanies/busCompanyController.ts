import type { RequestHandler } from "express";
import { busCompanyService } from "./busCompanyService";

class BusCompanyController {
  public getCompanies: RequestHandler = async (req, res) => {
    const { page, limit, search, sortBy, order } = req.query;
    const response = await busCompanyService.findAll(
      Number(page) || 1,
      Number(limit) || 10,
      search as string,
      sortBy as string,
      order as string
    );
    res.status(response.statusCode).send(response);
  };

  public getCompany: RequestHandler = async (req, res) => {
    const id = Number(req.params.id);
    const response = await busCompanyService.findById(id);
    res.status(response.statusCode).send(response);
  };

  public createCompany: RequestHandler = async (req, res) => {
    const response = await busCompanyService.create(req.body);
    res.status(response.statusCode).send(response);
  };

  public updateCompany: RequestHandler = async (req, res) => {
    const id = Number(req.params.id);
    const response = await busCompanyService.update(id, req.body);
    res.status(response.statusCode).send(response);
  };

  public deleteCompany: RequestHandler = async (req, res) => {
    const id = Number(req.params.id);
    const response = await busCompanyService.delete(id);
    res.status(response.statusCode).send(response);
  };
}

export const busCompanyController = new BusCompanyController();
