import type { Request, RequestHandler, Response } from "express";
import { paymentProviderService } from "@/api/paymentProvider/paymentProvider.service";

class PaymentProviderController {
    // Lấy danh sách các nhà cung cấp thanh toán
    public getPaymentProviders: RequestHandler = async (req: Request, res: Response) => {
        try {
            const { page = 1, limit = 10, sortBy = "id", order = "asc", search = "" } = req.query;

            const serviceResponse = await paymentProviderService.findAll(
                {
                    search: String(search),
                },
                {
                    page: Number(page),
                    limit: Number(limit),
                    sortBy: String(sortBy),
                    order: String(order) as "asc" | "desc",
                }
            );

            res.status(serviceResponse.statusCode).send(serviceResponse);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send({
                    statusCode: 500,
                    message: "An error occurred while retrieving payment providers.",
                    error: error.message,
                });
            } else {
                res.status(500).send({
                    statusCode: 500,
                    message: "An unexpected error occurred.",
                });
            }
        }
    };

    // Lấy thông tin chi tiết một nhà cung cấp thanh toán theo ID
    public getPaymentProviderById: RequestHandler = async (req: Request, res: Response) => {
        try {
            const providerId = Number(req.params.providerId);
            const serviceResponse = await paymentProviderService.findById(providerId);
            res.status(serviceResponse.statusCode).send(serviceResponse);
        } catch (error) {
            if (error instanceof Error) {
                res.status(500).send({
                    statusCode: 500,
                    message: `An error occurred while retrieving payment provider with ID ${req.params.providerId}.`,
                    error: error.message,
                });
            } else {
                res.status(500).send({
                    statusCode: 500,
                    message: "An unexpected error occurred.",
                });
            }
        }
    };
}

export const paymentProviderController = new PaymentProviderController();