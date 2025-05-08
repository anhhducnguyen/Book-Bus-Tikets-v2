import type { Car } from "@/api/car/carModel";
import { db } from "@/common/config/database"; 

export const cars: Car[] = [
    {
        id: 1,
        name: "Bus A",
        description: "City route bus",
        license_plate: "ABC-1234",
        capacity: 50,
        company_id: 1,
        created_at: new Date(),
        updated_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
    },
    {
        id: 2,
        name: "Bus B",
        description: "Suburban route bus",
        license_plate: "XYZ-5678",
        capacity: 40,
        company_id: 2,
        created_at: new Date(),
        updated_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days later
    },
];

export class CarRepository {

    async findAll(filter: any, options: { sortBy?: string; limit?: number; page?: number }) {
        const { sortBy = "id:asc", limit = 10, page = 1 } = options;
        const [sortField, sortOrder] = sortBy.split(":");
    
        const query = db<Car>("buses");
    
        if (filter.name) {
            query.where("name", "like", `%${filter.name}%`);
        }
    
        const offset = (page - 1) * limit;
    
        const data = await query.orderBy(sortField, sortOrder).limit(limit).offset(offset);
    
        const countResult = await db<Car>("buses")
            .modify((qb) => {
                if (filter.name) {
                    qb.where("name", "like", `%${filter.name}%`);
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
    
    async findByIdAsync(id: number): Promise<Car | null> {
        const rows = await db<Car>('buses').select('*').where('id', id);
        if (rows.length === 0) {
            return null;
        }
        return rows[0] as Car;
    }

    async createAsync(car: Car): Promise<Car> {
        const [id] = await db<Car>('buses').insert(car);
        const newCar = await db<Car>('buses').where('id', id).first();
        return newCar as Car;
    }    

    async deleteAsync(id: number): Promise<Car | null> {
        const rows = await db<Car>('buses').where('id', id).del().returning('*');
        if (rows.length === 0) {
            return null;
        }
        return rows[0] as Car;
    }
}
