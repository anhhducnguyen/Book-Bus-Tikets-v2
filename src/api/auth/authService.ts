import { StatusCodes } from "http-status-codes";

import type { User } from "@/api/auth/authModel";
import { AuthRepository } from "@/api/auth/authRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import bcrypt from "bcrypt";


export class AuthService {
	private authRepository: AuthRepository;

	constructor(repository: AuthRepository = new AuthRepository()) {
		this.authRepository = repository;
	}
	
	// Retrieves a single user by their ID
	async findById(id: number): Promise<ServiceResponse<User | null>> {
		try {
			const user = await this.authRepository.findByIdAsync(id);
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

    async register({ email, password }: { email: string; password: string }) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            await this.authRepository.createAsync({ email, password: hashedPassword });

            return { statusCode: 201, message: "User registered successfully" };
        } catch (error) {
            console.error("Register service error:", error);
            return { statusCode: 500, message: "Server error" };
        }
    }
}

export const authService = new AuthService();
