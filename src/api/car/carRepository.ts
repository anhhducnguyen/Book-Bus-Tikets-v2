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

    async existingSeats(busId: number): Promise<Car | null> {
        const rows = await db<Car>('seats').select('*').where('bus_id', busId);
        if (rows.length === 0) {
            return null;
        }
        return rows[0] as Car;
    }

    async generateSeatByCarId(busId: number): Promise<void> {
        const totalSeats = 40; // Số lượng ghế mặc định

        // Định nghĩa các loại ghế và mức giá tương ứng
        const seatTypes = [
        { type: 'LUXURY', maxSeats: 10, price: 150000 },
        { type: 'VIP', maxSeats: 20, price: 100000 },
        { type: 'STANDARD', maxSeats: totalSeats, price: 50000 }
        ];

        const seatsToInsert = [];

        for (let i = 1; i <= totalSeats; i++) {
        const seat = seatTypes.find((seat, index) => i <= seatTypes.slice(0, index + 1).reduce((acc, type) => acc + type.maxSeats, 0));
        
        // Kiểm tra nếu `seat` là undefined
        if (seat) {
            const seatType = seat.type;
            const price = seat.price;
        
            seatsToInsert.push({
            bus_id: busId,
            seat_number: `S${i}`,
            seat_type: seatType,
            status: 'AVAILABLE',
            price_for_type_seat: price,
            created_at: new Date(),
            updated_at: new Date()
            });
        } else {
            // Xử lý trường hợp không tìm thấy seat hợp lệ nếu cần
            console.error(`Seat for index ${i} not found`);
        }
        }

        try {
        await db('seats').insert(seatsToInsert);
        console.log(`Created ${totalSeats} seats for bus with ID ${busId}`);
        } catch (error) {
        console.error('Error creating seats:', error);
        throw error;
        }


        // const totalSeats = 40; // Số lượng ghế mặc định
        // const seatsToInsert = [];
      
        // for (let i = 1; i <= totalSeats; i++) {
        //   let seatType = 'STANDARD';
        //   let price = 50000;
      
        //   if (i <= 10) {
        //     seatType = 'LUXURY';
        //     price = 150000;
        //   } else if (i <= 20) {
        //     seatType = 'VIP';
        //     price = 100000;
        //   }
      
        //   seatsToInsert.push({
        //     bus_id: busId,
        //     seat_number: `S${i}`,
        //     seat_type: seatType,
        //     status: 'AVAILABLE',
        //     price_for_type_seat: price,
        //     created_at: new Date(),
        //     updated_at: new Date()
        //   });
        // }
      
        // try {
        //   await db('seats').insert(seatsToInsert);
        //   console.log(`Created ${totalSeats} seats for bus with ID ${busId}`);
        // } catch (error) {
        //   console.error('Error creating chair:', error);
        //   throw error;
        // }
    }
}
