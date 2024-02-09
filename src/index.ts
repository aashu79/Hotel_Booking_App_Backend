import express from 'express';
import 'dotenv/config';
const app = express();
import connection from './utils/dbConnection';
import globalErrorHandler from "./utils/globalErrorHandler";
import morgan from "morgan";
import {v2 as cloudinary} from 'cloudinary';
import cookieParser from "cookie-parser"
import cors from "cors";


const corsOptions = {
    origin: ['http://localhost:5173'], // Replace with your allowed origin(s)
    credentials: true, // Optionally, enable credentials when necessary
    optionsSuccessStatus: 200 // Optionally, set the status code for preflight requests
  };

app.use(cors(corsOptions));
// Route Import
import authRoutes from "./routes/auth.routes";
import hotelRoutes from "./routes/hotel.routes";
import bookingRoutes from "./routes/booking.routes"


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });
  
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(cookieParser())

// Route
app.all("/", (req, res) => {
    res.status(200).json({message: "Welcome to Hotel Booking API"});
})
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/hotel", hotelRoutes);
app.use("/api/v1/booking",bookingRoutes);


app.use("*", (req, res)=>{
    res.status(404).json({success: false, message: "Route not found!!!!"})
})

const port = process.env.PORT || 3000;

app.use(globalErrorHandler)
app.listen(port,async()=>{
try {
    const connString = process.env.MONGOOSE_CONNECTION_STRING;
    const dbConnection = await connection(connString as string);
    console.log("Connected to datbase....");
    console.log("Listening on port: "+ port);
} catch (error) {
 console.error(error);   
}
});