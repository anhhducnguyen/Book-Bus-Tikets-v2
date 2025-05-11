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
        created_at: new Date(),
        updated_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
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
        created_at: new Date(),
        updated_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
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
            role: "user"
        });
    }

    async findOne(condition: { email: string }) {
        const result = await db("users")
          .where(condition)
          .first();
        return result ?? null;
    }

    async findById(id: number): Promise<User | null> {
        const user = await db<User>("users").where({ id }).first();
        return user ?? null;
    }

    async findByGoogleId(googleId: number): Promise<User | null>{
        return await db("users").where({ google_id: googleId }).first();
    };

    async createUser(newUser: Omit<User, "id" | "created_at" | "updated_at">): Promise<number> {
        console.log(newUser);
        const result = await db("users").insert({
            ...newUser,
            created_at: new Date(),
            updated_at: new Date()
        });
        return result[0]; 
    }   
    
    async updateResetToken(email: string, token: string, expiry: number) {
        return await db("users")
          .where({ email })
          .update({ reset_token: token, reset_token_expiry: expiry });
      }
    
    async findByResetToken(token: string): Promise<User | null> {
        const user = await db<User>("users").where({ reset_token: token }).first();
        return user || null;  
    }    
    
    async resetPasswordByToken(token: string, hashedPassword: string) {
        return await db("users")
          .where({ reset_token: token })
          .update({
            password: hashedPassword,
            reset_token: null,
            reset_token_expiry: null
          });
    }

    async addTokenToBlacklist(token: string, expiresAt: number) {
      await db("token_blacklist").insert({ token, expires_at: expiresAt });
    }

    async isTokenBlacklisted(token: string): Promise<boolean> {
      const result = await db("token_blacklist").where({ token }).first();
      return !!result;
    }
}
