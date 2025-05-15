import type { Request, RequestHandler, Response } from "express";

import { carService } from "@/api/car/carService";
import { pick } from "@/common/utils/pick";
import { StatusCodes } from "http-status-codes";

class CarController {
    public getCars: RequestHandler = async (_req: Request, res: Response) => {
        const filter = pick(_req.query, ['name', 'license_plate']);
        const options = pick(_req.query, ['sortBy', 'limit', 'page']);
        const serviceResponse = await carService.findAll(filter, options);     

        res.status(serviceResponse.statusCode).json(serviceResponse);
    };

    public getCar: RequestHandler = async (req: Request, res: Response) => {
        const id = Number.parseInt(req.params.id as string, 10);
        const serviceResponse = await carService.findById(id);
        res.status(serviceResponse.statusCode).send(serviceResponse);
    };

    public deleteCar: RequestHandler = async (req: Request, res: Response) => {
        const id = Number.parseInt(req.params.id as string, 10);
        const serviceResponse = await carService.delete(id);
        res.status(serviceResponse.statusCode).send(serviceResponse);
    };

    public createCar: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const carData = req.body;

        try {
          if (!carData) {
            res.status(StatusCodes.BAD_REQUEST).json({ message: "Car data is required." });
            return;
          }
      
          const response = await carService.createCar(carData);
      
          if (response.statusCode === StatusCodes.CREATED) {
            res.status(StatusCodes.CREATED).json({
              car: response.responseObject,
              message: response.message,
            });
          } else {
            res.status(response.statusCode).json({ message: response.message });
          }
      
        } catch (ex) {
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "An error occurred while creating car.",
          });
        }
    };

    public updateCar: RequestHandler = async (req: Request, res: Response) => {
        const id = Number.parseInt(req.params.id as string, 10);
        const carData = req.body;
        
        // console.log("id", id);
        // console.log("carData", carData);
        
        const serviceResponse = await carService.updateCar(id, carData);
        res.status(serviceResponse.statusCode).send(serviceResponse);
    }


    public generateSeatByCarId: RequestHandler = async (req: Request, res: Response) => {
        const busId = Number.parseInt(req.params.id as string, 10);
        const serviceResponse = await carService.generateSeatByCarId(busId);
        res.status(serviceResponse.statusCode).send(serviceResponse);
    }

    public PopularGarage: RequestHandler = async (req: Request, res: Response) => {
        const serviceResponse = await carService.PopularGarage();
        res.status(serviceResponse.statusCode).send(serviceResponse);
    }
}

export const carController = new CarController();
