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
    res.status(401).json({ message: 'Chưa đăng nhập' });
    return;
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

export const authorize = (roles: string[] = []) => {
    return (req: Request, res: Response, next: NextFunction): void => {
      const user = req.user as { role: string } | undefined;
  
      if (!user) {
        res.status(401).json({ message: 'Bạn chưa đăng nhập' });
        return;
      }
  
      if (!roles.includes(user.role)) {
        res.status(403).json({ message: 'Bạn không có quyền truy cập' });
        return;
      }
  
      next();
    };
};
  
