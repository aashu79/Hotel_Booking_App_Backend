import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import Booking from "../models/booking.model";

interface Booking{
    userId?: string;
roomId: string;
childCount: number;
adultCount: number;
checkInDate: Date;
checkOutDate: Date;
totalPrice: number;
}

interface updatedData{
    childCount: number;
    adultCount: number;
    checkInDate: Date;
    checkOutDate: Date;
}

const createBooking = expressAsyncHandler(async (req: Request, res: Response) => {
    const bookingData: Booking = req.body;
    bookingData.userId = (req as any).userId;
    const BookingResponse = await Booking.create(bookingData);
    if(BookingResponse){
        res.status(200).json({success: true, message: "Your booking has been created", data: BookingResponse});
    }else{
        res.status(500).json({success: false, message: "Couldn't create booking.. try again later!!"});
    }


});

const getSingleBooking = expressAsyncHandler(async (req: Request, res: Response) => {
    const {id} = req.params;
    if(id){
        const booking = await Booking.findById({_id: id});
    if(booking){
        res.status(200).json({success: false, message: "Booking found", data: booking})
    }else{
        res.status(404).json({success: false, message: "Boooking not found!"})
    }
    }else{
        throw Error("Id is missing")
    }
});

const getBookings = expressAsyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    console.log(userId);
    const Bookings = await Booking.find({userId}).populate('hotelId');
    if(Bookings.length){
        res.status(200).json({success: true, message: "Booking found", data: Bookings});
    }
    else{
        res.status(404).json({success: false, message: "No bookings found!"});
    }
});


const deleteBooking = expressAsyncHandler(async(req: Request, res: Response)=>{
    const {bookingId} = req.params;
    
    const userId = (req as any).userId;

    const booking = await Booking.findOneAndDelete({$and: [{_id: bookingId}, {userId}]});
    if(booking){
        res.status(200).json({success: true, message: "Booking deleted!!"});
    }else{
        res.status(400).json({success: false, message: "Couldn't delete booking"})
    }

});


const updateBooking = expressAsyncHandler(async(req: Request, res:Response)=>{
    const {bookingId} = req.params;
    const userId = (req as any).userId;
    const updatedData: updatedData = req.body;
    if(updatedData){
        const response = await Booking.updateOne({_id: bookingId, userId}, updatedData, {new: true, runValidators: true});
        console.log(response);
        if(response){
            res.status(200).json({success: true, message: "Booking Updated successfully"});
        }else{
            res.status(400).json({success: false, message: "Couldn't update booking.."});
        }
    }
});

export {createBooking, getBookings, deleteBooking, updateBooking, getSingleBooking};
