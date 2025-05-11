import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthService } from "@/api/auth/authService";

const authService = new AuthService();

export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Không có token" });
    return;
  }

  const token = authHeader.split(" ")[1];

  // Kiểm tra trong blacklist
  const isBlacklisted = await authService.isTokenBlacklisted(token);
  if (isBlacklisted) {
    res.status(401).json({ message: "Token đã bị thu hồi" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token không hợp lệ" });
    return;
  }
};
