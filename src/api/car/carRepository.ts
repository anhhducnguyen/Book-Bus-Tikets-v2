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
    async findAllAsync(): Promise<Car[]> {
        // const rows = await db<Car>('users').select('*');
        // return rows as Car[];
        return cars;
    }

    async findByIdAsync(id: number): Promise<Car | null> {
        return cars.find((car) => car.id === id) || null;
    }
}
