import { StatusCodes } from "http-status-codes";  // Đảm bảo import StatusCodes
import type { Request, RequestHandler, Response } from "express";

import { userService } from "@/api/user/userService";

class UserController {
  // Lấy tất cả người dùng
  public getUsers: RequestHandler = async (_req: Request, res: Response) => {
    const serviceResponse = await userService.findAll();
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  // Lấy thông tin người dùng theo ID
  public getUser: RequestHandler = async (req: Request, res: Response) => {
    const id = Number.parseInt(req.params.id as string, 10);
    const serviceResponse = await userService.findById(id);
    res.status(serviceResponse.statusCode).send(serviceResponse);
  };

  // Tạo mới người dùng
  public createUser: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const userData = req.body;
    try {
      if (!userData) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: "User data is required." });
        return;
      }

      const response = await userService.createUser(userData);
	  
      if (response.statusCode === StatusCodes.CREATED) {
		res.status(StatusCodes.CREATED).json({
		  	user: response.responseObject,
			
		  message: response.message,
		  
		  
		});
	  
      } else {
        res.status(response.statusCode).json({ message: response.message });
      }
    } catch (ex) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: "An error occurred while creating user.",
      });
    }
  };
}

export const userController = new UserController();
