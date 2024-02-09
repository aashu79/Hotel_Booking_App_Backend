import { Request, Response, query } from "express";
import expressAsyncHandler from "express-async-handler";
import cloudinary from "cloudinary";
import Hotel, { hotelType } from "../models/hotel.model";

// get all hotels
const getHotels = expressAsyncHandler(async (req: Request, res: Response) => {
  // const userId = (req as any).userId;
  const hotels = await Hotel.find();
  if (hotels.length) {
    res
      .status(200)
      .json({ success: true, message: "Hotels found..", data: hotels });
  }
  if (!hotels.length) {
    res.status(400).json({ success: true, message: "Hotels not found.." });
  }
});

////get a single hotel...
const getSingleHotel = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { hotelId } = req.params;

    const hotel = await Hotel.findOne({ _id: hotelId });
    if (hotel?.name) {
      res
        .status(200)
        .json({ success: true, message: "Hotel found", data: hotel });
    }
    if (!hotel?.name) {
      res.status(400).json({ success: false, message: "Hotel not found" });
    }
  }
);

//create a new hotel
const createHotel = expressAsyncHandler(async (req: Request, res: Response) => {
  const imageFiles = req.files as Express.Multer.File[];
  const newHotel: hotelType = req.body;
  console.log(newHotel);
  newHotel.userId = (req as any).userId;
  const imageUrl = await uploadImage(imageFiles);
  newHotel.imageUrl = imageUrl;
  newHotel.lastUpadted = new Date();
  const hotel = await Hotel.create(newHotel);
  res.status(200).json({
    success: true,
    message: "Hotel created successfully...",
    data: hotel,
  });
});

///update a hotel

const updateHotel = expressAsyncHandler(async (req: Request, res: Response) => {
  const { hotelId } = req.params;
  const updatedHotel: hotelType = req.body;
  console.log(req.body);
  const imageFiles = req.files as Express.Multer.File[];
  if (imageFiles?.length > 0) {
    const imageUrl = await uploadImage(imageFiles);
    updatedHotel.imageUrl = imageUrl;
  }

  updatedHotel.lastUpadted = new Date();

  const newHotel = await Hotel.findOneAndUpdate(
    { _id: hotelId },
    updatedHotel,
    { new: true, runValidators: true }
  );
  if (newHotel) {
    res
      .status(200)
      .json({ success: true, message: "Hotel was updated..", data: newHotel });
  } else {
    res.status(500).json({ success: false, message: "Couldn't update hotel" });
  }
});

//Search hotels
const searchHotels = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const searchQuery = searchQueryConstructor(req.query);
    var sortOptions = {};

    //Constructing sort options
    
      console.log("sortOptiosn"+req.query.sortOptions);
      switch (req.query.sortOptions) {
        case "starRating":
          sortOptions = { starRating: -1 };
          break;

        case "pricePerNightAsc":
          sortOptions = { pricePerNight: 1 };
          break;
        case "pricePerNightDesc":
          sortOptions = { pricePerNight: -1 };
          break;
      }
    
    console.log(sortOptions)
    const Hotels = await Hotel.find(searchQuery).sort(sortOptions);

    const totalHotelNumber = await Hotel.countDocuments(searchQuery);

    if (Hotels.length) {
      res.status(200).json({
        success: true,
        message: "Hotels found",
        data: Hotels,
        total: totalHotelNumber
      });
    } else {
      res.status(400).json({ success: false, message: "Hotels not found" });
    }
  }
);

//Delete Hotel

const deleteHotel = expressAsyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const response = await Hotel.findByIdAndDelete({ _id: id });
  if (response) {
    res
      .status(200)
      .json({ success: true, message: "Hotels deleted successfully" });
  } else {
    res.status(500).json({ success: false, message: "Error deleting hotel!!" });
  }
});


//get featured hotel
const getFeaturedHotels = expressAsyncHandler(async (req: Request, res:Response)=>{
  const featuredHotels = await Hotel.find({isFeatured: true});
  if(featuredHotels.length){
    res.status(200).json({success: true, message: "featured hotels found", data: featuredHotels})
  }else{
    res.status(404).json({success: false, message: "featured hotels not found!"})
  }
});





//Search query constructor function:

const searchQueryConstructor = (query: any) => {
  const constructedQuery: any = {};

  if (query.destination) {
    constructedQuery.$or = [
      { city: { $regex: new RegExp(query.destination, "i") } },
      { country: { $regex: new RegExp(query.destination, "i") } },
    ];
  }
  if (query.childCount) {
    constructedQuery.childCount = {
      $gte: query.childCount,
    };
  }
  if (query.adultCount) {
    constructedQuery.adultCount = {
      $gte: query.adultCount,
    };
  }

  return constructedQuery;
};

// Image uploading to clodinary..

async function uploadImage(imageFiles: Express.Multer.File[]) {
  const imagePromises = imageFiles?.map(async (file) => {
    const b64 = Buffer.from(file.buffer).toString("base64");
    const dataUri = "data:" + file.mimetype + ";" + "base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataUri);
    return res.url;
  });

  const imageUrl = await Promise.all(imagePromises);
  return imageUrl;
}

export {
  createHotel,
  getHotels,
  getSingleHotel,
  updateHotel,
  searchHotels,
  deleteHotel,
  getFeaturedHotels
};
