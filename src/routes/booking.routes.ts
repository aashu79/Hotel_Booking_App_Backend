import express from 'express';
import authenticator from '../utils/authenticater';
const router = express.Router();
import { createBooking, getBookings, deleteBooking, updateBooking } from '../controller/booking.controllers';

router.get('/', authenticator, getBookings);
router.post('/', authenticator, createBooking);
router.delete("/:bookingId", authenticator, deleteBooking);
router.patch('/:bookingId', authenticator, updateBooking);

export default router;