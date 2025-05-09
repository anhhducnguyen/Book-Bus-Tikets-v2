import { StatusCodes } from "http-status-codes";

import type { Car } from "@/api/car/carModel";
import { CarRepository } from "@/api/car/carRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class CarService {
	private carRepository: CarRepository;

	constructor(repository: CarRepository = new CarRepository()) {
		this.carRepository = repository;
	}

	async findAll(filter: any, options: any) {
		try {
		  const result = await this.carRepository.findAll(filter, options);
		  return ServiceResponse.success("Buses fetched successfully", result);
		} catch (error) {
		  return ServiceResponse.failure("Failed to fetch buses", null);
		}
	}

	// Retrieves a single Car by their ID
	async findById(id: number): Promise<ServiceResponse<Car | null>> {
		try {
			const Car = await this.carRepository.findByIdAsync(id);
			if (!Car) {
				return ServiceResponse.failure("Car not found", null, StatusCodes.NOT_FOUND);
			}
			return ServiceResponse.success<Car>("Car found", Car);
		} catch (ex) {
			const errorMessage = `Error finding Car with id ${id}:, ${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure("An error occurred while finding Car.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	// Deletes a Car by their ID
	async delete(id: number): Promise<ServiceResponse<Car | null>> {
		try {
			const car = await this.carRepository.findByIdAsync(id); 
			if (!car) {
				return ServiceResponse.failure("Car not found", null, StatusCodes.NOT_FOUND);
			}

			await this.carRepository.deleteAsync(id); 
			return ServiceResponse.success<Car>("Car deleted", car);
		} catch (ex) {
			const errorMessage = `Error deleting Car with id ${id}: ${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure("An error occurred while deleting Car.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async createCar(data: Omit<Car, "id" | "created_at" | "updated_at">): Promise<ServiceResponse<Car | null>> {
		try {	  
		  const newCar = await this.carRepository.createCarAsync(data);
	  
		  return ServiceResponse.success<Car>("Car created successfully", newCar, StatusCodes.CREATED);
		} catch (ex) {
		  const errorMessage = `Error creating car: ${(ex as Error).message}`;
		  console.error("Full error object:", ex);
		  logger.error(errorMessage);
		  return ServiceResponse.failure("An error occurred while creating car.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	} 

	async updateCar(id: number, data: Partial<Car>): Promise<ServiceResponse<Car | null>> {
		try {
		  const car = await this.carRepository.findByIdAsync(id);
	
		  if (!car) {
			return ServiceResponse.failure("Car not found", null, StatusCodes.NOT_FOUND);
		  }
	
		  const updatedCar = await this.carRepository.updateAsync(id, data);
	
		  if (!updatedCar) {
			return ServiceResponse.failure("Failed to update car", null, StatusCodes.BAD_REQUEST);
		  }
	
		  return ServiceResponse.success<Car>("Car updated", updatedCar);
		} catch (ex) {
		  const errorMessage = `Error updating Car with id ${id}: ${(ex as Error).message}`;
		  logger.error(errorMessage);
		  return ServiceResponse.failure("An error occurred while updating Car.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	  }

	async generateSeatByCarId(busId: number): Promise<ServiceResponse<Car | null>> {
		try {
			// Kiem tra xem xe co ton tai khong
			const car = await this.carRepository.findByIdAsync(busId); 
			if (!car) {
				return ServiceResponse.failure("Car not found", null, StatusCodes.NOT_FOUND);
			}
			// Kiem tra xem xe da co ghe chua
			const existingSeats = await this.carRepository.existingSeats(busId);
			if (existingSeats) {
				return ServiceResponse.failure("Seats already exist for this Car", null, StatusCodes.CONFLICT);
			}

			await this.carRepository.generateSeatByCarId(busId); 
			return ServiceResponse.success<Car>("Car seats generated", car);
		} catch (ex) {
			const errorMessage = `Error generating seats for Car with id ${busId}: ${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure("An error occurred while generating seats for Car.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}
}

export const carService = new CarService();
