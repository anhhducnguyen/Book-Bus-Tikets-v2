import { StatusCodes } from "http-status-codes";

import type { User } from "@/api/user/userModel";
import { UserRepository } from "@/api/user/userRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

export class UserService {
	private userRepository: UserRepository;

	constructor(repository: UserRepository = new UserRepository()) {
		this.userRepository = repository;
	}

	// Retrieves all users from the database
	async findAll(filter: any, options: any) {
		try {
			const result = await this.userRepository.findAllAsync(filter, options);
			return ServiceResponse.success("Users fetched successfully", result);
		} catch (error) {
			return ServiceResponse.failure("Failed to fetch users", null);
		}
	}

	// Retrieves a single user by their ID
	async findById(id: number): Promise<ServiceResponse<User | null>> {
		try {
			const user = await this.userRepository.findByIdAsync(id);
			if (!user) {
				return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
			}
			return ServiceResponse.success<User>("User found", user);
		} catch (ex) {
			const errorMessage = `Error finding user with id ${id}:, ${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure("An error occurred while finding user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async createUser(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<ServiceResponse<User | null>> {
		try {
			const newUser = await this.userRepository.createUserAsync(data);
			return ServiceResponse.success<User>("User created successfully", newUser, StatusCodes.CREATED);
		} catch (ex) {
			const errorMessage = `Error creating user: ${(ex as Error).message}`;
			logger.error(errorMessage);
			return ServiceResponse.failure("An error occurred while creating user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}
}

export const userService = new UserService();
