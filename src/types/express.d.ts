import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      fileName?: string; // Khai báo thêm thuộc tính fileName
    }
  }
}
