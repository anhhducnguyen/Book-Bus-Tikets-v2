import type { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { bannerService } from "./bannerService";

class BannerController {
    // Lấy banner ưu đãi nổi bật (có thể filter theo position query param)
    public getFeaturedBanners: RequestHandler = async (req: Request, res: Response) => {
        try {
            const position = req.query.position as string | undefined;
            const serviceResponse = await bannerService.getFeaturedBanners(position);
            res.status(serviceResponse.statusCode).json(serviceResponse);
        } catch (ex) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                message: "An error occurred while getting featured banners.",
            });
        }
    };
}

export const bannerController = new BannerController();
