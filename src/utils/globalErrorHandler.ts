import { NextFunction, Request, Response } from "express";
import mongoose, { MongooseError } from "mongoose";

const globalErrorHandler = (error: Error, req: Request, res: Response, next: NextFunction)=>{
    console.error(error);
if(error instanceof mongoose.Error.ValidationError){
    const err = error.errors;
    const keys = Object.keys(err);
   const errorMessage =  keys.map((key)=>{
        return err[key].message
    })
    res.status(500).json({success: false, message: errorMessage})
}
else{
    res.status(500).json({success: false, message: error.message});
}
}

export default globalErrorHandler;