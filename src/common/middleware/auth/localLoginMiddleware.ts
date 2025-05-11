import passport from "passport";
import { Request, Response, NextFunction } from "express";

export const localLoginMiddleware = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", { session: false }, (err: any, data: any, info: any) => {
    if (err || !data) {
      return res.status(401).json({ message: info?.message || "Login failed" });
    }

    const { token, user } = data;

    return res.status(200).json({
      "success": true,
      message: "Login successful",
      token,
      user,
      statusCode: 200,
    });
  })(req, res, next);
};


