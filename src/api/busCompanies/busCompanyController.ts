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
    try{
      const id = Number(req.params.id);
      if (isNaN(id)) throw new Error("ID không hợp lệ");

      const response = await busCompanyService.findById(id);
      res.status(response.statusCode).send(response);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
      res.status(400).send({ message: errorMessage });
    }
  };

  public createCompany: RequestHandler = async (req, res) => {
    try{
      const { company_name, descriptions} = req.body;

      // Thay đổi cách lấy file:
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const image = files["image"] ? files["image"][0]?.filename : undefined;

      const newbusCompany = {
        company_name,
        descriptions,
        image,
      };

      const serviceResponse = await busCompanyService.create(newbusCompany);
      res.status(serviceResponse.statusCode).send(serviceResponse);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
      res.status(500).send({ message: errorMessage });
    }
  };

  public updateCompany: RequestHandler = async (req, res) => {
    try{
      const id = Number(req.params.id);
      if (isNaN(id)) throw new Error("ID không hợp lệ");

      const response = await busCompanyService.update(id, req.body);
      res.status(response.statusCode).send(response);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Lỗi không xác định";
      res.status(400).send({ message: errorMessage });
    }
  };

  public deleteCompany: RequestHandler = async (req, res) => {
    const id = Number(req.params.id);
    const response = await busCompanyService.delete(id);
    res.status(response.statusCode).send(response);
  };
}

export const busCompanyController = new BusCompanyController();
