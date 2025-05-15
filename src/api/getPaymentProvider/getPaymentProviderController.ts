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
                message: response.message,
                data: response.responseObject,
            });
        } catch (ex) {
            const errorMessage = (ex instanceof Error) ? ex.message : "Unexpected error";
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: `An error occurred while getting payment provider statistics: ${errorMessage}`,
            });
        }
    };
}

export const paymentController = new PaymentController();
