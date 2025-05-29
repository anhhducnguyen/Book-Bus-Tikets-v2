import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: number;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Bạn chưa đăng nhập',
      statusCode: 401,
    });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({
      success: false,
      message: 'Token không hợp lệ hoặc đã hết hạn',
      statusCode: 401
    });

  }
};

export const authorize = (roles: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user as { role: string } | undefined;

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Bạn chưa đăng nhập',
        statusCode: 401,
      });
      return;
    }

    if (!roles.includes(user.role)) {
      res.status(403).json({
        "success": false,
        message: 'Bạn không có quyền truy cập',
        statusCode: 403,
      });
      return;
    }

    next();
  };
};

