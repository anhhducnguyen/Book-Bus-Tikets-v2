import type { Request, RequestHandler, Response } from "express";
import { stationService } from "@/api/station/stationService";

class StationController {
  public getStations: RequestHandler = async (req, res) => {
    const { page, limit, search, sortBy, order } = req.query;
    const serviceResponse = await stationService.findAll(
      Number(page) || 1,
      Number(limit) || 10,
      search as string,
      sortBy as string,
      order as string
    );
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public getStation: RequestHandler = async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).send({ message: "ID không hợp lệ" });
      return;
    }
    const serviceResponse = await stationService.findById(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public createStation: RequestHandler = async (req, res) => {
    const serviceResponse = await stationService.create(req.body);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public updateStation: RequestHandler = async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).send({ message: "ID không hợp lệ" });
      return;
    }
    const serviceResponse = await stationService.update(id, req.body);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  public deleteStation: RequestHandler = async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).send({ message: "ID không hợp lệ" });
      return;
    }
    const serviceResponse = await stationService.delete(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };
}

export const stationController = new StationController();
