import express from 'express';
const router = express.Router();
import multer from 'multer';
import { createHotel, deleteHotel, getHotels, getSingleHotel, searchHotels, updateHotel, getFeaturedHotels } from '../controller/hotel.controller';
import checkAdmin from '../utils/authenticater';



const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
})
router.get("/search", searchHotels);
router.get("/featured", getFeaturedHotels)
router.get("/:hotelId", getSingleHotel);
router.get("/",checkAdmin, getHotels);
router.post('/',[checkAdmin, upload.array('imageUrl', 6)], createHotel);
router.put("/:hotelId", [checkAdmin, upload.array('imageUrl', 6)], updateHotel);

router.delete("/:id", checkAdmin, deleteHotel)


export default router;