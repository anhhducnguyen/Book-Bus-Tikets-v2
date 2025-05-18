import { Request, Response, RequestHandler } from 'express';
import { BannerService } from '@/api/banners/bannerService';
import { StatusCodes } from "http-status-codes";  
import { error } from 'console';

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
      
          res.json({
            success: true,
            message: "Lấy dữ liệu thành công",
            
              responseObject: {
                results: banner.results,
                page: banner.page,
                limit:banner.limit,
                total: banner.total,
                totalPages: banner.totalPages,
              
            },
            statusCode: 200
          });


          
        } catch (error) {
          console.error(error);
          res.status(500).json({ error: "Something went wrong" });
        }
      }
      
  //Them moi banner
 public createBanner: RequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const file = req.file;
    const { position } = req.body;

    if (!file || !position) {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "image and position are required." });
      return;
    }

    const bannerData = {
      banner_url: `../uploads/${file.filename}`, // đường dẫn ảnh lưu trong DB
      position,
    };

    const response = await bannerService.createBanner(bannerData);

    res.status(response.statusCode).json({
      banner: response.responseObject,
      message: response.message,
    });

  } catch (ex) {
    console.log(ex);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "An error occurred while creating banner.",
    });
  }
};


//xoa 1 banner
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
            success:'true',
            message: `banners  with id ${id} deleted successfully`,
           statusCode: response.statusCode,

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
