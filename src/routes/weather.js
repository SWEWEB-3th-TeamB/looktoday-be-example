import express from "express";
import passport from "passport";
import { isLoggedIn, isNotLoggedIn } from "../middlewares/index.js";
import {
  fetchWeatherwithCustomTime,
  fetchLooktodayWeather,
} from "../controller/weatherController.js";

const router = express.Router();

//특정 날짜, 시간에 대한 날씨 정보 조회 :
router.get("/weather/custom-time", fetchWeatherwithCustomTime);
export default router;

router.get("/weather/observed/asos", fetchLooktodayWeather);
