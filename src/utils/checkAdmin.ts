import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model";




const checkAdmin = async(req: Request, res: Response, next: NextFunction)=>{
const token = req.cookies.AccessToken;
if(!token){
    res.status(403).json({success: false, message: "You are not authorized"})

}
if(token){
    try {
        const decoded =  jwt.verify(token, process.env.SECRET_KEY as string) as jwt.JwtPayload;
        const user = await User.findOne({_id: decoded.id});
       
        if(user && user.userType === "admin"){
            (req as any).userId = decoded.id;
            next();
        }

        else{
            res.status(401).json({success: false, message: "You are not authorized"}) 
        }
        
       
        
      


    } catch (error) {
        res.status(401).json({success: false, message: "You are not authorized"})
    }
}
}

export default checkAdmin;