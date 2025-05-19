import { Request, Response, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { PaymentService } from "./getPaymentProviderService";

export const paymentService = new PaymentService();

export class PaymentController {
    // Thống kê nhà cung cấp thanh toán
    public getProviderStats: RequestHandler = async (_req: Request, res: Response): Promise<void> => {
        try {
            const response = await paymentService.getProviderStats();

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
                message: `An error occurred while getting payment provider statistics: ${errorMessage}`,
                responseObject: {},
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR
            });
        }
    };
}

export const paymentController = new PaymentController();
