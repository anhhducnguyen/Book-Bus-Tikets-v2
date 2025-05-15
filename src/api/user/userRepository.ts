import type { User } from "@/api/user/userModel";
import { db } from "@/common/config/database";

export const users: User[] = [
	{
		id: 1,
		name: "Alice",
		email: "alice@example.com",
		age: 42,
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
	},
	{
		id: 2,
		name: "Robert",
		email: "Robert@example.com",
		age: 21,
		createdAt: new Date(),
		updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
	},
];

export class UserRepository {
	async findAllAsync(filter: any, options: { sortBy?: string; limit?: number; page?: number }) {
		const { sortBy = "id:asc", limit = 10, page = 1 } = options;
		const [sortField, sortOrder] = sortBy.split(":");

		const query = db<User>("users");

		if (filter.email) {
			query.where("email", "like", `%${filter.email}%`);
		}

		const offset = (page - 1) * limit;

		const data = await query.orderBy(sortField, sortOrder).limit(limit).offset(offset);

		const countResult = await db<User>("users")
			.modify((qb) => {
				if (filter.email) {
					qb.where("email", "like", `%${filter.email}%`);
				}
			})
			.count("id as count");

		const totalCount = Number((countResult[0] as { count: string }).count);

		return {
			results: data,
			page,
			limit,
			total: totalCount,
			totalPages: Math.ceil(totalCount / limit),
		};
	}

	// Lấy người dùng theo ID
	async findByIdAsync(id: number): Promise<User | null> {
		const user = await db<User>('users')
			.where({ id })
			.first();

		return user ?? null;
	}

	async createUserAsync(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
		const currentTime = new Date();

		const [id] = await db('users').insert({
			...data,
			createdAt: currentTime,
			updatedAt: currentTime,
		});

		const [newUser] = await db('users').where({ id }).select('*');

		return newUser;
	}

	async deleteAsync(id: number): Promise<boolean> {
		const deletedRows = await db<User>("users").where({ id }).del();
		return deletedRows > 0;
	  }
}
