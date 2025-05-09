import { Request, Response, RequestHandler } from 'express';
import { BannerService } from '@/api/banners/bannerService';
import { StatusCodes } from "http-status-codes";  // Đảm bảo import StatusCodes

export const bannerService = new BannerService();

export class BannerController {
    async getAllBanner(req: Request, res: Response) {
        try {
          const page = parseInt(req.query.page as string) || 1;
          const limit = parseInt(req.query.limit as string) || 10;
      
          const allowedSortBy = ['banner_url', 'position'] as const;
          type SortBy = typeof allowedSortBy[number];
      
          const sortByParam = req.query.sortBy as string;
          const sortBy: SortBy = allowedSortBy.includes(sortByParam as SortBy)
            ? (sortByParam as SortBy)
            : 'position';
      
          const order = req.query.order === 'asc' ? 'asc' : 'desc';
      
          const banner_url = req.query.banner_url as string | undefined;
          const position = req.query.position as string | undefined;
      
          const banner = await bannerService.getAllBanner({
            page,
            limit,
            sortBy,
            order,
            banner_url,
            position,
          });
      
          res.json(banner);
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Something went wrong" });
        }
      }
      
  //Them moi tuyen duong
  public createBanner: RequestHandler = async (req: Request, res: Response): Promise<void> => {
      const bannerData = req.body;
      try {
        if (!bannerData) {
          res.status(StatusCodes.BAD_REQUEST).json({ message: "banner data is required." });
          return;
        }
  
        const response = await bannerService.createBanner(bannerData);
      
        if (response.statusCode === StatusCodes.CREATED) {
        res.status(StatusCodes.CREATED).json({
            banner: response.responseObject,
            
          message: response.message,
          
          
        });
      
        } else {
          res.status(response.statusCode).json({ message: response.message });
        }
      } catch (ex) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: "An error occurred while creating bannerbanner.",
        });
      }
    };

//xoa 1 bannerbanner
public deleteBanner: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
  
    try {
      if (isNaN(id)) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid banner id." });
        return;
      }
  
      const response = await bannerService.deleteBanner(id);
  
      if (response.statusCode === StatusCodes.OK) {
        res.status(StatusCodes.OK).json({
          message: `Banner with id ${id} deleted successfully`,
        });
      } else {
        res.status(response.statusCode).json({ message: response.message });
      }
    } catch (ex) {
      const errorMessage = (ex instanceof Error) ? ex.message : "An unexpected error occurred.";
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: `An error occurred while deleting the banner: ${errorMessage}`,
      });
    }
  };
  



 
}

export const bannerController = new BannerController();
