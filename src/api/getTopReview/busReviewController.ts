import { Request, Response, RequestHandler } from 'express';
import { BusReviewService } from './busReviewService';
import { StatusCodes } from "http-status-codes";  // Đảm bảo import StatusCodes
import { z } from 'zod';

export const busReviewService = new BusReviewService();
const paramsSchema = z.object({
    arrivalStationId: z.string().regex(/^\d+$/).transform(Number),
});

export class BusReviewController {
    public getTopReviews: RequestHandler = async (req: Request, res: Response): Promise<void> => {
        try {
            // Validate and parse request params
            const { arrivalStationId } = paramsSchema.parse(req.params);

            const response = await busReviewService.getTopReviewedRoutesByDestination(arrivalStationId);

            if (response.statusCode === StatusCodes.OK) {
                res.status(StatusCodes.OK).json({
                    topRoutes: response.responseObject,
                    message: response.message,
                });
            } else {
                res.status(response.statusCode).json({
                    message: response.message,
                });
            }
        } catch (ex) {
            console.error("Error in getTopReviews:", ex);
            res.status(StatusCodes.BAD_REQUEST).json({
                message: "Invalid request parameters.",
                error: ex,
            });
        }
    };

}

export const busReviewController = new BusReviewController();
