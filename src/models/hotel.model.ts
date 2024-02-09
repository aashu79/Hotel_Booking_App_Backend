import mongoose, { InferSchemaType } from "mongoose";


// const uniqueUserId = async(value: string)=>{
//     const userId = await Hotel.find({ userId: value});
//     if(userId.length){
//        return false;
//     }else{
//         return true;
//     }
// }

const hotelSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.ObjectId,
        ref: "User",
        unique: false,
        required: [true, "userId is required"],
        
    },
    name: {
        type: String,
        required: [true, "name is required"],
    },
    city: {
        type: String,
        required: [true, "city is required"],
    },
    country: {
        type: String,
        required: [true, "country is required"],
    },
    description: {
        type: String,
        required: [true, "description is required"],
    },
    type: {
        type: String,
        required: [true, "type is required"]
    },
    adultCount: {
        type: Number,
        required: [true, "adultCount is required"],

    },
    childCount: {
        type: Number,
        required: [true, "child cound is required"]
    },
    facilities: [{
        type: String,
        required: [true, "facilities are required"]
    }],
    pricePerNight: {
        type: Number,
        required: [true, "Price per night is required"]
    },
    isFeatured: {
        type: Boolean,
        required: [true, "Featured is required"],
        default: false
    },
    starRating: {
        type: Number,
        required: [true, "Rating is required"],
        min: [1, "Rating cannot be less than 1"],
        max: [5, "Rating cannot be more than 5"],
    },
    imageUrl: [{
        type: String,
        required: [true, "imageUrls is required"]
    }],
    lastUpadted: {
        type: Date,
        required: [true, "last Updated is required"]
    }

});

export type hotelType = InferSchemaType<typeof hotelSchema>;

const Hotel = mongoose.model<hotelType>('Hotel', hotelSchema);
export default Hotel;