import express from 'express';
import passport from 'passport';
import { isLoggedIn, isNotLoggedIn } from '../middlewares/index.js';
import { signup, login } from '../controller/auth.js';

const router = express.Router();

router.post('/signup', isNotLoggedIn, signup);
router.post('/login', isNotLoggedIn, login);
//router.get('/logout', isLoggedIn, logout);

export default router;
