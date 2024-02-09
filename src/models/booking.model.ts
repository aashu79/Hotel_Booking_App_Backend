import mongoose, { InferSchemaType } from "mongoose";

const bookingSchema = new mongoose.Schema({
    hotelId: {
        type: mongoose.Schema.ObjectId,
        ref: "Hotel",
        required: true
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "User id is required"]
    },
    childCount: {
        type: Number,
        required: [true, "child count is required"],
        default: 0,
    },
    adultCount: {
        type: Number,
        required: [true, "adult count is required"],
        default: 1,
    },
    checkInDate: {
        type: Date,
        required: [true, "check in date is required"],

    },
    checkOutDate: {
        type: Date,
        required: [true, "check out date is required"],
    },
    pricePerNight:{
        type: Number,
        required: [true, "price per night is required"]
    },
    totalPrice: {
        type: Number,
        required: [true, "Total price is required."]
    },
});

export type BookingType = InferSchemaType <typeof bookingSchema>

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;

