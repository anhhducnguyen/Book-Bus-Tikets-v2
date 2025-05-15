import { Request, Response, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomerService } from "./getCustomerService";

export const customerService = new CustomerService();

export class CustomerController {
    // 📊 Thống kê khách hàng (mới, trung thành)
    public getCustomerStats: RequestHandler = async (_req: Request, res: Response): Promise<void> => {
        try {
            const response = await customerService.getCustomerStats();

            res.status(response.statusCode).json({
                message: response.message,
                data: response.responseObject,
            });
        } catch (ex) {
            const errorMessage = (ex instanceof Error) ? ex.message : "Unexpected error";
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: `Đã xảy ra lỗi khi thống kê khách hàng: ${errorMessage}`,
            });
        }
    };
}

export const customerController = new CustomerController();
