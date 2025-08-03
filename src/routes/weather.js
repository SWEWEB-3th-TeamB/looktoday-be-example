import express from "express";
import passport from "passport";
import { isLoggedIn, isNotLoggedIn } from "../middlewares/index.js";
import {
  fetchWeather,
  fetchWeatherwithCustomTime,
} from "../controller/weatherController.js";

const router = express.Router();

//현재 날씨 정보 조회
router.get("/weather", fetchWeather);

//특정 날짜, 시간에 대한 날씨 정보 조회
router.get("/weather/custom-time", fetchWeatherwithCustomTime);
export default router;
