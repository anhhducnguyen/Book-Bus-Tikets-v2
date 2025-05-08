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
	async findAllAsync(): Promise<User[]> {
		// const rows = await db<User>('users').select('*');
		// return rows as User[];
		return users;
	}

	async findByIdAsync(id: number): Promise<User | null> {
		const user = await db<User>('users')
		  .where({ id })
		  .first();

		return user ?? null;
	}
}
