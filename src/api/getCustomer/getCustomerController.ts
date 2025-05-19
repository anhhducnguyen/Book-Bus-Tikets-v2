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
                success: response.statusCode < 400,
                message: response.message,
                responseObject: response.responseObject,
                statusCode: response.statusCode
            });
        } catch (ex) {
            const errorMessage = (ex instanceof Error) ? ex.message : "Unexpected error";
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: `Đã xảy ra lỗi khi thống kê khách hàng: ${errorMessage}`,
                responseObject: {},
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR
            });
        }
    };
}

export const customerController = new CustomerController();
