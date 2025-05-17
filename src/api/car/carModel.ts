import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";


import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type Car = z.infer<typeof CarSchema>;

export const CarSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
  description: z.string().max(65535, 'Description must be less than 65535 characters').optional(),
  license_plate: z.string().min(1, 'License plate is required').max(20, 'License plate must be less than 20 characters'),
  capacity: z.number().int().min(1, 'Capacity must be greater than 0'),
  company_id: z.number().int().min(1, 'Company ID must be greater than 0'),
  created_at: z.date(),
  updated_at: z.date(),
});

export const CreateCarBodySchema = CarSchema.omit({ id: true, created_at: true, updated_at: true });

export const CreateCarSchema = z.object({
  body: CreateCarBodySchema,
});

export const UpdateCarSchema = z.object({
  body: CreateCarBodySchema.partial().openapi({
    example: {
      name: "Ford Transit",
      description: "A comfortable 16-seat van used for intercity travel.",
      license_plate: "51B-123.45",
      capacity: 16,
      company_id: 2,
    },
  }),
});

// export const CarQuerySchema = z.object({
//   query: z.object({
//     page: z.coerce.number().min(1).default(1),
//     limit: z.coerce.number().min(1).default(10),
//     name: z.string().optional(),
//     license_plate: z.string().optional(),
//     sortBy: z
//       .enum(["id:asc", "id:desc", "name:asc", "name:desc", "license_plate:asc", "license_plate:desc"])
//       .default("id:asc"),
//   }),
// });

export const CarQuerySchema = z.object({
  query: z.object({
    page: z
      .coerce.number()
      .min(1)
      .default(1)
      .describe("Số trang hiện tại (bắt đầu từ 1), dùng để phân trang"),
      
    limit: z
      .coerce.number()
      .min(1)
      .default(10)
      .describe("Số lượng bản ghi trên mỗi trang, dùng để phân trang"),
      
    name: z
      .string()
      .optional()
      .describe("Tùy chọn lọc theo tên xe, hỗ trợ tìm kiếm một phần"),
      
    license_plate: z
      .string()
      .optional()
      .describe("Tùy chọn lọc theo biển số xe, hỗ trợ tìm kiếm một phần"),
      
    sortBy: z
      .enum(["id:asc", "id:desc", "name:asc", "name:desc", "license_plate:asc", "license_plate:desc"])
      .default("id:asc")
      .describe(
        "Sắp xếp kết quả theo trường và thứ tự. Các giá trị hợp lệ:\n" +
        "- id:asc (theo ID tăng dần)\n" +
        "- id:desc (theo ID giảm dần)\n" +
        "- name:asc (theo tên tăng dần)\n" +
        "- name:desc (theo tên giảm dần)\n" +
        "- license_plate:asc (theo biển số tăng dần)\n" +
        "- license_plate:desc (theo biển số giảm dần)"
      ),
  }),
});


export const CarDescriptionItemSchema = z.object({
  company_id: z.number().describe("ID của nhà xe"),
  company_name: z.string().describe("Tên nhà xe"),
  image: z.string().url().describe("Ảnh đại diện"),
  descriptions: z.string().describe("Mô tả chi tiết nhà xe"),
  total_buses: z.number().describe("Tổng số xe"),
  avg_rating: z.number().describe("Điểm đánh giá trung bình"),
  total_reviews: z.number().describe("Tổng số lượt đánh giá"),
  buses: z.array(CarSchema).describe("Danh sách xe thuộc nhà xe"),
});

// export const CreateCarSchema = z.object({
//     body: z.object({
//       name: z.string(),
//       description: z.string(),
//       license_plate: z.string(),
//       capacity: z.number(),
//       company_id: z.number(),
//     }).openapi({
//       example: {
//         name: "Ford Transit",
//         description: "A comfortable 16-seat van used for intercity travel.",
//         license_plate: "51B-123.45",
//         capacity: 16,
//         company_id: 2,
//       },
//     }),
//   });

// Input Validation for 'GET users/:id' endpoint
export const GetCarSchema = z.object({
  params: z.object({ id: commonValidations.id }),
});