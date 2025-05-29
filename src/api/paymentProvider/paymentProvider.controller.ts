import { Request, Response, RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { paymentProviderService } from "@/api/paymentProvider/paymentProvider.service";
import { pick } from "@/common/utils/pick";

class PaymentProviderController {

    // Lấy danh sách tất cả nhà cung cấp thanh toán (có thể lọc và phân trang)
    public getPaymentProviders: RequestHandler = async (_req: Request, res: Response) => {
        const filter = pick(_req.query, ['provider_name', 'provider_type']);
        const options = pick(_req.query, ['sortBy', 'limit', 'page']);
        const serviceResponse = await paymentProviderService.findAll(filter, options);

        res.status(serviceResponse.statusCode).json(serviceResponse);
    };

    // Lấy thông tin chi tiết của một nhà cung cấp thanh toán theo ID
    public getPaymentProvider: RequestHandler = async (req: Request, res: Response) => {
        const id = Number.parseInt(req.params.id as string, 10);
        const serviceResponse = await paymentProviderService.findById(id);

        res.status(serviceResponse.statusCode).send(serviceResponse);
    };

    // Tạo mới một nhà cung cấp thanh toán
    public createPaymentProvider: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        const paymentProviderData = req.body;
        try {
            if (!paymentProviderData) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: "Dữ liệu nhà cung cấp thanh toán là bắt buộc.",
                });
                return;
            }

            const response = await paymentProviderService.createPaymentProvider(paymentProviderData);

            if (response.statusCode === StatusCodes.CREATED) {
                res.status(StatusCodes.CREATED).json({
                    paymentProvider: response.responseObject,
                    message: response.message, // "Tạo nhà cung cấp thanh toán thành công"
                });
            } else {
                res.status(response.statusCode).json({
                    message: response.message,
                });
            }
        } catch (ex) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "Đã xảy ra lỗi khi tạo nhà cung cấp thanh toán.",
            });
        }
    };

    // Xóa một nhà cung cấp thanh toán
    public deletePaymentProvider: RequestHandler = async (req: Request, res: Response) => {
        const id = Number.parseInt(req.params.id as string, 10);
        const response = await paymentProviderService.deletePaymentProvider(id);

        res.status(response.statusCode).json({
            message: response.message,
            data: response.responseObject ?? null,
        });
    };

}

export const paymentProviderController = new PaymentProviderController();