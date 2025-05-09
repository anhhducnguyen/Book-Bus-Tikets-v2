import type { User } from "@/api/user/userModel";
import { db } from "@/common/config/database"; // Đảm bảo db được cấu hình đúng

export class UserRepository {
	// Lấy tất cả người dùng
	async findAllAsync(): Promise<User[]> {
		const rows = await db<User>('users').select('*');
		return rows;
	}

	// Lấy người dùng theo ID
	async findByIdAsync(id: number): Promise<User | null> {
		const user = await db<User>('users')
			.where({ id })
			.first();
		return user ?? null;
	}

	// Tạo người dùng mới
	async createUserAsync(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
		try {
			// Tính toán thời gian cho createdAt và updatedAt nếu chưa có
			const currentTime = new Date();

			// Chèn người dùng mới vào cơ sở dữ liệu
			const [id] = await db('users').insert({
				...data,
				createdAt: currentTime,
				updatedAt: currentTime,
			  });
			  
			  const [newUser] = await db('users').where({ id }).select('*');
			  
			  return newUser;
			  
		} catch (error:unknown) {
			throw new Error(`Error creating user: ${error.message}`);
		}
	}
}
