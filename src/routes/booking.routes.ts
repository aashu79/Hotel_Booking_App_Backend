import express from 'express';
import authenticator from '../utils/authenticater';
const router = express.Router();
import { createBooking, getBookings, deleteBooking, updateBooking, getSingleBooking } from '../controller/booking.controllers';

router.get('/', authenticator, getBookings);
router.get('/:id', authenticator, getSingleBooking);
router.post('/', authenticator, createBooking);
router.delete("/:bookingId", authenticator, deleteBooking);
router.put('/:bookingId', authenticator, updateBooking);

export default router;