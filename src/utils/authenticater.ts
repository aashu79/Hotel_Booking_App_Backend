import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

const authenticater = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;
  // const token = req.cookies.AccessToken;
  const token = authorization && authorization?.split(" ").pop();
  if (!token) {
    res.status(403).json({ success: false, message: "You are not authorized" });
  }
  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.SECRET_KEY as string
      ) as jwt.JwtPayload;
      const user = await User.findOne({ _id: decoded.id });
      // console.log(user);
      if (user?.userType === "customer" || user?.userType === "admin") {
        (req as any).userId = decoded.id;
        next();
      } else {
        res
          .status(401)
          .json({ success: false, message: "You are not authorized" });
      }
    } catch (error) {
      console.log(error);
      res
        .status(401)
        .json({ success: false, message: "You are not authorized" });
    }
  }
};

export default authenticater;
