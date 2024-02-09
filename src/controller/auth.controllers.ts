import { Request, Response } from "express";
import User, { UserType } from "../models/user.model";
import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const registerUser = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user: UserType = await req.body;
    const response = await User.create(user);
    if (response) {
      const token = jwt.sign(
        { id: response._id },
        process.env.SECRET_KEY as string,
        { expiresIn: "1d" }
      );
      res.cookie("AccessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 8600000,
      });
      res.status(200).json({
        success: true,
        message: "User registered successfully",
        data: {
          email: response.email,
          firstName: response.firstName,
          lastName: response.lastName,
        },
      });
    }
  }
);

const login = expressAsyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (email && password) {
    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    if (user) {
      const isSame = await bcrypt.compare(password, user.password);
      if (isSame) {
        const token = jwt.sign(
          { id: user.id },
          process.env.SECRET_KEY as string,
          { expiresIn: "1d" }
        );
        res.cookie("AccessToken", token, {
          // httpOnly: true,
          // secure: process.env.NODE_ENV === "production",
          maxAge: 8600000,
        });
        res.status(200).json({
          success: true,
          message: "Login Successful",
          data: {
            firstName: user.firstName,
            lastName: user.lastName,
            userType: user.userType,
          },
        });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }
    }
  } else {
    res
      .status(401)
      .json({ success: false, message: "Email or password is missing!!!" });
  }
});

const getUser = expressAsyncHandler(async (req, res) => {
  const userId = (req as any).userId;
  if (userId) {
    const user = await User.findOne({ _id: userId });
    if (user) {
      res.status(200).json({
        success: true,
        message: "user found",
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
          email: user.email,
        },
      });
    } else {
      res.status(404).json({ success: false, message: "User not found!" });
    }
  }

 
});


const logOut = (req: Request, res: Response) => {
  res.cookie("AccessToken", null, {
    expires: new Date(Date.now() + 5 * 1000),
      httpOnly: true,
  });
  res.status(200).json({success: true, message: "user logged out successfully!"});
}

export { registerUser, login,  logOut, getUser };
