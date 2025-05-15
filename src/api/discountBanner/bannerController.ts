import { Request, Response, RequestHandler } from 'express';
import { BannerService } from './bannerService';
import { StatusCodes } from "http-status-codes";

export const bannerService = new BannerService();

export class BannerController {
    async getLatestBannerById(req: Request, res: Response) {
        try {
            const position = req.params.position as string;
            const banner = await bannerService.getLatestBannerById(position);

            if (banner) {
                res.status(StatusCodes.OK).json(banner);
            } else {
                res.status(StatusCodes.NOT_FOUND).json({ message: "Banner not found" });
            }
        }
        catch (error) {
            console.error(error);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Something went wrong" });
        }
    }

}
// 1124
export const bannerController = new BannerController();
