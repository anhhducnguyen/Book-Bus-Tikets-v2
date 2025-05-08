import type { Router } from "./routerModel";
import { db } from "@/common/config/database"; 



export class RouterRepository {
    async findAllAsync(): Promise<Router[]> {
        const rows = await db<Router>('router').select('*');
        return rows as Router[];
    }

    async findByIdAsync(id: number): Promise<Router | null> {
        const router = await db<Router>('router')
          .where({ id })
          .first();

        return router ?? null;
    }
}
