import express from "express";
import passport from "passport";
import { isLoggedIn, isNotLoggedIn } from "../middlewares/index.js";

import { createLooktoday } from "../controller/looktodayController.js";

const router = express.Router();

//looktoday 저장
router.post("/looktoday/create", isLoggedIn, createLooktoday);

//특정 날짜, 시간에 대한 날씨 정보 조회
//router.get("/weather/custom-time", fetchWeatherwithCustomTime);
export default router;
