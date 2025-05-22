import { StatusCodes } from "http-status-codes";

import type { User } from "@/api/auth/authModel";
import { AuthRepository } from "@/api/auth/authRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import bcrypt from "bcrypt";
import * as crypto from "crypto";
import { sendResetEmail } from "@/common/utils/emailUtil";
import jwt from 'jsonwebtoken';

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
			return ServiceResponse.failure("An error occurred while finding user." + errorMessage, null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async register({ email, phone, password }: { email: string; phone: string; password: string }) {
		try {
			const existingUser = await this.authRepository.findOne({ email });
			if (existingUser) {
				return ServiceResponse.failure("Email already exists", null, StatusCodes.CONFLICT);
			}
			const hashedPassword = await bcrypt.hash(password, 10);
			await this.authRepository.createAsync({ email, phone, password: hashedPassword });

			return { statusCode: 201, message: "User registered successfully" };
		} catch (error) {
			return ServiceResponse.failure("An error occurred while finding user." + error, null, StatusCodes.INTERNAL_SERVER_ERROR);
		}
	}

	async resetPassword(email: string) {
		const user = await this.authRepository.findOne({ email });
		if (!user) {
			return ServiceResponse.failure("Email không tồn tại", null, 404);
		}

		const token = crypto.randomBytes(32).toString("hex");
		const expiry = Date.now() + 1000 * 60 * 30; // 30 phút

		await this.authRepository.updateResetToken(email, token, expiry);

		const link = `http://localhost:5000/reset-password?token=${token}`;
		await sendResetEmail(email, link);

		return ServiceResponse.success("Link đặt lại mật khẩu đã được gửi qua email", null, 200);
	}

	async confirmResetPassword(token: string, newPassword: string) {
		const user = await this.authRepository.findByResetToken(token);
		if (!user || user.reset_token_expiry! < Date.now()) {
			return ServiceResponse.failure("Token không hợp lệ hoặc đã hết hạn", null, 400);
		}

		const hashed = await bcrypt.hash(newPassword, 10);
		await this.authRepository.resetPasswordByToken(token, hashed);
		return ServiceResponse.success("Mật khẩu đã được đặt lại thành công", null, 200);
	}

	async logout(token: string) {
		try {
			const decoded = jwt.decode(token) as { exp?: number };
			if (!decoded?.exp) throw new Error("Invalid token");

			const expiresAt = decoded.exp * 1000; // convert to ms
			await this.authRepository.addTokenToBlacklist(token, expiresAt);
		} catch (error) {
			throw new Error("Token không hợp lệ hoặc đã hết hạn");
		}
	}

	async isTokenBlacklisted(token: string) {
		return await this.authRepository.isTokenBlacklisted(token);
	}
}

export const authService = new AuthService();
