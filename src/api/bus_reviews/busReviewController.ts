import { Request, Response, RequestHandler } from 'express';
import { BusReviewService } from '@/api/bus_reviews/busReviewService';
import { StatusCodes } from "http-status-codes";  // Đảm bảo import StatusCodes
import { ServiceResponse } from "@/common/models/serviceResponse";

// Định nghĩa interface cho thông tin người dùng trong req.user
interface JwtPayload {
  id: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export const busReviewService = new BusReviewService();

export class BusReviewController {
  async getAllBusReview(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const allowedSortBy = ['created_at', 'rating', 'updated_at'] as const;
      type SortBy = typeof allowedSortBy[number];

      const sortByParam = req.query.sortBy as string;
      const sortBy: SortBy = allowedSortBy.includes(sortByParam as SortBy)
        ? (sortByParam as SortBy)
        : 'created_at';

      const order = (req.query.order as string) === 'asc' ? 'asc' : 'desc';
      const rating = req.query.rating !== undefined ? Number(req.query.rating) : undefined;
      const bus_id = req.query.bus_id !== undefined ? Number(req.query.rating) : undefined;

      const company_name = req.query.company_name
        ? req.query.company_name.toString()
        : undefined;
      const bus_name = req.query.bus_name
        ? req.query.bus_name.toString()
        : undefined;
      const busReview = await busReviewService.getAllBusReview({
        page,
        limit,
        sortBy,
        order,
        company_name,
        bus_name,
        rating,
        bus_id




      });


      res.json({
        success: true,
        message: "Lấy dữ liệu thành công",

        responseObject: {
          results: busReview.results,
          page: busReview.page,
          limit: busReview.limit,
          total: busReview.total,
          totalPages: busReview.totalPages,

        },
        statusCode: 200
      });



    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Something went wrong" });
    }
  }
  //Them moi review
  public createBusReview: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    // Lấy thông tin người dùng hiện tại từ req.user
    const currentUser = req.user as JwtPayload;
    if (!currentUser || !currentUser.id) {
      res.status(StatusCodes.UNAUTHORIZED).json(
        ServiceResponse.failure("Chưa đăng nhập", null, StatusCodes.UNAUTHORIZED)
      );
      return;
    }

    const busReviewData = req.body;
    try {
      if (!busReviewData) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Review data is required." });
        return;
      }

      const response = await busReviewService.createBusReview(busReviewData, currentUser.id); // Ghi đè user_id để đảm bảo khớp với người dùng hiện tại

      if (response.statusCode === StatusCodes.CREATED) {
        res.status(StatusCodes.CREATED).json({
          suscess: 'true',
          message: response.message,
          responseObject: [
            response.responseObject
          ],
          statusCode: response.statusCode,


        });

      } else {
        res.status(response.statusCode).json({ message: response.message });
      }
    } catch (ex) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        ex,
        message: "An error occurred while creating review.",
      });
    }
  };


  //xoa 1 binh luan
  public deleteBusReview: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;  // Lấy id từ tham số đường dẫn (URL)

    try {
      // Kiểm tra xem id có hợp lệ không
      if (!id) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "Review id is required." });
        return;
      }

      // Gọi hàm xóa review trong service
      const response = await busReviewService.deleteBusReview(parseInt(id));  // Đảm bảo id là số

      if (response.statusCode === StatusCodes.OK) {
        res.status(StatusCodes.OK).json({
          success: 'true',
          message: `review  with id ${id} deleted successfully`,
          statusCode: response.statusCode,

        });
      } else {
        res.status(response.statusCode).json({ message: response.message });
      }
    } catch (ex) {
      const errorMessage = (ex instanceof Error) ? ex.message : "An unexpected error occurred.";
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: `An error occurred while deleting the route: ${errorMessage}`,
      });
    }
  };




}

export const busReviewController = new BusReviewController();
