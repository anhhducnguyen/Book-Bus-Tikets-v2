import { StatusCodes } from "http-status-codes";

import type { Car } from "@/api/car/carModel";
import { CarRepository } from "@/api/car/carRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import { json } from "express";
import {
	GenerateSeatsDto,
} from "@/api/car/carModel";

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
			return ServiceResponse.failure("Failed to fetch buses" + error, null);
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
			return ServiceResponse.failure("An error occurred while finding Car." + errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
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
			return ServiceResponse.failure("An error occurred while deleting Car." + errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	// async createCar(data: Omit<Car, "id" | "created_at" | "updated_at">): Promise<ServiceResponse<Car | null>> {
	// 	try {
	// 		const newCar = await this.carRepository.createCarAsync(data);

	// 		return ServiceResponse.success<Car>("Car created successfully", newCar, StatusCodes.CREATED);
	// 	} catch (ex) {
	// 		const errorMessage = `Error creating car: ${(ex as Error).message}`;
	// 		console.error("Full error object:", ex);
	// 		logger.error(errorMessage);
	// 		return ServiceResponse.failure("An error occurred while creating car.", null, StatusCodes.INTERNAL_SERVER_ERROR);
	// 	}
	// }

	async createCar(data: Omit<Car, "id" | "created_at" | "updated_at">): Promise<ServiceResponse<Car | null>> {
		try {
			// Kiểm tra xem đã có xe trùng tên chưa
			const existingCar = await this.carRepository.findByNameAsync(data.name);
			if (existingCar) {
				return ServiceResponse.failure(
					`Car with name ${data.name} already exists.`,
					null,
					StatusCodes.CONFLICT
				);
			}

			// Tạo xe mới nếu không bị trùng tên
			const newCar = await this.carRepository.createCarAsync(data);
			return ServiceResponse.success<Car>(
				"Car created successfully",
				newCar,
				StatusCodes.CREATED
			);
		} catch (ex) {
			const errorMessage = `Error creating car: ${(ex as Error).message}`;
			console.error("Full error object:", ex);
			logger.error(errorMessage);
			return ServiceResponse.failure(
				"An error occurred while creating car.",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR
			);
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

	async generateSeatByCarId(
		carId: number,
		payload: GenerateSeatsDto
	): Promise<ServiceResponse<any>> {
		const car = await this.carRepository.findByIdAsync(carId);
		if (!car) {
			return ServiceResponse.failure("Car not found", null, StatusCodes.NOT_FOUND);
		}

		const exists = await this.carRepository.existingSeats(carId);
		if (exists) {
			return ServiceResponse.failure("Seats already exist", null, StatusCodes.CONFLICT);
		}

		let seatNumber = 1;
		const now = new Date();
		const seatsToInsert = [];

		for (const config of payload.seat_config) {
			for (let i = 0; i < config.quantity; i++) {
				seatsToInsert.push({
					bus_id: carId,
					seat_number: `S${seatNumber++}`,
					seat_type: config.seat_type,
					price_for_type_seat: config.price,
					status: "AVAILABLE",
					created_at: now,
					updated_at: now
				});
			}
		}

		await this.carRepository.insertSeats(seatsToInsert);
		return ServiceResponse.success("Seats created successfully", seatsToInsert);
	}

	async PopularGarage(): Promise<ServiceResponse<Car[] | null>> {
		try {
			const car = await this.carRepository.getTopBusCompanies();
			if (!car) {
				return ServiceResponse.failure("Car not found", null, StatusCodes.NOT_FOUND);
			}
			return ServiceResponse.success("Top bus companies retrieved successfully", car);
		} catch (ex) {
			return ServiceResponse.failure("An error occurred while finding Car.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}
}

export const carService = new CarService();
