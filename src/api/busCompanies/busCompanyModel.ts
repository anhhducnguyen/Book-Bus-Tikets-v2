import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

export type BusCompany = z.infer<typeof BusCompanySchema>;
export const BusCompanySchema = z.object({
  id: z.number(),
  company_name: z.string().nonempty("Tên nhà xe không được để trống"),
  image: z.string().url().optional(),
  descriptions: z.string().optional(),
  created_at: z.date(),
  updated_at: z.date(),
});

// Input Validation for 'GET stations/:id' endpoint
export const GetBusCompanySchema = z.object({
    params: z.object({ id: commonValidations.id }),
  });

// Schema cho phân trang, tìm kiếm và sắp xếp
export const BusCompanyQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).default(10),
    search: z.string().optional(),
    sortBy: z.enum(["company_name", "created_at"]).default("company_name"),
    order: z.enum(["asc", "desc"]).default("asc"),
  }),
});

// Input Validation cho tạo và cập nhật
export const CreateBusCompanySchema = z.object({
  body: z.object({
    company_name: z.string().nonempty("Tên nhà xe không được để trống"),
    image: z.string().url().optional(),
    descriptions: z.string().optional(),
  }),
});

export const UpdateBusCompanySchema = z.object({
  params: z.object({ id: commonValidations.id }),
  body: z.object({
    company_name: z.string().nonempty("Tên nhà xe không được để trống"),
    image: z.string().url().optional(),
    descriptions: z.string().optional(),
  }),
});
