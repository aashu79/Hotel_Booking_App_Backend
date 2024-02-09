import express from 'express';
const router = express.Router();
import { registerUser, login, getUser, logOut } from '../controller/auth.controllers';
import authenticater from '../utils/authenticater';




router.post('/register', registerUser);
router.post('/login', login);
router.get("/get-user", authenticater, getUser);
router.get('/logout', logOut);


export default router;