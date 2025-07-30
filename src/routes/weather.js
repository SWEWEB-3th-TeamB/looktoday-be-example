import express from "express";
import passport from "passport";
import { isLoggedIn, isNotLoggedIn } from "../middlewares/index.js";
import { fetchWeather } from "../controller/weatherController.js";

const router = express.Router();

router.get("/weather", fetchWeather);
export default router;
