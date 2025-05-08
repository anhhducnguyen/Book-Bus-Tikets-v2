import type { User } from "@/api/auth/authModel";
import { db } from "@/common/config/database"; 

export const users: User[] = [
    {
        id: 1,
        email: "alice@example.com",
        password: "1234",
        username: "alice",
        reset_token: null,
        reset_token_expiry: null,
        role: "user",
        google_id: null,
        createdAt: new Date(),
        updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
    {
        id: 2,
        email: "robert@example.com",
        password: "1234",
        username: "robert",
        reset_token: null,
        reset_token_expiry: null,
        role: "user",
        google_id: null,
        createdAt: new Date(),
        updatedAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
];

export class AuthRepository {
    async findByIdAsync(id: number): Promise<User | null> {
        const user = await db<User>('users')
          .where({ id })
          .first();

        return user ?? null;
    }

    async createAsync(user: { email: string; password: string }) {
        await db("users").insert({
            email: user.email,
            password: user.password,
            username: user.email.split("@")[0], 
            role: "student"
        });
    }
}
