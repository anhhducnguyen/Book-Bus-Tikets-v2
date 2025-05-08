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

	// Retrieves all cars from the database
	async findAll(): Promise<ServiceResponse<Car[] | null>> {
		try {
			const cars = await this.carRepository.findAllAsync();
			if (!cars || cars.length === 0) {
				return ServiceResponse.failure("No cars found", null, StatusCodes.NOT_FOUND);
			}
			return ServiceResponse.success<Car[]>("cars found", cars);
		} catch (ex) {
			const errorMessage = `Error finding all cars: $${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure(
				"An error occurred while retrieving cars.",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
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
}

export const carService = new CarService();
