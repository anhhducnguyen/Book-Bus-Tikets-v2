import { StatusCodes } from "http-status-codes";  // Đảm bảo import StatusCodes
import type { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { userService } from "@/api/user/userService";
import { pick } from "@/common/utils/pick";

class UserController {

	public getUsers: RequestHandler = async (_req: Request, res: Response) => {
		const filter = pick(_req.query, ['email']);
		const options = pick(_req.query, ['sortBy', 'limit', 'page']);
		const serviceResponse = await userService.findAll(filter, options);

		res.status(serviceResponse.statusCode).json(serviceResponse);
	};

	public getUser: RequestHandler = async (req: Request, res: Response) => {
		const id = Number.parseInt(req.params.id as string, 10);
		const serviceResponse = await userService.findById(id);
		res.status(serviceResponse.statusCode).send(serviceResponse);
	};

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
