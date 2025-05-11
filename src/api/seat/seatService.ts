import { StatusCodes } from "http-status-codes";

import type { Seat } from "@/api/seat/seatModel";
import { SeatRepository } from "@/api/seat/seatRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class SeatService {
	private seatRepository: SeatRepository;

	constructor(repository: SeatRepository = new SeatRepository()) {
		this.seatRepository = repository;
	}

	// Retrieves all users from the database
	async findAll(): Promise<ServiceResponse<Seat[] | null>> {
		try {
			const seats = await this.seatRepository.findAllAsync();
			if (!seats || seats.length === 0) {
				return ServiceResponse.failure("No Users found", null, StatusCodes.NOT_FOUND);
			}
			return ServiceResponse.success<Seat[]>("Users found", seats);
		} catch (ex) {
			const errorMessage = `Error finding all users: $${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure(
				"An error occurred while retrieving users.",
				null,
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	async findSeatsByBusId(id: number): Promise<ServiceResponse<Seat [] | null>> {
		try {
			const seats = await this.seatRepository.findSeatsByBusIdAsync(id);
			if (!seats) {
				return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
			}
			return ServiceResponse.success<Seat[]>("Seats found", seats);
		} catch (ex) {
			const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure("An error occurred while finding user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async deleteSeatsByBusId(id: number): Promise<ServiceResponse<Seat[] | null>> {
		try {
			const seats = await this.seatRepository.findSeatsByBusIdAsync(id); 
			if (!seats) {
				return ServiceResponse.failure("Seats not found", null, StatusCodes.NOT_FOUND);
			}

			await this.seatRepository.deleteSeatsByBusIdAsync(id); 
			return ServiceResponse.success<Seat[]>("Seats deleted", seats);
		} catch (ex) {
			const errorMessage = `Error deleting seats with id ${id}: ${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure("An error occurred while deleting seats.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}
}

export const seatService = new SeatService();
